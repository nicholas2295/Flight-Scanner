import type { SearchParams, SearchResult } from "@/lib/types/search";
import { getAirportsForCountry } from "@/lib/data/airports";
import { DuffelProvider } from "@/lib/providers/duffel/adapter";
import { generateMockOffers } from "./mock-data";


/**
 * Primary city code per country — used for the single Duffel API call.
 * Duffel city codes cover multiple airports (e.g. "TYO" = NRT + HND).
 * We search only the main city to keep response time under 10s.
 */
const primaryCityCode: Record<string, string> = {
  SG: "SIN",
  JP: "TYO",  // NRT + HND
  CN: "BJS",  // PEK + PKX
  MY: "KUL",
  US: "NYC",  // JFK + LGA + EWR
  GB: "LON",  // LHR + LGW + STN + LTN + LCY
  TH: "BKK",
  KR: "SEL",  // ICN + GMP
  AU: "SYD",
  ID: "JKT",  // CGK + HLP
};

// ---------------------------------------------------------------------------
// In-memory cache — avoids re-hitting Duffel for the same search.
// Cache entries expire after 5 minutes (prices change, but not that fast).
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  result: SearchResult;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

function cacheKey(params: SearchParams): string {
  return `${params.origin}:${params.destination}:${params.departure}:${params.return ?? ""}:${params.passengers}:${params.cabin}`;
}

function getCached(params: SearchParams): SearchResult | null {
  const key = cacheKey(params);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.result;
}

function setCache(params: SearchParams, result: SearchResult): void {
  // Cap cache size to prevent memory leaks in long-running dev server
  if (cache.size > 50) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(cacheKey(params), { result, timestamp: Date.now() });
}

// ---------------------------------------------------------------------------
// Main search function
// ---------------------------------------------------------------------------

export async function searchFlights(params: SearchParams): Promise<SearchResult> {
  const originAirports = getAirportsForCountry(params.origin);
  const destAirports = getAirportsForCountry(params.destination);
  const originIatas = originAirports.map((a) => a.iata);
  const destIatas = destAirports.map((a) => a.iata);

  const token = process.env.DUFFEL_ACCESS_TOKEN;

  if (!token) {
    // No token — fall back to mock data
    const offers = generateMockOffers(params);
    return {
      params,
      offers,
      expandedOriginAirports: originIatas,
      expandedDestAirports: destIatas,
      isMock: true,
    };
  }

  // Check cache first — instant response for repeated searches
  const cached = getCached(params);
  if (cached) {
    console.log(`[Orchestrator] Cache hit for ${params.origin}→${params.destination}`);
    return cached;
  }

  const start = Date.now();

  // Make exactly ONE Duffel API call using the primary city code.
  // This is the single biggest speed win — 1 call instead of 3-6.
  const originCode = primaryCityCode[params.origin] ?? originIatas[0] ?? params.origin;
  const destCode = primaryCityCode[params.destination] ?? destIatas[0] ?? params.destination;

  const provider = new DuffelProvider(token);
  const offers = await provider.search({
    originAirport: originCode,
    destinationAirport: destCode,
    departureDate: params.departure,
    returnDate: params.return,
    passengers: params.passengers,
    cabinClass: params.cabin,
  });

  // Sort by price
  offers.sort((a, b) => a.priceAmount - b.priceAmount);

  console.log(`[Orchestrator] ${params.origin}→${params.destination}: ${offers.length} offers in ${Date.now() - start}ms`);

  const result: SearchResult = {
    params,
    offers,
    expandedOriginAirports: originIatas,
    expandedDestAirports: destIatas,
    isMock: false,
  };

  // Cache for next time
  setCache(params, result);

  return result;
}

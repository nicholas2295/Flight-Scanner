import type { FlightOffer, FlightLeg, FlightSegment } from "@/lib/types/flight";
import type { SearchParams } from "@/lib/types/search";
import { getAirportsForCountry } from "@/lib/data/airports";
import { getAirlineName } from "@/lib/data/airlines";

/** Airline pools by destination for realistic mock data */
const airlinesByRoute: Record<string, string[]> = {
  JP: ["SQ", "TR", "JL", "NH", "3K"],
  CN: ["SQ", "TR", "CA", "MU", "3K"],
  MY: ["SQ", "TR", "MH", "AK", "3K"],
  US: ["SQ", "UA", "CX"],
  GB: ["SQ", "BA", "CX"],
  TH: ["SQ", "TR", "TG", "3K"],
  KR: ["SQ", "TR", "KE", "3K"],
  AU: ["SQ", "TR", "QF", "3K"],
  ID: ["SQ", "TR", "GA", "3K"],
};

/** Base price ranges (SGD) by destination for realism */
const priceRanges: Record<string, [number, number]> = {
  MY: [80, 250],
  TH: [100, 350],
  ID: [120, 400],
  JP: [300, 900],
  CN: [250, 700],
  KR: [280, 750],
  AU: [400, 1100],
  US: [600, 1800],
  GB: [550, 1600],
};

/** Approximate flight durations in minutes from SIN */
const durationRanges: Record<string, [number, number]> = {
  MY: [55, 90],
  TH: [130, 160],
  ID: [105, 180],
  JP: [390, 450],
  CN: [300, 380],
  KR: [370, 420],
  AU: [450, 540],
  US: [1080, 1260],
  GB: [780, 840],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateMockLeg(
  origin: string,
  destination: string,
  dateStr: string,
  durationMin: number,
  durationMax: number,
  random: () => number,
  airlineCode: string,
  isDirect: boolean
): FlightLeg {
  const duration = Math.round(durationMin + random() * (durationMax - durationMin));
  const departHour = 6 + Math.floor(random() * 14); // 06:00 - 20:00
  const departMinute = Math.floor(random() * 4) * 15; // 0, 15, 30, 45

  const departureTime = `${dateStr}T${String(departHour).padStart(2, "0")}:${String(departMinute).padStart(2, "0")}:00`;
  const arrivalDate = new Date(`${dateStr}T${String(departHour).padStart(2, "0")}:${String(departMinute).padStart(2, "0")}:00Z`);
  arrivalDate.setMinutes(arrivalDate.getMinutes() + duration);
  const arrivalTime = arrivalDate.toISOString().replace("Z", "").split(".")[0];

  if (isDirect) {
    const segment: FlightSegment = {
      departureAirport: origin,
      arrivalAirport: destination,
      departureTime,
      arrivalTime,
      airlineCode,
      airlineName: getAirlineName(airlineCode),
      flightNumber: `${airlineCode}${100 + Math.floor(random() * 900)}`,
      durationMinutes: duration,
    };
    return { segments: [segment], totalDurationMinutes: duration, stops: 0 };
  }

  // 1-stop flight
  const stopDuration = 60 + Math.floor(random() * 120);
  const firstLegDuration = Math.round(duration * 0.4);
  const secondLegDuration = duration - firstLegDuration;

  const midArrival = new Date(`${departureTime}Z`);
  midArrival.setMinutes(midArrival.getMinutes() + firstLegDuration);
  const midDeparture = new Date(midArrival);
  midDeparture.setMinutes(midDeparture.getMinutes() + stopDuration);
  const finalArrival = new Date(midDeparture);
  finalArrival.setMinutes(finalArrival.getMinutes() + secondLegDuration);

  const hubAirports = ["SIN", "BKK", "HKG", "KUL", "NRT"];
  const hub = hubAirports[Math.floor(random() * hubAirports.length)];

  const seg1: FlightSegment = {
    departureAirport: origin,
    arrivalAirport: hub,
    departureTime,
    arrivalTime: midArrival.toISOString().replace("Z", "").split(".")[0],
    airlineCode,
    airlineName: getAirlineName(airlineCode),
    flightNumber: `${airlineCode}${100 + Math.floor(random() * 900)}`,
    durationMinutes: firstLegDuration,
  };
  const seg2: FlightSegment = {
    departureAirport: hub,
    arrivalAirport: destination,
    departureTime: midDeparture.toISOString().replace("Z", "").split(".")[0],
    arrivalTime: finalArrival.toISOString().replace("Z", "").split(".")[0],
    airlineCode,
    airlineName: getAirlineName(airlineCode),
    flightNumber: `${airlineCode}${100 + Math.floor(random() * 900)}`,
    durationMinutes: secondLegDuration,
  };

  return {
    segments: [seg1, seg2],
    totalDurationMinutes: duration + stopDuration,
    stops: 1,
  };
}

/**
 * Generate mock flight offers for demo purposes.
 * All offers are marked isLive: false.
 * Uses deterministic seeded random so same search params produce same results.
 */
export function generateMockOffers(params: SearchParams): FlightOffer[] {
  const dest = params.destination;
  const airlines = airlinesByRoute[dest] ?? ["SQ", "TR"];
  const [priceMin, priceMax] = priceRanges[dest] ?? [200, 800];
  const [durMin, durMax] = durationRanges[dest] ?? [180, 360];

  const originAirports = getAirportsForCountry(params.origin);
  const destAirports = getAirportsForCountry(dest);

  if (originAirports.length === 0 || destAirports.length === 0) return [];

  // Seed from search params for deterministic results
  const seedStr = `${params.origin}${params.destination}${params.departure}${params.passengers}`;
  let seedNum = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seedNum = (seedNum * 31 + seedStr.charCodeAt(i)) & 0x7fffffff;
  }
  const random = seededRandom(seedNum);

  const offers: FlightOffer[] = [];
  const offerCount = 8 + Math.floor(random() * 5); // 8-12 offers

  for (let i = 0; i < offerCount; i++) {
    const airline = airlines[Math.floor(random() * airlines.length)];
    const originAirport = originAirports[Math.floor(random() * originAirports.length)];
    const destAirport = destAirports[Math.floor(random() * destAirports.length)];
    const isDirect = random() > 0.4; // 60% direct flights
    const price = Math.round(priceMin + random() * (priceMax - priceMin));

    // Non-direct flights are cheaper
    const adjustedPrice = isDirect ? price : Math.round(price * 0.75);

    const outboundLeg = generateMockLeg(
      originAirport.iata,
      destAirport.iata,
      params.departure,
      durMin,
      durMax,
      random,
      airline,
      isDirect
    );

    let returnLeg: FlightLeg | undefined;
    if (params.return) {
      returnLeg = generateMockLeg(
        destAirport.iata,
        originAirport.iata,
        params.return,
        durMin,
        durMax,
        random,
        airline,
        isDirect
      );
    }

    offers.push({
      id: `mock-${params.origin}-${params.destination}-${i}`,
      provider: "mock",
      outboundLeg,
      returnLeg,
      priceAmount: adjustedPrice,
      priceCurrency: "SGD",
      deepLink: "#", // TODO: Phase 2 — real provider booking URLs
      isLive: false,
    });
  }

  // Sort by price ascending
  offers.sort((a, b) => a.priceAmount - b.priceAmount);
  return offers;
}

import { Duffel } from "@duffel/api";
import type {
  FlightOffer,
  FlightLeg,
  FlightSegment,
  CabinClass,
} from "@/lib/types/flight";
import type { FlightProvider, ProviderSearchParams } from "@/lib/providers/types";

/** Parse ISO 8601 duration (e.g. "PT5H30M") to minutes */
function parseDuration(iso: string | null): number {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return (parseInt(match[1] || "0") * 60) + parseInt(match[2] || "0");
}

/** Build a Google Flights search URL for outbound booking redirect */
function buildGoogleFlightsUrl(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
): string {
  const base = "https://www.google.com/travel/flights";
  const params = new URLSearchParams();
  let q = `Flights from ${origin} to ${destination} on ${departureDate}`;
  if (returnDate) {
    q += ` return ${returnDate}`;
  }
  params.set("q", q);
  return `${base}?${params.toString()}`;
}

function normalizeLeg(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slice: any,
): FlightLeg {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const segments: FlightSegment[] = (slice.segments ?? []).map((seg: any) => ({
    departureAirport: seg.origin?.iata_code ?? "",
    arrivalAirport: seg.destination?.iata_code ?? "",
    departureTime: seg.departing_at ?? "",
    arrivalTime: seg.arriving_at ?? "",
    airlineCode: seg.marketing_carrier?.iata_code ?? "",
    airlineName: seg.marketing_carrier?.name ?? seg.marketing_carrier?.iata_code ?? "",
    flightNumber: seg.marketing_carrier_flight_number ?? "",
    durationMinutes: parseDuration(seg.duration),
  }));

  return {
    segments,
    totalDurationMinutes: parseDuration(slice.duration),
    stops: Math.max(0, segments.length - 1),
  };
}

// Singleton client
let duffelClient: Duffel | null = null;
function getClient(token: string): Duffel {
  if (!duffelClient) {
    duffelClient = new Duffel({ token });
  }
  return duffelClient;
}

/**
 * Tell Duffel to wait only 4s for airline responses.
 * This is the minimum practical value — we'd rather get fewer offers fast
 * than wait 20s for every airline to respond.
 */
const SUPPLIER_TIMEOUT_MS = 4000;

export class DuffelProvider implements FlightProvider {
  readonly name = "duffel";
  private client: Duffel;

  constructor(token: string) {
    this.client = getClient(token);
  }

  async search(params: ProviderSearchParams): Promise<FlightOffer[]> {
    const label = `${params.originAirport}→${params.destinationAirport}`;
    const start = Date.now();
    try {
      const slices = [
        {
          origin: params.originAirport,
          destination: params.destinationAirport,
          departure_date: params.departureDate,
          arrival_time: null,
          departure_time: null,
        },
      ];

      if (params.returnDate) {
        slices.push({
          origin: params.destinationAirport,
          destination: params.originAirport,
          departure_date: params.returnDate,
          arrival_time: null,
          departure_time: null,
        });
      }

      const passengers: { type: "adult" }[] = Array.from(
        { length: params.passengers },
        () => ({ type: "adult" as const }),
      );

      const response = await this.client.offerRequests.create({
        slices,
        passengers,
        cabin_class: params.cabinClass as CabinClass,
        return_offers: true,
        max_connections: 1,
        supplier_timeout: SUPPLIER_TIMEOUT_MS,
      });

      const offers = response.data?.offers ?? [];
      console.log(`[Duffel] ${label}: ${offers.length} offers in ${Date.now() - start}ms`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return offers.map((offer: any) => {
        const outboundLeg = normalizeLeg(offer.slices?.[0]);
        const returnLeg = offer.slices?.[1]
          ? normalizeLeg(offer.slices[1])
          : undefined;

        return {
          id: `duffel-${offer.id}`,
          provider: "duffel",
          outboundLeg,
          returnLeg,
          priceAmount: parseFloat(offer.total_amount ?? "0"),
          priceCurrency: offer.total_currency ?? "USD",
          deepLink: buildGoogleFlightsUrl(
            params.originAirport,
            params.destinationAirport,
            params.departureDate,
            params.returnDate,
          ),
          isLive: true,
        } satisfies FlightOffer;
      });
    } catch (error) {
      console.error(
        `[Duffel] ${label} failed after ${Date.now() - start}ms:`,
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }
}

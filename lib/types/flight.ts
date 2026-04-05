export const CABIN_CLASSES = ["economy", "premium_economy", "business", "first"] as const;
export type CabinClass = (typeof CABIN_CLASSES)[number];

export interface FlightSegment {
  departureAirport: string; // IATA code
  arrivalAirport: string;
  departureTime: string; // ISO 8601
  arrivalTime: string;
  airlineCode: string; // IATA airline code
  airlineName: string; // Human-readable name from provider
  flightNumber: string;
  durationMinutes: number;
}

export interface FlightLeg {
  segments: FlightSegment[];
  totalDurationMinutes: number;
  stops: number;
}

export interface FlightOffer {
  id: string;
  provider: string;
  outboundLeg: FlightLeg;
  returnLeg?: FlightLeg;
  priceAmount: number;
  priceCurrency: string;
  deepLink: string; // URL to provider booking page
  isLive: boolean; // false = mock/demo data
}

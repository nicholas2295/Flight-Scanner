import type { CabinClass, FlightOffer } from "@/lib/types/flight";

/** Parameters for a single airport-pair search. The orchestrator expands countries into these. */
export interface ProviderSearchParams {
  originAirport: string; // IATA code
  destinationAirport: string; // IATA code
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;
  passengers: number;
  cabinClass: CabinClass;
}

/** All flight providers must implement this interface. */
export interface FlightProvider {
  readonly name: string;
  search(params: ProviderSearchParams): Promise<FlightOffer[]>;
}

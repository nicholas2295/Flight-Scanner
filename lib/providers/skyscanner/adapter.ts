import type { FlightOffer } from "@/lib/types/flight";
import type { FlightProvider, ProviderSearchParams } from "@/lib/providers/types";

/**
 * Skyscanner Flights Live Prices adapter.
 *
 * TODO: Phase 2 — wire to real Skyscanner API
 * - Requires SKYSCANNER_API_KEY env var (RapidAPI subscription)
 * - API flow: POST /flights/live/search/create → poll /flights/live/search/poll/{sessionToken}
 * - Response must be normalized into FlightOffer[]
 * - Consider rate limiting and caching (API has usage limits)
 * - Deep links come from the API response's booking URLs
 */
export class SkyscannerProvider implements FlightProvider {
  readonly name = "skyscanner";

  async search(_params: ProviderSearchParams): Promise<FlightOffer[]> {
    // TODO: Implement real Skyscanner API integration
    // 1. Check for SKYSCANNER_API_KEY in process.env
    // 2. Create search session with origin/destination IATA codes
    // 3. Poll for results (Skyscanner uses async session model)
    // 4. Normalize response into FlightOffer[] with isLive: true
    // 5. Extract deep links for booking redirect
    throw new Error(
      "Skyscanner provider not yet implemented. Using mock data via orchestrator."
    );
  }
}

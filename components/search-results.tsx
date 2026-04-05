import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap } from "lucide-react";
import type { SearchResult } from "@/lib/types/search";
import { getCountryByCode } from "@/lib/data/countries";
import { FlightCard } from "./flight-card";
import { PriceAlertForm } from "./price-alert-form";

interface SearchResultsProps {
  result: SearchResult;
}

export function SearchResults({ result }: SearchResultsProps) {
  const originName = getCountryByCode(result.params.origin)?.name ?? result.params.origin;
  const destName = getCountryByCode(result.params.destination)?.name ?? result.params.destination;
  const lowest = result.offers[0];

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">
            {originName} → {destName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {result.params.departure}
            {result.params.return ? ` — ${result.params.return}` : " (one way)"}
            {" · "}
            {result.params.passengers} passenger{result.params.passengers > 1 ? "s" : ""}
            {" · "}
            {result.params.cabin.replace("_", " ")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {result.offers.length} result{result.offers.length !== 1 ? "s" : ""}
          </span>
          {result.isMock ? (
            <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
              <AlertTriangle className="h-3 w-3" />
              Demo data
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300">
              <Zap className="h-3 w-3" />
              Live prices
            </Badge>
          )}
        </div>
      </div>

      {/* Airport expansion info */}
      {(result.expandedOriginAirports.length > 1 || result.expandedDestAirports.length > 1) && (
        <p className="text-xs text-muted-foreground">
          Searching {result.expandedOriginAirports.join(", ")} →{" "}
          {result.expandedDestAirports.join(", ")}
        </p>
      )}

      {/* Price alert — above results so it's immediately visible */}
      {lowest && (
        <PriceAlertForm
          params={result.params}
          lowestPrice={lowest.priceAmount}
          currency={lowest.priceCurrency}
        />
      )}

      {/* Results */}
      {result.offers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No flights found for this route and date.</p>
          <p className="text-sm text-muted-foreground mt-1">Try different dates or destinations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {result.offers.map((offer) => (
            <FlightCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        Prices may change at the time of booking. We redirect you to the provider to complete your purchase.
      </p>
    </div>
  );
}

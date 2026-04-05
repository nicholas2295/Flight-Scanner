import { SearchForm } from "@/components/search-form";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Hang Ban Scanner
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Find and compare the cheapest flights from Singapore.
          Search by country — we handle the airports.
        </p>
      </div>

      <SearchForm defaultOrigin="SG" />

      <p className="text-xs text-muted-foreground mt-8 max-w-sm text-center">
        Prices shown are indicative and may change at the time of booking.
        We redirect you to the provider to complete your purchase.
      </p>
    </main>
  );
}

import Link from "next/link";
import { searchParamsSchema } from "@/lib/types/search";
import { searchFlights } from "@/lib/search/orchestrator";
import { SearchResults } from "@/components/search-results";
import { SearchPageClient } from "@/components/search-page-client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;

  // Flatten array params to first value
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") flat[key] = value;
    else if (Array.isArray(value) && value.length > 0) flat[key] = value[0];
  }

  const parsed = searchParamsSchema.safeParse(flat);

  if (!parsed.success) {
    return (
      <main className="flex-1 px-4 py-12 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Invalid Search</h1>
          <p className="text-muted-foreground">
            The search parameters are missing or invalid. Please try again.
          </p>
          <ul className="text-sm text-destructive space-y-1">
            {parsed.error.issues.map((issue, i) => (
              <li key={i}>{issue.path.join(".")}: {issue.message}</li>
            ))}
          </ul>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const result = await searchFlights(parsed.data);

  return (
    <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
      <SearchPageClient params={result.params}>
        <SearchResults result={result} />
      </SearchPageClient>
    </main>
  );
}

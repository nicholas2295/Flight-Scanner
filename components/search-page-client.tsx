"use client";

import { useState } from "react";
import { SearchForm } from "@/components/search-form";
import { Skeleton } from "@/components/ui/skeleton";
import type { SearchResult } from "@/lib/types/search";

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Flight card skeletons */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-10" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-14" />
                  <Skeleton className="h-px flex-1" />
                  <Skeleton className="h-8 w-14" />
                </div>
              </div>
              <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 md:ml-4 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-6">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground text-center mt-6 animate-pulse">
        Searching for the best flights...
      </p>
    </div>
  );
}

interface SearchPageClientProps {
  params: SearchResult["params"];
  children: React.ReactNode; // The actual SearchResults rendered by the server
}

export function SearchPageClient({ params, children }: SearchPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className="mb-6">
        <SearchForm
          defaultOrigin={params.origin}
          defaultDestination={params.destination}
          defaultDeparture={params.departure}
          defaultReturn={params.return}
          defaultPassengers={params.passengers}
          defaultCabin={params.cabin}
          onLoadingChange={setIsLoading}
        />
      </div>

      {isLoading ? <LoadingSkeleton /> : children}
    </>
  );
}

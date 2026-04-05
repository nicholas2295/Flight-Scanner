"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CalendarIcon, ArrowRightLeft, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/data/countries";
import { CABIN_CLASSES } from "@/lib/types/flight";

const cabinLabels: Record<string, string> = {
  economy: "Economy",
  premium_economy: "Premium Economy",
  business: "Business",
  first: "First",
};

function safeParse(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined;
  try {
    return parseISO(dateStr);
  } catch {
    return undefined;
  }
}

interface SearchFormProps {
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultDeparture?: string; // YYYY-MM-DD
  defaultReturn?: string;   // YYYY-MM-DD
  defaultPassengers?: number;
  defaultCabin?: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function SearchForm({
  defaultOrigin = "SG",
  defaultDestination,
  defaultDeparture,
  defaultReturn,
  defaultPassengers = 1,
  defaultCabin = "economy",
  onLoadingChange,
}: SearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [origin, setOrigin] = useState(defaultOrigin);
  const [destination, setDestination] = useState(defaultDestination ?? "");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(safeParse(defaultDeparture));
  const [returnDate, setReturnDate] = useState<Date | undefined>(safeParse(defaultReturn));
  const [passengers, setPassengers] = useState(String(defaultPassengers));
  const [cabin, setCabin] = useState(defaultCabin);
  const [tripType, setTripType] = useState<"one-way" | "round-trip">(
    defaultReturn ? "round-trip" : "round-trip"
  );

  const isSearching = isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!origin || !destination || !departureDate) return;

    const params = new URLSearchParams({
      origin,
      destination,
      departure: format(departureDate, "yyyy-MM-dd"),
      passengers,
      cabin,
    });

    if (tripType === "round-trip" && returnDate) {
      params.set("return", format(returnDate, "yyyy-MM-dd"));
    }

    onLoadingChange?.(true);
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  }

  function swapOriginDest() {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      {/* Trip type toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={tripType === "round-trip" ? "default" : "outline"}
          size="sm"
          onClick={() => setTripType("round-trip")}
        >
          Round Trip
        </Button>
        <Button
          type="button"
          variant={tripType === "one-way" ? "default" : "outline"}
          size="sm"
          onClick={() => setTripType("one-way")}
        >
          One Way
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Origin + Destination row */}
        <div className="md:col-span-2 lg:col-span-2 flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="origin">From</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger id="origin" className="h-11">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mb-0.5 shrink-0"
            onClick={swapOriginDest}
            aria-label="Swap origin and destination"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 space-y-1.5">
            <Label htmlFor="destination">To</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger id="destination" className="h-11">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {countries
                  .filter((c) => c.code !== origin)
                  .map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Departure date */}
        <div className="space-y-1.5">
          <Label>Departure</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-11 justify-start text-left font-normal",
                  !departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "d MMM yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                disabled={(date) => date < tomorrow}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return date */}
        <div className="space-y-1.5">
          <Label>Return</Label>
          {tripType === "round-trip" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left font-normal",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "d MMM yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) =>
                    date < (departureDate ?? tomorrow)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              variant="outline"
              className="w-full h-11 justify-start text-left font-normal text-muted-foreground"
              disabled
            >
              One way
            </Button>
          )}
        </div>

        {/* Passengers */}
        <div className="space-y-1.5">
          <Label htmlFor="passengers">Passengers</Label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger id="passengers" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "passenger" : "passengers"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cabin class */}
        <div className="space-y-1.5">
          <Label htmlFor="cabin">Cabin</Label>
          <Select value={cabin} onValueChange={setCabin}>
            <SelectTrigger id="cabin" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CABIN_CLASSES.map((c) => (
                <SelectItem key={c} value={c}>
                  {cabinLabels[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search button */}
        <div className="md:col-span-2 lg:col-span-2 flex items-end">
          <Button
            type="submit"
            size="lg"
            className="w-full h-11"
            disabled={!origin || !destination || !departureDate || isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Flights
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

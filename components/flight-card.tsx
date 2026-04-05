import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Clock, MapPin, ExternalLink } from "lucide-react";
import type { FlightOffer, FlightLeg } from "@/lib/types/flight";

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-SG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Compute layover info between consecutive segments */
function getLayovers(leg: FlightLeg) {
  const layovers: {
    airport: string;
    durationMinutes: number;
    arrivalTime: string;
    departureTime: string;
  }[] = [];
  for (let i = 0; i < leg.segments.length - 1; i++) {
    const arrivalTime = leg.segments[i].arrivalTime;
    const departureTime = leg.segments[i + 1].departureTime;
    const durationMinutes = Math.round(
      (new Date(departureTime).getTime() - new Date(arrivalTime).getTime()) / 60000,
    );
    layovers.push({
      airport: leg.segments[i].arrivalAirport,
      durationMinutes,
      arrivalTime,
      departureTime,
    });
  }
  return layovers;
}

function LegSummary({ leg, label }: { leg: FlightLeg; label: string }) {
  const firstSeg = leg.segments[0];
  const lastSeg = leg.segments[leg.segments.length - 1];
  const layovers = getLayovers(leg);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground w-16 shrink-0">{label}</div>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-right">
            <div className="font-semibold text-sm">{formatTime(firstSeg.departureTime)}</div>
            <div className="text-xs text-muted-foreground">{firstSeg.departureAirport}</div>
          </div>

          <div className="flex flex-col items-center flex-1 min-w-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDuration(leg.totalDurationMinutes)}
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-px bg-border" />
              {layovers.length > 0 && layovers.map((l, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-amber-400 shrink-0" title={`Layover at ${l.airport}`} />
              ))}
              <Plane className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground">
              {leg.stops === 0 ? "Direct" : `${leg.stops} stop${leg.stops > 1 ? "s" : ""}`}
            </div>
          </div>

          <div>
            <div className="font-semibold text-sm">{formatTime(lastSeg.arrivalTime)}</div>
            <div className="text-xs text-muted-foreground">{lastSeg.arrivalAirport}</div>
          </div>
        </div>
      </div>

      {/* Layover details */}
      {layovers.length > 0 && (
        <div className="ml-20 space-y-1 pt-1">
          {layovers.map((l, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5"
            >
              <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
              <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                <span className="font-medium">
                  {formatDuration(l.durationMinutes)} layover in {l.airport}
                </span>
                <span className="text-amber-600">
                  Arrive {formatTime(l.arrivalTime)} · Depart {formatTime(l.departureTime)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface FlightCardProps {
  offer: FlightOffer;
}

export function FlightCard({ offer }: FlightCardProps) {
  const firstSeg = offer.outboundLeg.segments[0];
  const airlineName = firstSeg.airlineName;
  const airlineCode = firstSeg.airlineCode;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Airline + legs */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{airlineName}</span>
              <Badge variant="outline" className="text-xs">
                {airlineCode}
              </Badge>
              {!offer.isLive && (
                <Badge variant="secondary" className="text-xs">
                  Demo
                </Badge>
              )}
            </div>

            <LegSummary leg={offer.outboundLeg} label="Depart" />
            {offer.returnLeg && (
              <LegSummary leg={offer.returnLeg} label="Return" />
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 md:ml-4 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-6">
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${offer.priceAmount}
              </div>
              <div className="text-xs text-muted-foreground">
                {offer.priceCurrency} total
              </div>
            </div>
            {offer.deepLink && offer.deepLink !== "#" ? (
              <Button asChild size="sm" className="shrink-0">
                <a
                  href={offer.deepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Deal
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="shrink-0" disabled>
                Demo only
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { ExternalLink, Zap, AlertTriangle } from "lucide-react";
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

function FlightLegRow({ leg, label }: { leg: FlightLeg; label: string }) {
  const first = leg.segments[0];
  const last = leg.segments[leg.segments.length - 1];
  const layovers = getLayovers(leg);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {/* Label */}
        <span
          className="text-xs font-medium tracking-[0.15em] uppercase w-12 shrink-0"
          style={{ color: "hsl(215 15% 45%)" }}
        >
          {label}
        </span>

        {/* Departure airport + time */}
        <div className="text-right shrink-0 w-14">
          <div className="text-base font-semibold tabular-nums" style={{ color: "hsl(38 30% 91%)" }}>
            {formatTime(first.departureTime)}
          </div>
          <div className="text-xs font-mono" style={{ color: "hsl(215 15% 52%)" }}>
            {first.departureAirport}
          </div>
        </div>

        {/* Flight path visualization */}
        <div className="flex-1 flex flex-col items-center min-w-0 px-2">
          <div className="text-xs mb-1" style={{ color: "hsl(215 15% 45%)" }}>
            {formatDuration(leg.totalDurationMinutes)}
          </div>
          <div className="w-full flex items-center gap-1">
            <div className="h-px flex-1" style={{ background: "hsl(222 28% 22%)" }} />
            {layovers.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "hsl(38 70% 55%)" }}
                title="Layover"
              />
            ))}
            {/* Plane icon inline as SVG */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
              style={{ color: "hsl(43 62% 52%)" }}
            >
              <path
                d="M22 16.21v-1.895a2 2 0 0 0-1.244-1.844L17 11l-3.4-6.8A1 1 0 0 0 12.7 4H10l2 7H7L5.5 9H3l1 3-1 3h2.5L7 13h5l-2 7h2.7a1 1 0 0 0 .9-.553L17 13l3.756-1.465A2 2 0 0 0 22 9.69V7.79"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="text-xs mt-1" style={{ color: "hsl(215 15% 45%)" }}>
            {leg.stops === 0 ? "Direct" : `${leg.stops} stop${leg.stops > 1 ? "s" : ""}`}
          </div>
        </div>

        {/* Arrival airport + time */}
        <div className="shrink-0 w-14">
          <div className="text-base font-semibold tabular-nums" style={{ color: "hsl(38 30% 91%)" }}>
            {formatTime(last.arrivalTime)}
          </div>
          <div className="text-xs font-mono" style={{ color: "hsl(215 15% 52%)" }}>
            {last.arrivalAirport}
          </div>
        </div>
      </div>

      {/* Layover details */}
      {layovers.length > 0 && (
        <div className="ml-16 space-y-1">
          {layovers.map((l, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md"
              style={{
                background: "rgba(180, 120, 30, 0.08)",
                border: "1px solid rgba(180, 120, 30, 0.2)",
                color: "hsl(38 55% 62%)",
              }}
            >
              <span className="font-medium">
                {formatDuration(l.durationMinutes)} layover · {l.airport}
              </span>
              <span className="opacity-70">
                {formatTime(l.arrivalTime)} – {formatTime(l.departureTime)}
              </span>
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
    <div
      className="flight-card-hover rounded-xl overflow-hidden"
      style={{
        background: "hsl(222 48% 8%)",
        border: "1px solid hsl(222 28% 17%)",
      }}
    >
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-stretch gap-5">

          {/* Left — airline + legs */}
          <div className="flex-1 space-y-4 min-w-0">
            {/* Airline row */}
            <div className="flex items-center gap-2.5">
              <span
                className="font-medium text-sm"
                style={{ color: "hsl(38 30% 85%)" }}
              >
                {airlineName}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: "hsl(222 32% 13%)",
                  color: "hsl(215 15% 55%)",
                  border: "1px solid hsl(222 28% 20%)",
                }}
              >
                {airlineCode}
              </span>
              {!offer.isLive && (
                <span
                  className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(180, 120, 30, 0.1)",
                    color: "hsl(38 55% 60%)",
                    border: "1px solid rgba(180, 120, 30, 0.2)",
                  }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  Demo
                </span>
              )}
              {offer.isLive && (
                <span
                  className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(45, 155, 111, 0.1)",
                    color: "hsl(160 55% 52%)",
                    border: "1px solid rgba(45, 155, 111, 0.2)",
                  }}
                >
                  <Zap className="h-3 w-3" />
                  Live
                </span>
              )}
            </div>

            {/* Flight legs */}
            <FlightLegRow leg={offer.outboundLeg} label="Depart" />
            {offer.returnLeg && (
              <>
                <div className="h-px" style={{ background: "hsl(222 28% 14%)" }} />
                <FlightLegRow leg={offer.returnLeg} label="Return" />
              </>
            )}
          </div>

          {/* Right — price + CTA */}
          <div
            className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 md:pl-6 md:min-w-[120px] border-t md:border-t-0 md:border-l"
            style={{ borderColor: "hsl(222 28% 14%)" }}
          >
            <div className="text-right">
              <div
                className="text-2xl font-bold tabular-nums leading-none"
                style={{ color: "hsl(43 62% 58%)" }}
              >
                {offer.priceCurrency === "SGD" ? "S$" : "$"}
                {offer.priceAmount}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "hsl(215 15% 45%)" }}
              >
                {offer.priceCurrency} · total
              </div>
            </div>

            {offer.deepLink && offer.deepLink !== "#" ? (
              <a
                href={offer.deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="deal-btn flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all shrink-0"
                style={{
                  background: "linear-gradient(135deg, hsl(43 62% 52%), hsl(43 55% 42%))",
                  color: "hsl(222 52% 5%)",
                }}
              >
                View Deal
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: "hsl(222 32% 13%)",
                  color: "hsl(215 15% 40%)",
                  border: "1px solid hsl(222 28% 18%)",
                }}
              >
                Demo only
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

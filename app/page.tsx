import { SearchForm } from "@/components/search-form";

export default function HomePage() {
  return (
    <main
      className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 12% 65%, rgba(201, 163, 65, 0.13) 0%, transparent 52%),
          radial-gradient(ellipse at 88% 20%, rgba(30, 58, 138, 0.18) 0%, transparent 48%),
          radial-gradient(ellipse at 55% 95%, rgba(201, 163, 65, 0.07) 0%, transparent 38%),
          hsl(222, 52%, 5%)
        `,
      }}
    >
      {/* Decorative grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,163,65,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,163,65,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Corner ornaments */}
      <div className="pointer-events-none absolute top-8 left-8 w-12 h-12 opacity-20"
        style={{
          borderTop: "1px solid hsl(43 62% 52%)",
          borderLeft: "1px solid hsl(43 62% 52%)",
        }}
      />
      <div className="pointer-events-none absolute top-8 right-8 w-12 h-12 opacity-20"
        style={{
          borderTop: "1px solid hsl(43 62% 52%)",
          borderRight: "1px solid hsl(43 62% 52%)",
        }}
      />
      <div className="pointer-events-none absolute bottom-8 left-8 w-12 h-12 opacity-20"
        style={{
          borderBottom: "1px solid hsl(43 62% 52%)",
          borderLeft: "1px solid hsl(43 62% 52%)",
        }}
      />
      <div className="pointer-events-none absolute bottom-8 right-8 w-12 h-12 opacity-20"
        style={{
          borderBottom: "1px solid hsl(43 62% 52%)",
          borderRight: "1px solid hsl(43 62% 52%)",
        }}
      />

      {/* Hero text */}
      <div className="text-center mb-10 animate-fade-in-up">
        <p
          className="text-xs font-medium tracking-[0.35em] uppercase mb-4 opacity-60"
          style={{ color: "hsl(43 62% 65%)" }}
        >
          Singapore&apos;s Flight Meta-Search
        </p>
        <h1
          className="text-6xl md:text-8xl tracking-tight mb-3 leading-none"
          style={{
            fontFamily: "var(--font-display-face), Georgia, serif",
            fontWeight: 300,
            color: "hsl(38 30% 91%)",
            letterSpacing: "-0.01em",
          }}
        >
          Hang Ban
        </h1>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-px flex-1 max-w-16 opacity-30" style={{ background: "hsl(43 62% 52%)" }} />
          <span
            className="text-xs font-semibold tracking-[0.5em] uppercase"
            style={{ color: "hsl(43 62% 52%)" }}
          >
            Scanner
          </span>
          <div className="h-px flex-1 max-w-16 opacity-30" style={{ background: "hsl(43 62% 52%)" }} />
        </div>
        <p
          className="text-sm mt-5 max-w-xs mx-auto leading-relaxed"
          style={{ color: "hsl(215 15% 55%)" }}
        >
          Search by country — we handle the airports.
          Real flights, real prices.
        </p>
      </div>

      {/* Search card */}
      <div
        className="w-full max-w-4xl mx-auto rounded-2xl p-6 md:p-8 animate-fade-in-up delay-200"
        style={{
          background: "rgba(12, 18, 40, 0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(201, 163, 65, 0.14)",
          boxShadow: "0 32px 80px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(201, 163, 65, 0.08) inset",
        }}
      >
        <SearchForm defaultOrigin="SG" />
      </div>

      {/* Disclaimer */}
      <p
        className="text-xs mt-6 max-w-sm text-center animate-fade-in delay-400"
        style={{ color: "hsl(215 15% 42%)" }}
      >
        Prices are indicative and may change at booking.
        We redirect you to the provider to complete purchase.
      </p>
    </main>
  );
}

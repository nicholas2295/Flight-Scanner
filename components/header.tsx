import Link from "next/link";

export function Header() {
  return (
    <header
      className="relative z-50"
      style={{
        background: "rgba(6, 10, 22, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201, 163, 65, 0.1)",
      }}
    >
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Aviation mark */}
          <div
            className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold transition-colors"
            style={{
              background: "linear-gradient(135deg, hsl(43 62% 52%), hsl(43 55% 40%))",
              color: "hsl(222 52% 5%)",
              fontFamily: "var(--font-display-face), Georgia, serif",
              fontSize: "13px",
              letterSpacing: "0.02em",
            }}
          >
            行
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-xl font-light tracking-wide transition-colors"
              style={{
                fontFamily: "var(--font-display-face), Georgia, serif",
                color: "hsl(38 30% 88%)",
              }}
            >
              Hang Ban
            </span>
            <span
              className="text-xs font-semibold tracking-[0.3em] uppercase hidden sm:block transition-colors"
              style={{ color: "hsl(43 62% 52%)" }}
            >
              Scanner
            </span>
          </div>
        </Link>

        <div
          className="text-xs tracking-widest uppercase opacity-40"
          style={{ color: "hsl(38 30% 75%)", fontSize: "10px", letterSpacing: "0.25em" }}
        >
          SIN — Real Flights
        </div>
      </div>
    </header>
  );
}

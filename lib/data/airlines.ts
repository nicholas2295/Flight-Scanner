export interface Airline {
  code: string;
  name: string;
}

/** Common airlines for Singapore outbound routes. Expand as needed. */
export const airlines: Record<string, Airline> = {
  SQ: { code: "SQ", name: "Singapore Airlines" },
  TR: { code: "TR", name: "Scoot" },
  "3K": { code: "3K", name: "Jetstar Asia" },
  JL: { code: "JL", name: "Japan Airlines" },
  NH: { code: "NH", name: "ANA" },
  CX: { code: "CX", name: "Cathay Pacific" },
  MH: { code: "MH", name: "Malaysia Airlines" },
  AK: { code: "AK", name: "AirAsia" },
  QF: { code: "QF", name: "Qantas" },
  BA: { code: "BA", name: "British Airways" },
  UA: { code: "UA", name: "United Airlines" },
  CA: { code: "CA", name: "Air China" },
  MU: { code: "MU", name: "China Eastern" },
  TG: { code: "TG", name: "Thai Airways" },
  KE: { code: "KE", name: "Korean Air" },
  GA: { code: "GA", name: "Garuda Indonesia" },
};

export function getAirlineName(code: string): string {
  return airlines[code]?.name ?? code;
}

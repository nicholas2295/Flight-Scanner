export interface Country {
  code: string;
  name: string;
}

export const countries: Country[] = [
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "MY", name: "Malaysia" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "TH", name: "Thailand" },
  { code: "KR", name: "South Korea" },
  { code: "AU", name: "Australia" },
  { code: "ID", name: "Indonesia" },
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}

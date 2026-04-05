export interface Airport {
  iata: string;
  name: string;
  city: string;
  countryCode: string;
}

/** Curated major airports per country. Not exhaustive — expand as needed. */
export const airportsByCountry: Record<string, Airport[]> = {
  SG: [
    { iata: "SIN", name: "Singapore Changi", city: "Singapore", countryCode: "SG" },
  ],
  JP: [
    { iata: "NRT", name: "Narita International", city: "Tokyo", countryCode: "JP" },
    { iata: "HND", name: "Haneda", city: "Tokyo", countryCode: "JP" },
    { iata: "KIX", name: "Kansai International", city: "Osaka", countryCode: "JP" },
    { iata: "FUK", name: "Fukuoka", city: "Fukuoka", countryCode: "JP" },
  ],
  CN: [
    { iata: "PVG", name: "Pudong International", city: "Shanghai", countryCode: "CN" },
    { iata: "PEK", name: "Capital International", city: "Beijing", countryCode: "CN" },
    { iata: "CAN", name: "Baiyun International", city: "Guangzhou", countryCode: "CN" },
    { iata: "SZX", name: "Bao'an International", city: "Shenzhen", countryCode: "CN" },
  ],
  MY: [
    { iata: "KUL", name: "Kuala Lumpur International", city: "Kuala Lumpur", countryCode: "MY" },
    { iata: "PEN", name: "Penang International", city: "Penang", countryCode: "MY" },
  ],
  US: [
    { iata: "JFK", name: "John F. Kennedy International", city: "New York", countryCode: "US" },
    { iata: "LAX", name: "Los Angeles International", city: "Los Angeles", countryCode: "US" },
    { iata: "SFO", name: "San Francisco International", city: "San Francisco", countryCode: "US" },
  ],
  GB: [
    { iata: "LHR", name: "Heathrow", city: "London", countryCode: "GB" },
    { iata: "LGW", name: "Gatwick", city: "London", countryCode: "GB" },
  ],
  TH: [
    { iata: "BKK", name: "Suvarnabhumi", city: "Bangkok", countryCode: "TH" },
    { iata: "DMK", name: "Don Mueang", city: "Bangkok", countryCode: "TH" },
  ],
  KR: [
    { iata: "ICN", name: "Incheon International", city: "Seoul", countryCode: "KR" },
  ],
  AU: [
    { iata: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", countryCode: "AU" },
    { iata: "MEL", name: "Melbourne Tullamarine", city: "Melbourne", countryCode: "AU" },
  ],
  ID: [
    { iata: "CGK", name: "Soekarno-Hatta International", city: "Jakarta", countryCode: "ID" },
    { iata: "DPS", name: "Ngurah Rai International", city: "Bali", countryCode: "ID" },
  ],
};

export function getAirportsForCountry(countryCode: string): Airport[] {
  return airportsByCountry[countryCode] ?? [];
}

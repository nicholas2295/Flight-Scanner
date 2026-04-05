import { z } from "zod";
import type { FlightOffer } from "./flight";
import { CABIN_CLASSES } from "./flight";

export const searchParamsSchema = z.object({
  origin: z.string().length(2, "Origin country code must be 2 characters"),
  destination: z.string().length(2, "Destination country code must be 2 characters"),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Departure must be YYYY-MM-DD"),
  return: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Return must be YYYY-MM-DD").optional(),
  passengers: z.coerce.number().int().min(1).max(9).default(1),
  cabin: z.enum(CABIN_CLASSES).default("economy"),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export interface SearchResult {
  params: SearchParams;
  offers: FlightOffer[];
  expandedOriginAirports: string[];
  expandedDestAirports: string[];
  isMock: boolean;
}

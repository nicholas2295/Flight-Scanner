import { z } from "zod";
import { CABIN_CLASSES } from "@/lib/types/flight";

export const alertSchema = z.object({
  email: z.string().email(),
  origin: z.string().length(2),
  destination: z.string().length(2),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  return: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  passengers: z.number().int().min(1).max(9),
  cabin: z.enum(CABIN_CLASSES),
  targetPrice: z.number().positive(),
  currency: z.string().default("USD"),
});

export type AlertInput = z.infer<typeof alertSchema>;

export interface FlightAlert extends AlertInput {
  id: string;
  token: string;
  createdAt: string;
}

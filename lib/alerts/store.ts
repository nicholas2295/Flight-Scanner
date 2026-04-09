import type { AlertInput, FlightAlert } from "./types";

// In-memory store for demo — resets on server restart.
// Real implementation would persist to Postgres via Prisma.
const alerts = new Map<string, FlightAlert>();

function randomId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

function randomToken(): string {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
}

export function createAlert(input: AlertInput): FlightAlert {
  const alert: FlightAlert = {
    ...input,
    id: randomId(),
    token: randomToken(),
    createdAt: new Date().toISOString(),
  };
  alerts.set(alert.id, alert);
  console.log(
    `[Alerts] Created alert ${alert.id} for ${alert.email}: ${alert.origin}→${alert.destination} @ ${alert.currency} ${alert.targetPrice}`,
  );
  return alert;
}

export function listAlerts(): FlightAlert[] {
  return Array.from(alerts.values());
}

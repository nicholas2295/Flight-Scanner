import { NextResponse } from "next/server";
import { alertSchema } from "@/lib/alerts/types";
import { createAlert } from "@/lib/alerts/store";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = alertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid alert", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const alert = createAlert(parsed.data);

  return NextResponse.json({
    id: alert.id,
    email: alert.email,
    targetPrice: alert.targetPrice,
    currency: alert.currency,
    createdAt: alert.createdAt,
  });
}

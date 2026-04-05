"use client";

import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SearchParams } from "@/lib/types/search";

interface PriceAlertFormProps {
  params: SearchParams;
  lowestPrice: number;
  currency: string;
}

export function PriceAlertForm({ params, lowestPrice, currency }: PriceAlertFormProps) {
  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState(
    String(Math.max(1, Math.floor(lowestPrice * 0.9))),
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !targetPrice) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          origin: params.origin,
          destination: params.destination,
          departure: params.departure,
          return: params.return,
          passengers: params.passengers,
          cabin: params.cabin,
          targetPrice: parseFloat(targetPrice),
          currency,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create alert");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 flex items-start gap-3">
        <div className="rounded-full bg-emerald-100 p-1.5">
          <Check className="h-4 w-4 text-emerald-700" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-emerald-900">Alert created</p>
          <p className="text-sm text-emerald-800 mt-0.5">
            We&apos;ll email <span className="font-medium">{email}</span> when{" "}
            {params.origin}→{params.destination} drops below {currency}{" "}
            {parseFloat(targetPrice).toFixed(0)}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-muted/30 p-4 md:p-5 space-y-3"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
          <Bell className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Get notified when prices drop</h3>
          <p className="text-sm text-muted-foreground">
            Lowest right now: {currency} {lowestPrice.toFixed(0)}. Set a target
            and we&apos;ll email you when it goes below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="alert-email">Email</Label>
          <Input
            id="alert-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="alert-target">Target ({currency})</Label>
          <Input
            id="alert-target"
            type="number"
            required
            min="1"
            step="1"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="h-10"
          />
        </div>
        <Button
          type="submit"
          className="h-10"
          disabled={status === "submitting" || !email || !targetPrice}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Create alert
            </>
          )}
        </Button>
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}
    </form>
  );
}

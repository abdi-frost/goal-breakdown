"use client";

import Image from "next/image";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!goal.trim()) return setError("Please enter a goal");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "API error");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start py-20 px-6 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full max-w-xl flex-col gap-6">
          <div className="flex items-center gap-4">
            <Image className="dark:invert" src="https://abdifrost.vercel.app/logo.png" alt="logo" width={80} height={20} />
            <h1 className="text-2xl font-semibold">Smart Goal Breaker</h1>
          </div>

          <form onSubmit={submit} className="flex w-full flex-col gap-3">
            <label className="text-sm font-medium">Enter a vague goal</label>
            <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Launch a startup" />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Working..." : "Break it down"}
              </Button>
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
          </form>

          {result && (
            <div className="mt-4 w-full rounded-lg border p-4">
              <h3 className="text-lg font-medium">Result</h3>
              <p className="text-sm text-muted-foreground">Complexity: {result.complexity}</p>
              <ol className="mt-2 list-decimal pl-5">
                {[result.step_one, result.step_two, result.step_three, result.step_four, result.step_five]
                  .filter(Boolean)
                  .map((s: string, i: number) => (
                    <li key={i} className="mb-1">
                      {s}
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

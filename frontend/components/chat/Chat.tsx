"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function Chat({ apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pushMessage(role: Message["role"], text: string) {
    setMessages((m) => [
      ...m,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, role, text },
    ]);
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    setError(null);
    const userText = input.trim();
    pushMessage("user", userText);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: userText }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Build assistant message from returned steps
      const steps = [data.step_one, data.step_two, data.step_three, data.step_four, data.step_five].filter(Boolean);
      const assistantText = `Complexity: ${data.complexity}\n\n` + steps.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n");
      pushMessage("assistant", assistantText);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      pushMessage("assistant", "Sorry, I couldn't process that right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[90vh] w-full max-w-3xl flex-col rounded-xl border border-neutral-800 bg-linear-to-b from-[#0b0216] via-[#12021f] to-black shadow-lg">
      <header className="flex items-center gap-3 border-b border-neutral-800 px-4 py-3">
        <Image src="https://abdifrost.vercel.app/logo.png" alt="logo" width={40} height={40} className="rounded-full" />
        <div>
          <div className="text-white text-lg font-semibold">Smart Goal Breaker</div>
          <div className="text-sm text-zinc-300">Type a goal and I&#39;ll break it into 5 actionable steps.</div>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-md border border-dashed border-neutral-800 p-4 text-sm text-zinc-300">
              <div className="font-medium text-zinc-200">What I can do</div>
              <ul className="mt-2 list-disc pl-5 text-zinc-400">
                <li>Turn vague goals into 5 actionable steps.</li>
                <li>Estimate complexity (1-10) for planning.</li>
                <li>Save plans so you can iterate later.</li>
              </ul>
            </div>

            <div className="mt-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-sm text-zinc-400">Start by typing a goal below — e.g. &#34;Launch a startup&#34;</div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-snug ${
                      m.role === "user" ? "bg-neutral-800 text-white" : "bg-gradient-to-r from-[#6b21a8] to-[#a78bfa] text-black"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={(e) => handleSend(e)} className="border-t border-neutral-800 px-4 py-3">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your goal — e.g. 'Grow my newsletter to 10k subscribers'"
              className="min-h-[56px] max-h-40 bg-neutral-900/60 text-white"
            />
            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="h-12">
                {loading ? "Thinking..." : "Break it down"}
              </Button>
            </div>
          </div>
          {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
        </form>
      </div>
    </div>
  );
}

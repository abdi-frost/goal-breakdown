"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Sidebar, { Goal } from "./Sidebar";
import { GoalResponse } from "./GoalResponse";
import { useGoals, useCreateGoal, useDeleteGoal } from "@/lib/hooks/useGoals";
import { getUserToken } from "@/lib/auth";
import { Sparkles, Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  complexity?: number;
  steps?: string[];
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [userToken, setUserToken] = useState<string>("");

  // Initialize user token
  useEffect(() => {
    const token = getUserToken();
    setUserToken(token);
  }, []);

  // Fetch user goals
  const { data: goals = [], isLoading: goalsLoading } = useGoals(userToken);
  const createGoalMutation = useCreateGoal();
  const deleteGoalMutation = useDeleteGoal();

  function pushMessage(role: Message["role"], text: string) {
    setMessages((m) => [
      ...m,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, role, text },
    ]);
  }

  // Helper: send a specific text as a goal (works immediately, doesn't rely on setState timing)
  async function sendGoalText(text: string) {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    setError(null);
    pushMessage("user", trimmed);
    setInput("");
    setLoading(true);

    try {
      const data = await createGoalMutation.mutateAsync(trimmed);

      // Build assistant message with structured data
      const steps = [data.step_one, data.step_two, data.step_three, data.step_four, data.step_five].filter(Boolean) as string[];

      // Store structured data for rendering
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          role: "assistant",
          text: "",
          complexity: data.complexity,
          steps: steps
        },
      ]);

      // Auto-select the newly created goal
      setSelectedGoal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      pushMessage("assistant", "❌ Sorry, I couldn't process that right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Form submit wrapper that uses the current input value
  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    await sendGoalText(input);
  }

  function handleSelectGoal(goal: Goal) {
    setSelectedGoal(goal);
    setMessages([]);

    // Display the goal in chat
    pushMessage("user", goal.goal_text);

    const steps = [goal.step_one, goal.step_two, goal.step_three, goal.step_four, goal.step_five].filter(Boolean) as string[];

    // Store structured data for rendering
    setMessages((m) => [
      ...m,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        role: "assistant",
        text: "",
        complexity: goal.complexity,
        steps: steps
      },
    ]);
  }

  function handleDeleteGoal(goalId: number) {
    deleteGoalMutation.mutate(goalId);
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(null);
      setMessages([]);
    }
  }

  function handleNewGoal() {
    setSelectedGoal(null);
    setMessages([]);
    setInput("");
  }

  return (
    <div className="flex h-screen w-full bg-linear-to-b from-[#07020b] via-[#0a0118] to-black">
      {/* Sidebar */}
      <Sidebar
        goals={goals}
        selectedGoalId={selectedGoal?.id || null}
        onSelectGoal={handleSelectGoal}
        onDeleteGoal={handleDeleteGoal}
        onNewGoal={handleNewGoal}
        isLoading={goalsLoading}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="ml-6 flex items-center gap-3 border-b border-white/10 bg-[#0a0118]/80 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src="https://abdifrost.vercel.app/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="hidden sm:block rounded-full ring-2 ring-purple-500/50"
            />
            <div>
              <div className="text-white text-base sm:text-lg font-semibold flex items-center gap-2">
                Smart Goal Breaker
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 hidden sm:block">
                {selectedGoal ? "Viewing saved goal" : "Transform your goals into actionable steps"}
              </div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
            <div className="mx-auto max-w-3xl">
              {messages.length === 0 && !selectedGoal && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="rounded-xl border border-purple-500/20 bg-linear-to-br from-purple-950/30 to-violet-950/20 p-4 sm:p-6 shadow-xl shadow-purple-900/10">
                    <div className="flex items-center gap-2 font-semibold text-purple-200 mb-3">
                      <Sparkles className="h-5 w-5" />
                      What I can do for you
                    </div>
                    <ul className="space-y-2 text-sm text-zinc-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">✓</span>
                        <span>Break down any goal into 5 clear, actionable steps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">✓</span>
                        <span>Estimate complexity (1-10) to help you plan effectively</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">✓</span>
                        <span>Save all your goals for future reference and tracking</span>
                      </li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <p className="text-zinc-500 text-xs sm:text-sm mb-3 sm:mb-4">Start by trying</p>
                    <button
                      onClick={() => sendGoalText("Become senior software architect")}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-zinc-300 transition-all hover:border-purple-500/50 hover:bg-purple-950/20 hover:text-white"
                    >
                      Become senior software architect
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "user" ? (
                      <div className="max-w-[90%] sm:max-w-[85%] rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm leading-relaxed shadow-lg bg-linear-to-r from-purple-600 to-violet-600 text-white">
                        {m.text}
                      </div>
                    ) : (
                      <div className="max-w-[95%] sm:max-w-[90%] w-full">
                        {m.complexity && m.steps ? (
                          <GoalResponse complexity={m.complexity} steps={m.steps} />
                        ) : (
                          <div className="rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm leading-relaxed shadow-lg bg-white/5 text-zinc-100 border border-white/10 backdrop-blur-sm">
                            {m.text}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                      <span className="text-sm text-zinc-400">Analyzing your goal...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={(e) => handleSend(e)} className="border-t border-white/10 bg-[#0a0118]/50 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Describe your goal... (e.g., 'Build a mobile app for fitness tracking')"
                  className="min-h-14 sm:min-h-[60px] max-h-32 sm:max-h-40 text-sm sm:text-base bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                />
                <div className="flex items-end w-full sm:w-auto">
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="w-full sm:w-auto h-12 sm:h-[60px] text-sm sm:text-base bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-900/50 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Break it down</span>
                        <span className="sm:hidden">Submit</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="mt-2 sm:mt-3 rounded-lg bg-red-950/30 border border-red-500/30 px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-400">
                  {error}
                </div>
              )}
              <div className="mt-2 text-xs text-zinc-600 text-center hidden sm:block">
                Press Enter to send, Shift + Enter for new line
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

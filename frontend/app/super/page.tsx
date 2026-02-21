"use client";

import { useState, useEffect, useCallback } from "react";
import { useAllGoals } from "@/lib/hooks/useGoals";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  CheckCircle2,
  Zap,
  Loader2,
  List,
} from "lucide-react";
import Link from "next/link";

const PAGE_LIMIT = 30;

function getComplexityConfig(level: number) {
  if (level <= 3) {
    return {
      label: "Easy",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    };
  } else if (level <= 6) {
    return {
      label: "Moderate",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      icon: <Target className="h-3.5 w-3.5" />,
    };
  } else {
    return {
      label: "Complex",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      icon: <Zap className="h-3.5 w-3.5" />,
    };
  }
}

export default function SuperPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const skip = page * PAGE_LIMIT;
  const { data, isLoading, isError } = useAllGoals(debouncedSearch, skip, PAGE_LIMIT);

  const totalPages = data ? Math.ceil(data.total / PAGE_LIMIT) : 0;

  const handlePrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const handleNext = useCallback(() => setPage((p) => p + 1), []);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#07020b] via-[#0a0118] to-black">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0a0118]/90 backdrop-blur-sm px-4 sm:px-8 py-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Back</span>
            </Link>
            <Separator orientation="vertical" className="h-5 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-purple-400" />
              <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                All Goals
                <Sparkles className="h-4 w-4 text-purple-400" />
              </h1>
            </div>
            {data && (
              <Badge className="ml-auto sm:ml-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
                {data.total.toLocaleString()} total
              </Badge>
            )}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search goals or steps…"
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/20"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-zinc-400 text-sm">Loading goals…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-red-400 text-sm">Failed to load goals. Please try again.</p>
          </div>
        ) : data?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Search className="h-12 w-12 text-zinc-600" />
            <p className="text-zinc-400">No goals found{debouncedSearch ? ` for "${debouncedSearch}"` : ""}.</p>
          </div>
        ) : (
          <>
            {/* Goal Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data?.items.map((goal) => {
                const steps = [
                  goal.step_one,
                  goal.step_two,
                  goal.step_three,
                  goal.step_four,
                  goal.step_five,
                ].filter(Boolean) as string[];
                const config = getComplexityConfig(goal.complexity);
                const date = new Date(goal.created_at);
                const dateLabel = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <Card
                    key={goal.id}
                    className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl hover:border-purple-500/30 transition-colors"
                  >
                    <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
                      {/* Goal Text */}
                      <div>
                        <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                          {goal.goal_text}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">{dateLabel}</p>
                      </div>

                      {/* Complexity badge */}
                      <div className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-md text-xs font-medium ${config.bgColor} border ${config.borderColor} ${config.color}`}>
                        {config.icon}
                        {config.label} · {goal.complexity}/10
                      </div>

                      <Separator className="bg-white/5" />

                      {/* Steps */}
                      <ol className="space-y-1.5">
                        {steps.map((step, i) => (
                          <li key={i} className="flex gap-2 text-xs text-zinc-300 leading-relaxed">
                            <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                              {i + 1}
                            </span>
                            <span className="line-clamp-2">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={page === 0}
                  className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <span className="text-sm text-zinc-400">
                  Page {page + 1} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={page + 1 >= totalPages}
                  className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

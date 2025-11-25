"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Zap, Target } from "lucide-react";

type GoalResponseProps = {
  complexity: number;
  steps: string[];
};

export function GoalResponse({ complexity, steps }: GoalResponseProps) {
  // Determine complexity variant and label based on level
  const getComplexityConfig = (level: number) => {
    if (level <= 3) {
      return {
        variant: "success" as const,
        label: "Easy",
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        icon: <CheckCircle2 className="h-4 w-4" />,
      };
    } else if (level <= 6) {
      return {
        variant: "warning" as const,
        label: "Moderate",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        icon: <Target className="h-4 w-4" />,
      };
    } else {
      return {
        variant: "destructive" as const,
        label: "Complex",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        icon: <Zap className="h-4 w-4" />,
      };
    }
  };

  const config = getComplexityConfig(complexity);

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
      <CardContent className="p-4 sm:p-6">
        {/* Complexity Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Complexity:</span>
            <Badge 
              variant={config.variant}
              className="flex items-center gap-1.5 px-3 py-1 text-sm font-semibold"
            >
              {config.icon}
              {config.label}
            </Badge>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md ${config.bgColor} border ${config.borderColor}`}>
            <span className={`text-sm font-bold ${config.color}`}>{complexity}</span>
            <span className="text-xs text-zinc-400">/10</span>
          </div>
        </div>

        <Separator className="my-4 bg-white/10" />

        {/* Action Steps */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-1 rounded-full bg-purple-400"></div>
            <h3 className="text-sm font-semibold text-purple-200">Action Steps</h3>
          </div>
          
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group flex gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:p-4 transition-all hover:border-purple-500/30 hover:bg-purple-950/10"
              >
                {/* Step Number */}
                <div className="flex shrink-0 items-start">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-sm font-bold text-purple-300 transition-all group-hover:from-purple-500/30 group-hover:to-violet-500/30 group-hover:border-purple-400/50">
                    {index + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                    {step}
                  </p>
                </div>

                {/* Completion Indicator (placeholder) */}
                <div className="flex shrink-0 items-start opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-5 w-5 rounded-full border-2 border-zinc-600 group-hover:border-purple-400/50"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-zinc-500 text-center">
            💡 Break down each step further for more detailed planning
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

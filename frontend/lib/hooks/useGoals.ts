"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserToken } from "@/lib/auth";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Goal = {
  id: number;
  goal_text: string;
  step_one: string | null;
  step_two: string | null;
  step_three: string | null;
  step_four: string | null;
  step_five: string | null;
  complexity: number;
  user_id: string | null;
  created_at: string;
};

export function useGoals(userId?: string) {
  const userToken = userId || (typeof window !== "undefined" ? getUserToken() : "");
  
  return useQuery({
    queryKey: ["goals", userToken],
    queryFn: async () => {
      if (!userToken) return [];
      const res = await fetch(`${apiBase}/goals/user/${userToken}`);
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<Goal[]>;
    },
    enabled: !!userToken,
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  const userToken = typeof window !== "undefined" ? getUserToken() : "";
  
  return useMutation({
    mutationFn: async (goal: string) => {
      const res = await fetch(`${apiBase}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, user_id: userToken }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<Goal>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals", userToken] });
    },
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  const userToken = typeof window !== "undefined" ? getUserToken() : "";
  
  return useMutation({
    mutationFn: async (goalId: number) => {
      const res = await fetch(`${apiBase}/goals/${goalId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals", userToken] });
    },
  });
}

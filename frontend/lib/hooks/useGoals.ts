"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useGoals() {
  return useQuery(["goals"], async () => {
    const res = await fetch(`${apiBase}/goals`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation(
    async (goal: string) => {
      const res = await fetch(`${apiBase}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(["goals"]);
      },
    }
  );
}

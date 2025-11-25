"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

type SidebarProps = {
    goals: Goal[];
    selectedGoalId: number | null;
    onSelectGoal: (goal: Goal) => void;
    onDeleteGoal: (goalId: number) => void;
    onNewGoal: () => void;
    isLoading?: boolean;
};

export default function Sidebar({
    goals,
    selectedGoalId,
    onSelectGoal,
    onDeleteGoal,
    onNewGoal,
    isLoading = false,
}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

    // Hide sidebar by default on mobile/tablet screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
                setSidebarWidth(256);
            } else {
                setSidebarWidth(288); // 72 * 4 = 288px for lg:w-72
            }
        };

        // Set initial state based on screen size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    return (
        <>
            {/* Sidebar */}
            <div
                className={`relative flex h-full flex-col border-r border-white/10 bg-linear-to-b from-[#0a0118] via-[#0f021a] to-[#07020b] transition-all duration-300 ${isCollapsed ? "w-0 overflow-hidden" : "w-64 lg:w-72"
                    }`}
            >
                {/* Header */}
                <div className="border-b border-white/10 p-4">
                    <Button
                        onClick={onNewGoal}
                        className="w-full bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-900/50"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Goal
                    </Button>
                </div>

                {/* Goals List */}
                <div className="flex-1 overflow-y-auto px-3 py-4">
                    {isLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
                            ))}
                        </div>
                    ) : goals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <MessageSquare className="h-12 w-12 text-zinc-600 mb-3" />
                            <p className="text-sm text-zinc-500">No goals yet</p>
                            <p className="text-xs text-zinc-600 mt-1">Create your first goal to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {goals.map((goal) => (
                                <div
                                    key={goal.id}
                                    className={`group relative flex cursor-pointer items-start gap-3 rounded-lg px-3 py-3 transition-all ${selectedGoalId === goal.id
                                            ? "bg-linear-to-r from-purple-900/40 to-violet-900/40 border border-purple-500/50 shadow-lg shadow-purple-900/20"
                                            : "hover:bg-white/5"
                                        }`}
                                    onClick={() => onSelectGoal(goal)}
                                >
                                    <MessageSquare className={`mt-0.5 h-4 w-4 shrink-0 ${selectedGoalId === goal.id ? "text-purple-400" : "text-zinc-500"
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium leading-snug ${selectedGoalId === goal.id ? "text-white" : "text-zinc-300"
                                            }`}>
                                            {truncateText(goal.goal_text, 45)}
                                        </p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-xs text-zinc-500">
                                                {formatDate(goal.created_at)}
                                            </span>
                                            <span className="text-xs text-zinc-600">•</span>
                                            <span className="text-xs text-violet-400">
                                                Level {goal.complexity}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeletingGoal(goal);
                                            setDeleteOpen(true);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                                        title="Delete goal"
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                    </button>
                                    {/* Delete confirmation dialog (shared) */}
                                    <AlertDialog open={deleteOpen && deletingGoal?.id === goal.id} onOpenChange={(open: boolean) => {
                                        if (!open) {
                                            // closed without confirm
                                            setDeletingGoal(null);
                                        }
                                        setDeleteOpen(open);
                                    }}>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete goal?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this goal? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="mt-2 text-sm text-zinc-300">{truncateText(goal.goal_text, 160)}</div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (deletingGoal) {
                                                                onDeleteGoal(deletingGoal.id);
                                                            } else {
                                                                // If somehow missing, call onDeleteGoal for this goal
                                                                onDeleteGoal(goal.id);
                                                            }
                                                            setDeleteOpen(false);
                                                            setDeletingGoal(null);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 p-3">
                    <div className="text-xs text-zinc-600 text-center">
                        {goals.length} {goals.length === 1 ? "goal" : "goals"} total
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute left-0 top-4 z-50 ml-1 rounded-r-lg bg-linear-to-r from-purple-900/80 to-violet-900/80 p-2 text-white shadow-xl transition-all hover:from-purple-800 hover:to-violet-800 border border-purple-500/30"
                style={{ transform: isCollapsed ? "translateX(0)" : `translateX(${sidebarWidth}px)` }}
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
        </>
    );
}

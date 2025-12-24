import React from "react";
import { Intent } from "./types";
import {
  GraduationCap,
  Search,
  ShoppingBag,
  Briefcase,
  PlayCircle,
} from "lucide-react";

export const INTENT_THEMES: Record<
  Intent,
  { color: string; icon: React.ReactNode; label: string }
> = {
  [Intent.LEARNING]: {
    color: "bg-blue-100 text-blue-800",
    icon: <GraduationCap size={14} />,
    label: "Learning",
  },
  [Intent.RESEARCH]: {
    color: "bg-slate-200 text-slate-800",
    icon: <Search size={14} />,
    label: "Research",
  },
  [Intent.SHOPPING]: {
    color: "bg-emerald-100 text-emerald-800",
    icon: <ShoppingBag size={14} />,
    label: "Shopping",
  },
  [Intent.WORK]: {
    color: "bg-indigo-100 text-indigo-800",
    icon: <Briefcase size={14} />,
    label: "Work",
  },
  [Intent.ENTERTAINMENT]: {
    color: "bg-cyan-100 text-cyan-800",
    icon: <PlayCircle size={14} />,
    label: "Entertainment",
  },
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

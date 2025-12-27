import React, { useEffect, useState } from "react";
import {
  Database,
  TrendingUp,
  Star,
  Layout,
  Plus,
  MessageSquare,
  Search,
} from "lucide-react";
import { apiService } from "../services/apiService";
import { Memory, UserStats } from "../types";
import MemoryCard from "../components/memory/MemoryCard";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, m] = await Promise.all([
          apiService.getStats(),
          apiService.getMemories(),
        ]);
        setStats(s);
        setRecentMemories(m.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading)
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="font-display font-semibold text-slate-400">
          Loading your universe...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-xl text-4xl mb-1 text-slate-900">
            Good morning, {user?.name.split(" ")[0] || "there"}
          </h1>
          <p className="text-slate-500 font-medium">
            Here's your personal knowledge overview for today.
          </p>
        </div>
        <a
          href="/extension.zip"
          download="extension.zip"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
        >
          <Plus size={20} />
          Download Extension
        </a>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Memories",
            value: stats?.totalMemories,
            icon: <Database className="text-blue-600" />,
            bg: "bg-blue-50",
          },
          {
            label: "New This Week",
            value: `+${stats?.newThisWeek}`,
            icon: <TrendingUp className="text-emerald-600" />,
            bg: "bg-emerald-50",
          },
          {
            label: "Avg Importance",
            value: stats?.averageImportance,
            icon: <Star className="text-amber-500" />,
            bg: "bg-amber-50",
          },
          {
            label: "Top Category",
            value: stats?.topCategory,
            icon: <Layout className="text-slate-600" />,
            bg: "bg-slate-100",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white p-7 rounded-[2rem] border border-slate-200 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-label-caps mb-1">{s.label}</p>
              <p className="text-display-xl text-3xl text-slate-900 leading-none">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Memories */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-display-xl text-2xl text-slate-900">
              Recent Activity
            </h2>
            <Link
              to="/memories"
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              View All Memories
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentMemories.map((m) => (
              <MemoryCard key={m.id} memory={m} />
            ))}
          </div>
        </div>

        {/* Quick Actions & Tag Cloud */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <h3 className="text-display-xl text-2xl mb-3">Ask Context AI</h3>
            <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">
              Instantly query your personal database using natural language.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/50"
            >
              <MessageSquare size={20} />
              Open Assistant
            </Link>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h3 className="text-display-xl text-xl text-slate-900 mb-6">
              Trending Tags
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {[
                "react",
                "ai",
                "productivity",
                "research",
                "typescript",
                "design",
                "ux",
                "marketing",
              ].map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import backendAPI from "../../api/backend";
import LoadingSpinner from "../Common/LoadingSpinner";
import EmptyState from "../Common/EmptyState";
import ErrorMessage from "../Common/ErrorMessage";
import TagCloud from "./TagCloud";
import IntentChart from "./IntentChart";
import MemoryCard from "../Memories/MemoryCard";
import { useApiKey } from "../../hooks/useApiKey";
import { useMemories } from "../../hooks/useMemories";
import { BarChart2, BookOpen, Star, RotateCw, Tag, TrendingUp, Clock, Lightbulb } from "lucide-react";

export function StatsOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { memories } = useMemories(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await backendAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent memories
  useEffect(() => {
    if (memories.length === 0) {
      fetchRecentMemories();
    }
  }, []);

  const fetchRecentMemories = async () => {
    try {
      await backendAPI.getMemories({ limit: 5 });
    } catch (err) {
      console.error("Error fetching recent memories:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchStats} />;
  }

  if (!stats) {
    return (
      <EmptyState
        icon={BarChart2}
        title="No statistics available"
        description="Save some pages to see your statistics."
      />
    );
  }

  const recentMemories = memories.slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Welcome header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Memory Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Track your saved pages and explore insights
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total memories */}
          <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                  Total Memories
                </p>
                <p className="text-3xl font-bold text-indigo-900 mt-2">
                  {stats.overview?.total || 0}
                </p>
              </div>
              <BookOpen size={40} className="text-indigo-300" />
            </div>
          </div>

          {/* Average importance */}
          <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                  Avg Importance
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold text-orange-900">
                    {stats.overview?.avgImportance?.toFixed(1) || "0.0"}
                  </p>
                  <Star size={24} className="text-yellow-500 fill-yellow-500" />
                </div>
              </div>
              <Star size={40} className="text-orange-300" />
            </div>
          </div>

          {/* Total revisits */}
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  Total Revisits
                </p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {stats.overview?.totalRevisits || 0}
                </p>
              </div>
              <RotateCw size={40} className="text-green-300" />
            </div>
          </div>

          {/* Most popular tag */}
          <div className="card bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-pink-600 uppercase tracking-wide">
                  Top Tag
                </p>
                <p className="text-xl font-bold text-pink-900 mt-2 truncate">
                  {stats.topTags?.[0]?.tag || "None"}
                </p>
                <p className="text-xs text-pink-600 mt-1">
                  {stats.topTags?.[0]?.count || 0} memories
                </p>
              </div>
              <Tag size={40} className="text-pink-300 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Intent distribution */}
        {stats.intentDistribution && stats.intentDistribution.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-premium-dark" />
              <span>Intent Distribution</span>
            </h3>
            <IntentChart intentDistribution={stats.intentDistribution} />
          </div>
        )}

        {/* Tag cloud */}
        {stats.topTags && stats.topTags.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag size={20} className="text-premium-dark" />
              <span>Popular Tags</span>
            </h3>
            <TagCloud tags={stats.topTags} />
          </div>
        )}

        {/* Recent memories */}
        {recentMemories.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-premium-dark" />
              <span>Recent Memories</span>
            </h3>
            <div className="space-y-4">
              {recentMemories.map((memory) => (
                <MemoryCard key={memory._id} memory={memory} />
              ))}
            </div>
          </div>
        )}

        {/* Quick tip */}
        <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
          <div className="flex items-start gap-3">
            <Lightbulb size={24} className="text-yellow-500 fill-yellow-200 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">Quick Tip</h4>
              <p className="text-sm text-indigo-700">
                Use{" "}
                <kbd className="px-2 py-1 bg-white rounded text-xs font-mono">
                  Ctrl+Shift+S
                </kbd>{" "}
                to quickly save any page to your memory bank!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;

import React, { useState } from "react";
import {
  Search as SearchIcon,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Memory } from "../types";
import { apiService } from "../services/apiService";
import MemoryCard from "../components/memory/MemoryCard";

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(Memory & { similarity: number })[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Use backend semantic search endpoint
      const scored = await apiService.searchMemories(query, 20);
      // Add similarity scores if not present (backend should provide them)
      setResults(
        scored.map((m) => ({ ...m, similarity: m.similarity || 0.5 }))
      );
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Semantic Search
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Find memories by their meaning, even if you don't remember the exact
          words.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 premium-gradient opacity-20 blur-2xl group-hover:opacity-30 transition-opacity rounded-[2.5rem]"></div>
        <div className="relative flex items-center bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-2 pl-8 focus-within:ring-4 ring-indigo-500/10 transition-all">
          <SearchIcon
            className="text-slate-400 group-hover:text-indigo-600 transition-colors"
            size={24}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow px-4 py-6 bg-transparent outline-none text-xl font-medium placeholder:text-slate-300"
            placeholder="Describe what you're looking for..."
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-8 py-5 premium-gradient text-white rounded-[2rem] font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {isSearching ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Search
                <Sparkles size={20} />
              </>
            )}
          </button>
        </div>
      </form>

      {results.length > 0 && !isSearching && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900">
              Found {results.length} relevant memories
            </h2>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Ranked by AI Score
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((r) => (
              <MemoryCard key={r.id} memory={r} />
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !isSearching && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Summaries of modern frontend frameworks",
            "Articles about building accessible components",
            "References to productivity hacks I saved",
            "Websites related to coffee brewing gear",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion);
              }}
              className="p-6 bg-white rounded-3xl border border-slate-200 text-left hover:border-indigo-300 group transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">{suggestion}</span>
                <ArrowRight
                  size={18}
                  className="text-slate-300 group-hover:text-indigo-600 transition-colors"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;

import React, { useState, useEffect } from "react";
import backendAPI from "../../api/backend";
import MemoryCard from "./MemoryCard";
import LoadingSpinner from "../Common/LoadingSpinner";
import EmptyState from "../Common/EmptyState";
import ErrorMessage from "../Common/ErrorMessage";

export function MemorySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(0);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await backendAPI.semanticSearch(searchQuery.trim(), 20);

      if (response.success) {
        setResults(response.data.results);
      }
    } catch (err) {
      setError(err.message);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(
    (result) => result.similarity >= similarityThreshold
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your memories..."
            className="input-field pl-10"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Try: "React tutorials" or "authentication methods"
        </p>

        {/* Similarity threshold slider */}
        {results.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">
                Similarity threshold:
              </label>
              <span className="text-xs font-semibold text-indigo-600">
                {Math.round(similarityThreshold * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={similarityThreshold}
              onChange={(e) =>
                setSimilarityThreshold(parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        )}
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && <ErrorMessage error={error} onRetry={handleSearch} />}

        {loading && <LoadingSpinner text="Searching..." />}

        {!loading && !error && !hasSearched && (
          <EmptyState
            icon="🔍"
            title="Semantic Search"
            description="Search your memories using natural language. Type at least 3 characters to start."
          />
        )}

        {!loading && !error && hasSearched && filteredResults.length === 0 && (
          <EmptyState
            icon="😔"
            title="No matching memories found"
            description="Try adjusting your search query or lowering the similarity threshold."
          />
        )}

        {!loading && !error && filteredResults.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found{" "}
                <span className="font-semibold">{filteredResults.length}</span>{" "}
                matching {filteredResults.length === 1 ? "memory" : "memories"}
              </p>
            </div>

            <div className="grid gap-4">
              {filteredResults.map((result, index) => (
                <div key={result.memory._id || index} className="relative">
                  <MemoryCard memory={result.memory} />
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500 text-white shadow-lg">
                      {Math.round(result.similarity * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MemorySearch;

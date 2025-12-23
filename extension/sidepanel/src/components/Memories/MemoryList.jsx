import React, { useState, useEffect } from "react";
import MemoryCard from "./MemoryCard";
import MemoryFilters from "./MemoryFilters";
import LoadingSpinner from "../Common/LoadingSpinner";
import EmptyState from "../Common/EmptyState";
import ErrorMessage from "../Common/ErrorMessage";
import { useMemories } from "../../hooks/useMemories";

export function MemoryList() {
  const [selectedIntent, setSelectedIntent] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const { memories, loading, error, deleteMemory, refreshMemories } =
    useMemories();

  const filteredMemories = memories.filter((memory) => {
    // Filter by intent
    const matchesIntent =
      selectedIntent === "all" || memory.intent === selectedIntent;

    // Filter by search term
    const matchesSearch =
      !searchTerm ||
      memory.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesIntent && matchesSearch;
  });

  const handleDelete = async (id) => {
    const success = await deleteMemory(id);
    if (success) {
      // Optionally show a success message
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Your Memories</h2>
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="btn-icon"
              title={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
            >
              {viewMode === "grid" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              )}
            </button>

            {/* Refresh button */}
            <button
              onClick={refreshMemories}
              className="btn-icon"
              title="Refresh memories"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search memories by title, summary, or tags..."
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

        {/* Filters */}
        <MemoryFilters
          selectedIntent={selectedIntent}
          onIntentChange={setSelectedIntent}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && <ErrorMessage error={error} onRetry={refreshMemories} />}

        {loading && <LoadingSpinner text="Loading memories..." />}

        {!loading &&
          !error &&
          filteredMemories.length === 0 &&
          memories.length === 0 && (
            <EmptyState
              icon="📚"
              title="No memories yet"
              description="Press Ctrl+Shift+S to save a page and create your first memory!"
            />
          )}

        {!loading &&
          !error &&
          filteredMemories.length === 0 &&
          memories.length > 0 && (
            <EmptyState
              icon="🔍"
              title="No matching memories"
              description="Try adjusting your filters or search term."
              action={
                <button
                  onClick={() => {
                    setSelectedIntent("all");
                    setSearchTerm("");
                  }}
                  className="btn-secondary"
                >
                  Clear filters
                </button>
              }
            />
          )}

        {!loading && !error && filteredMemories.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredMemories.length}</span>{" "}
                of <span className="font-semibold">{memories.length}</span>{" "}
                memories
              </p>
            </div>

            <div
              className={
                viewMode === "grid" ? "grid grid-cols-1 gap-4" : "space-y-4"
              }
            >
              {filteredMemories.map((memory) => (
                <MemoryCard
                  key={memory._id}
                  memory={memory}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MemoryList;

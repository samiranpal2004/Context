import React from "react";
import { formatDate } from "../../utils/dateFormatter";
import { getIntentColor, getIntentIcon } from "../../utils/intentColors";

export function MemoryCard({ memory, onClick, onDelete }) {
  const intentColor = getIntentColor(memory.intent);
  const intentIcon = getIntentIcon(memory.intent);

  const handleClick = () => {
    if (memory.url) {
      window.open(memory.url, "_blank");
    }
    onClick?.(memory);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this memory?")) {
      onDelete?.(memory._id);
    }
  };

  const renderStars = (importance) => {
    const filled = "★".repeat(importance);
    const empty = "☆".repeat(5 - importance);
    return (
      <span className="text-yellow-500">
        {filled}
        <span className="text-gray-300">{empty}</span>
      </span>
    );
  };

  return (
    <div onClick={handleClick} className="card cursor-pointer group relative">
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
          title="Delete memory"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      {/* Intent badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`badge ${intentColor.bg} ${intentColor.text} border ${intentColor.border}`}
        >
          <span className="mr-1">{intentIcon}</span>
          <span className="capitalize">{memory.intent}</span>
        </span>
        <span className="text-xs text-gray-400">
          {formatDate(memory.capturedAt)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
        {memory.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {memory.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {memory.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded"
            >
              {tag}
            </span>
          ))}
          {memory.tags?.length > 3 && (
            <span className="text-xs text-gray-500">
              +{memory.tags.length - 3}
            </span>
          )}
        </div>

        {/* Importance */}
        <div className="flex-shrink-0 ml-2 text-sm">
          {renderStars(memory.importance || 3)}
        </div>
      </div>
    </div>
  );
}

export default MemoryCard;

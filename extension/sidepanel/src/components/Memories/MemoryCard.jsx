import React from "react";
import { formatDate } from "../../utils/dateFormatter";
import { getIntentColor, getIntentIcon } from "../../utils/intentColors";
import { Trash2, Star } from "lucide-react";

export function MemoryCard({ memory, onClick, onDelete }) {
  const intentColor = getIntentColor(memory.intent);
  const IntentIcon = getIntentIcon(memory.intent);

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
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < importance ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
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
          <Trash2 size={16} />
        </button>
      )}

      {/* Intent badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`badge ${intentColor.bg} ${intentColor.text} border ${intentColor.border}`}
        >
          <IntentIcon size={14} className="mr-1" />
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

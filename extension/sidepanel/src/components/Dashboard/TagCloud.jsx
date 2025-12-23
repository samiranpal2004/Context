import React from "react";
import { getIntentColor } from "../../utils/intentColors";

export function TagCloud({ tags = [] }) {
  if (!tags || tags.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No tags available yet
      </div>
    );
  }

  // Calculate font sizes based on tag count
  const maxCount = Math.max(...tags.map((t) => t.count));
  const minCount = Math.min(...tags.map((t) => t.count));

  const getFontSize = (count) => {
    if (maxCount === minCount) return "text-base";
    const normalized = (count - minCount) / (maxCount - minCount);
    if (normalized > 0.7) return "text-2xl";
    if (normalized > 0.4) return "text-xl";
    if (normalized > 0.2) return "text-lg";
    return "text-base";
  };

  const getOpacity = (count) => {
    if (maxCount === minCount) return "opacity-100";
    const normalized = (count - minCount) / (maxCount - minCount);
    if (normalized > 0.7) return "opacity-100";
    if (normalized > 0.4) return "opacity-80";
    return "opacity-60";
  };

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center p-4">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`
            ${getFontSize(tag.count)}
            ${getOpacity(tag.count)}
            font-semibold text-indigo-600 hover:text-purple-600
            transition-all duration-200 cursor-pointer
            hover:scale-110
          `}
          title={`${tag.count} ${tag.count === 1 ? "memory" : "memories"}`}
        >
          {tag.tag}
        </span>
      ))}
    </div>
  );
}

export default TagCloud;

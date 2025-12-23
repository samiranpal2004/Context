import React from "react";
import { formatDate } from "../../utils/dateFormatter";

export function SourceCard({ source, onClick }) {
  const handleClick = () => {
    if (source.url) {
      window.open(source.url, "_blank");
    }
    onClick?.(source);
  };

  const similarityPercentage = Math.round((source.similarity || 0) * 100);

  return (
    <div
      onClick={handleClick}
      className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600">
            {source.title}
          </h4>
          <p className="text-xs text-gray-500 truncate mt-1">{source.url}</p>
        </div>
        <div className="ml-2 flex-shrink-0">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            {similarityPercentage}%
          </span>
        </div>
      </div>
      {source.capturedAt && (
        <p className="text-xs text-gray-400 mt-2">
          Saved {formatDate(source.capturedAt)}
        </p>
      )}
    </div>
  );
}

export default SourceCard;

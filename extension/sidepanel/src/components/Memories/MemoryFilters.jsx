import React from "react";
import { getIntentIcon } from "../../utils/intentColors";
import { BookOpen } from "lucide-react";

export function MemoryFilters({
  selectedIntent,
  onIntentChange,
  availableIntents,
}) {
  const intents = availableIntents || [
    "all",
    "learning",
    "research",
    "shopping",
    "entertainment",
    "work",
    "reference",
    "inspiration",
    "other",
  ];

  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-gray-600 mb-2">
        Filter by intent:
      </p>
      <div className="flex flex-wrap gap-2">
        {intents.map((intent) => {
          const isSelected = selectedIntent === intent;
          const Icon = intent !== "all" ? getIntentIcon(intent) : BookOpen;

          return (
            <button
              key={intent}
              onClick={() => onIntentChange(intent)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200
                ${
                  isSelected
                    ? "bg-premium-dark text-premium-light shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <Icon size={14} />
              <span className="capitalize">{intent}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MemoryFilters;

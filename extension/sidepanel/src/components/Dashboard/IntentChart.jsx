import React from "react";
import { getIntentColor, getIntentIcon } from "../../utils/intentColors";

export function IntentChart({ intentDistribution = [] }) {
  if (!intentDistribution || intentDistribution.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No intent data available yet
      </div>
    );
  }

  const total = intentDistribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-3">
      {intentDistribution.map((item, index) => {
        const percentage = total > 0 ? (item.count / total) * 100 : 0;
        const intentColor = getIntentColor(item.intent);
        const intentIcon = getIntentIcon(item.intent);

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>{intentIcon}</span>
                <span className="font-medium text-gray-700 capitalize">
                  {item.intent}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{item.count}</span>
                <span className="text-xs text-gray-500">
                  ({percentage.toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${intentColor.bg.replace(
                  "100",
                  "500"
                )}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default IntentChart;

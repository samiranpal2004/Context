export const intentColors = {
  learning: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
    icon: "📚",
  },
  research: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
    icon: "🔬",
  },
  shopping: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
    icon: "🛍️",
  },
  entertainment: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-300",
    icon: "🎬",
  },
  work: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
    icon: "💼",
  },
  reference: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
    icon: "📖",
  },
  inspiration: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-300",
    icon: "✨",
  },
  other: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
    icon: "📄",
  },
};

export function getIntentColor(intent) {
  const normalizedIntent = intent?.toLowerCase() || "other";
  return intentColors[normalizedIntent] || intentColors.other;
}

export function getIntentIcon(intent) {
  const normalizedIntent = intent?.toLowerCase() || "other";
  return intentColors[normalizedIntent]?.icon || intentColors.other.icon;
}

export default intentColors;

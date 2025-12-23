import React from "react";

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              placeholder || "Ask me anything about your saved memories..."
            }
            disabled={disabled}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="btn-primary flex items-center gap-2 px-6 py-3 h-fit"
        >
          <span>Send</span>
          <span>↑</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}

export default ChatInput;

import React, { useState } from "react";
import SourceCard from "./SourceCard";
import { ChevronDown, ChevronRight } from "lucide-react";

export function ChatMessage({ message, isUser }) {
  const [showSources, setShowSources] = useState(true);

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fadeIn">
        <div className="max-w-[80%] bg-premium-dark text-premium-light px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 animate-fadeIn">
      <div className="max-w-[85%]">
        <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 ml-2">
            <button
              onClick={() => setShowSources(!showSources)}
              className="text-xs font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-1 mb-2"
            >
              {showSources ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span>Sources ({message.sources.length})</span>
            </button>

            {showSources && (
              <div className="space-y-2">
                {message.sources.map((source, index) => (
                  <SourceCard key={source.id || index} source={source} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;

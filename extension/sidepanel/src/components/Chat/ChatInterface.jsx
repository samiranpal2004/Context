import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import LoadingSpinner from "../Common/LoadingSpinner";
import EmptyState from "../Common/EmptyState";
import ErrorMessage from "../Common/ErrorMessage";
import backendAPI from "../../api/backend";
import { MessageSquare } from "lucide-react";

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What have I learned about React?",
    "Show me my research on AI",
    "What shopping items did I save?",
    "Summarize my learning this week",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);
    setError(null);

    try {
      const response = await backendAPI.chat(userMessage.content);

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          content: response.data.answer,
          isUser: false,
          sources: response.data.sources,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Start a conversation"
              description="Ask me anything about your saved memories!"
            />

            <div className="mt-6 w-full max-w-md">
              <p className="text-xs font-medium text-gray-600 mb-3">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs px-3 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-all duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isUser={message.isUser}
              />
            ))}

            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Thinking</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error display */}
      {error && <ErrorMessage error={error} onRetry={() => setError(null)} />}

      {/* Input area */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSendMessage}
        disabled={loading}
      />
    </div>
  );
}

export default ChatInterface;

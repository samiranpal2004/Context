import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  MessageSquare,
  Brain,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ChatMessage, Memory } from "../types";
import { apiService } from "../services/apiService";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const question = input;
    setInput("");
    setIsTyping(true);

    try {
      // Call backend chat endpoint (which uses RAG with memories)
      const result = await apiService.chat(question);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          result.response ||
          "I couldn't generate a response. Please try again.",
        timestamp: new Date().toISOString(),
        sources: result.sources,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error processing your request. Please make sure the backend is running and try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Brain size={24} />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900 leading-tight">
              Context AI Assistant
            </h2>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
              <Sparkles size={12} className="text-blue-500" />
              Live Context Analysis
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-10 space-y-10 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-8 shadow-inner">
              <MessageSquare size={36} />
            </div>
            <h3 className="text-display-xl text-2xl text-slate-900 mb-3">
              Your Digital Conversationalist
            </h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Synthesize everything you've saved. Ask complex questions about
              your personal research library.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full">
              {[
                "What did I learn about React hooks?",
                "Summarize my research on coffee tech",
                "What were the key takeaways from Tailwind v4?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 transition-all text-left shadow-sm"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-6 py-5 rounded-[2rem] text-sm leading-relaxed shadow-sm font-medium ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white rounded-tr-none"
                    : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-5 w-full grid grid-cols-1 gap-2.5">
                  <p className="text-label-caps ml-1">Context Reference</p>
                  {msg.sources.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 transition-all group shadow-sm"
                    >
                      <img src={s.favicon} alt="" className="w-5 h-5 rounded" />
                      <span className="font-display font-bold text-xs text-slate-700 truncate flex-grow">
                        {s.title}
                      </span>
                      <ExternalLink
                        size={14}
                        className="text-slate-300 group-hover:text-blue-600"
                      />
                    </a>
                  ))}
                </div>
              )}

              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mt-3 ml-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-[1.5rem] rounded-tl-none flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 border-t border-slate-100 bg-white">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="w-full pl-8 pr-20 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-medium text-lg"
            placeholder="Ask your second brain..."
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-black disabled:opacity-50 disabled:bg-slate-400 transition-all shadow-xl"
          >
            {isTyping ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Send size={24} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

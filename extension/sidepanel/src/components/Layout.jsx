import React from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  Search, 
  BrainCircuit 
} from "lucide-react";

export function Layout({ children, currentView, onViewChange }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "chat", label: "Chat", icon: <MessageSquare size={20} /> },
    { id: "memories", label: "Memories", icon: <BookOpen size={20} /> },
    { id: "search", label: "Search", icon: <Search size={20} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-premium-light">
      {/* Header */}
      <header className="bg-premium-dark text-premium-light px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit size={24} />
            <h1 className="text-lg font-bold">Context</h1>
          </div>
          <div className="text-xs opacity-90">Your Memory Bank</div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-2 py-2">
        <div className="flex gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  flex-1 flex flex-col items-center gap-1 px-3 py-2 rounded-lg
                  transition-all duration-200 font-medium text-xs
                  ${
                    isActive
                      ? "bg-premium-dark text-premium-light shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default Layout;

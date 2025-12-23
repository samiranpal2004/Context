import React, { useState } from "react";
import Layout from "./components/Layout";
import ChatInterface from "./components/Chat/ChatInterface";
import MemoryList from "./components/Memories/MemoryList";
import StatsOverview from "./components/Dashboard/StatsOverview";
import MemorySearch from "./components/Memories/MemorySearch";
import ApiKeySetup from "./components/Common/ApiKeySetup";
import { useApiKey } from "./hooks/useApiKey";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const { hasApiKey, loading } = useApiKey();

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <StatsOverview />;
      case "chat":
        return <ChatInterface />;
      case "memories":
        return <MemoryList />;
      case "search":
        return <MemorySearch />;
      default:
        return <StatsOverview />;
    }
  };

  // Show loading state while checking for API key
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show setup screen if no API key
  if (!hasApiKey) {
    return <ApiKeySetup onApiKeySet={() => window.location.reload()} />;
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;

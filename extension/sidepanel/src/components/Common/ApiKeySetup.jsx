import React, { useState } from "react";

export function ApiKeySetup({ onApiKeySet }) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    if (!apiKey.startsWith("ctx_")) {
      setError('Invalid format. API key should start with "ctx_"');
      return;
    }

    setLoading(true);

    try {
      // Verify API key with backend
      const response = await fetch(
        "https://context-alpha-vert.vercel.app/api/auth/verify-api-key",
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        // Save to Chrome storage
        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.set({ apiKey }, () => {
            onApiKeySet?.(apiKey);
          });
        }
      } else {
        setError("Invalid API key. Please check and try again.");
      }
    } catch (err) {
      setError(
        "Cannot connect to backend. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Context
          </h1>
          <p className="text-gray-600">Your AI-powered memory bank</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Setup Required
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your API key to get started. You can get this from your
            backend server.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                API Key
              </label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ctx_abc123..."
                disabled={loading}
                className="input-field font-mono"
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </span>
              ) : (
                "Save API Key"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div>
                <p className="text-xs font-semibold text-indigo-900 mb-1">
                  Getting Started:
                </p>
                <ul className="text-xs text-indigo-700 space-y-1">
                  <li>• Make sure backend is running on port 5000</li>
                  <li>• Register to get your API key</li>
                  <li>• API keys start with "ctx_"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Once set up, press{" "}
            <kbd className="px-2 py-1 bg-white rounded text-xs font-mono border border-gray-300">
              Ctrl+Shift+S
            </kbd>{" "}
            on any page to save it
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApiKeySetup;

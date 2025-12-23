const API_BASE_URL = "http://localhost:5000/api";

async function getApiKey() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.get("apiKey", (result) => {
        resolve(result.apiKey);
      });
    });
  }
  return null;
}

async function apiCall(endpoint, options = {}) {
  try {
    const apiKey = await getApiKey();

    if (!apiKey) {
      throw new Error(
        "API key not found. Please configure your API key in the extension settings."
      );
    }

    const headers = {
      "x-api-key": apiKey,
      ...options.headers,
    };

    if (options.body && typeof options.body === "object") {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

export const backendAPI = {
  // Get all memories
  getMemories: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.intent) queryParams.append("intent", params.intent);
    if (params.tags) queryParams.append("tags", params.tags);

    const queryString = queryParams.toString();
    const endpoint = `/memories${queryString ? `?${queryString}` : ""}`;

    return apiCall(endpoint, { method: "GET" });
  },

  // Get memory statistics
  getStats: async () => {
    return apiCall("/memories/stats", { method: "GET" });
  },

  // Semantic search
  semanticSearch: async (query, limit = 10) => {
    return apiCall("/search/semantic", {
      method: "POST",
      body: { query, limit },
    });
  },

  // RAG chat
  chat: async (question, maxMemories = 5) => {
    return apiCall("/chat", {
      method: "POST",
      body: { question, maxMemories },
    });
  },

  // Get a single memory by ID
  getMemory: async (id) => {
    return apiCall(`/memories/${id}`, { method: "GET" });
  },

  // Delete a memory
  deleteMemory: async (id) => {
    return apiCall(`/memories/${id}`, { method: "DELETE" });
  },
};

export default backendAPI;

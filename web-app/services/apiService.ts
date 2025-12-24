import { Memory, User, Intent, UserStats } from "../types";
import { API_BASE_URL } from "../constants";

class ApiService {
  private token: string | null = localStorage.getItem("ctx_token");
  private apiKey: string | null = localStorage.getItem("ctx_api_key");

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem("ctx_token", token);
    else localStorage.removeItem("ctx_token");
  }

  setApiKey(apiKey: string | null) {
    this.apiKey = apiKey;
    if (apiKey) localStorage.setItem("ctx_api_key", apiKey);
    else localStorage.removeItem("ctx_api_key");
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    if (this.apiKey) {
      headers["x-api-key"] = this.apiKey;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }
    const data = await response.json();
    return data.data || data;
  }

  // Auth endpoints
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ token: string; user: User; apiKey: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await this.handleResponse<{
      token: string;
      user: User;
    }>(response);
    this.setToken(result.token);
    this.setApiKey(result.user.apiKey);
    return {
      token: result.token,
      user: result.user,
      apiKey: result.user.apiKey,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: User; apiKey: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await this.handleResponse<{
      token: string;
      user: User;
    }>(response);
    this.setToken(result.token);
    this.setApiKey(result.user.apiKey);
    return {
      token: result.token,
      user: result.user,
      apiKey: result.user.apiKey,
    };
  }

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse<{ user: User }>(response);
    return result.user;
  }

  async regenerateApiKey(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/regenerate-api-key`, {
      method: "POST",
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse<{ apiKey: string }>(response);
    this.setApiKey(result.apiKey);
    return result.apiKey;
  }

  // Memory endpoints
  async getMemories(filters?: {
    tags?: string[];
    intent?: Intent;
    search?: string;
  }): Promise<Memory[]> {
    const params = new URLSearchParams();
    if (filters?.tags?.length) params.append("tags", filters.tags.join(","));
    if (filters?.intent) params.append("intent", filters.intent);
    if (filters?.search) params.append("search", filters.search);

    const url = `${API_BASE_URL}/memories${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse<{ memories: Memory[] }>(response);
    return result.memories;
  }

  async getMemory(id: string): Promise<Memory> {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse<{ memory: Memory }>(response);
    return result.memory;
  }

  async createMemory(memoryData: {
    url: string;
    title: string;
    domain: string;
    favicon?: string;
    pageType?: string;
    selectedText?: string;
  }): Promise<Memory> {
    const response = await fetch(`${API_BASE_URL}/memories`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(memoryData),
    });
    const result = await this.handleResponse<{ memory: Memory }>(response);
    return result.memory;
  }

  async updateMemory(id: string, data: Partial<Memory>): Promise<Memory> {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await this.handleResponse<{ memory: Memory }>(response);
    return result.memory;
  }

  async deleteMemory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    await this.handleResponse<void>(response);
  }

  async getStats(): Promise<UserStats> {
    const response = await fetch(`${API_BASE_URL}/memories/stats`, {
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse<{
      overview: { total: number; avgImportance: number; totalRevisits: number };
      topTags: Array<{ tag: string; count: number }>;
      intentDistribution: Array<{ intent: string; count: number }>;
    }>(response);

    // Map backend stats to frontend UserStats format
    return {
      totalMemories: result.overview.total,
      newThisWeek: 0, // Backend doesn't provide this yet
      averageImportance: Math.round(result.overview.avgImportance * 10) / 10,
      topCategory: result.intentDistribution[0]?.intent || "N/A",
    };
  }

  // Chat endpoints
  async chat(
    message: string,
    context?: string[]
  ): Promise<{ response: string; sources?: Memory[] }> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ question: message, context }),
    });
    const result = await this.handleResponse<{
      question: string;
      answer: string;
      sources: Memory[];
      memoryCount: number;
    }>(response);
    return {
      response: result.answer,
      sources: result.sources,
    };
  }

  async getSuggestions(query: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/chat/suggestions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ topic: query }),
    });
    const result = await this.handleResponse<{
      topic: string;
      suggestions: string[];
    }>(response);
    return result.suggestions;
  }

  // Search endpoints
  async searchMemories(query: string, limit?: number): Promise<Memory[]> {
    const response = await fetch(`${API_BASE_URL}/search/semantic`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ query, limit }),
    });
    const result = await this.handleResponse<{
      query: string;
      results: Memory[];
      count: number;
    }>(response);
    return result.results;
  }
}

export const apiService = new ApiService();

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "../types";
import { apiService } from "../services/apiService";

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("ctx_token"),
    isAuthenticated: !!localStorage.getItem("ctx_token"),
    loading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      if (state.token) {
        try {
          const user = await apiService.getMe();
          setState((prev) => ({
            ...prev,
            user,
            isAuthenticated: true,
            loading: false,
          }));
        } catch (error) {
          console.error("Failed to fetch user:", error);
          apiService.setToken(null);
          apiService.setApiKey(null);
          setState((prev) => ({
            ...prev,
            token: null,
            isAuthenticated: false,
            loading: false,
          }));
        }
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    initAuth();
  }, [state.token]);

  const login = async (email: string, pass: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const result = await apiService.login(email, pass);
      setState((prev) => ({
        ...prev,
        token: result.token,
        user: result.user,
        isAuthenticated: true,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const result = await apiService.register(name, email, pass);
      setState((prev) => ({
        ...prev,
        token: result.token,
        user: result.user,
        isAuthenticated: true,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = () => {
    apiService.setToken(null);
    apiService.setApiKey(null);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

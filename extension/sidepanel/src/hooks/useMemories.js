import { useState, useEffect, useCallback } from "react";
import backendAPI from "../api/backend";

export function useMemories(autoFetch = true) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  const fetchMemories = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await backendAPI.getMemories(params);
      if (response.success) {
        setMemories(response.data.memories);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching memories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMemories = useCallback(() => {
    fetchMemories({ page: pagination.page, limit: pagination.limit });
  }, [fetchMemories, pagination.page, pagination.limit]);

  const deleteMemory = useCallback(async (id) => {
    try {
      await backendAPI.deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchMemories();
    }
  }, [autoFetch, fetchMemories]);

  return {
    memories,
    loading,
    error,
    pagination,
    fetchMemories,
    refreshMemories,
    deleteMemory,
  };
}

export default useMemories;

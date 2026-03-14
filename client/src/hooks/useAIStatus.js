import { useState, useEffect, useCallback } from "react";
import { getAIStatus } from "../utils/api";

export function useAIStatus() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAIStatus();
      setEnabled(res.data?.data?.enabled ?? true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load AI status");
      setEnabled(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { enabled, loading, error, refetch };
}

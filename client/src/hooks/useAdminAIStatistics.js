import { useState, useEffect, useCallback } from "react";
import { getAIStatistics } from "../utils/api";

export function useAdminAIStatistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAIStatistics();
      setData(res.data?.data ?? null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load AI statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

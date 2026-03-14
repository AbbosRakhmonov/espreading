import { useState, useEffect, useCallback } from "react";
import { getAISetting, updateAISetting } from "../utils/api";

export function useAISetting() {
  const [enabled, setEnabledState] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAISetting();
      setEnabledState(res.data?.data?.enabled ?? true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load AI setting");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const setEnabled = useCallback(async (value) => {
    setError(null);
    try {
      await updateAISetting(value);
      setEnabledState(value);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update AI setting");
      throw err;
    }
  }, []);

  return { enabled, loading, error, setEnabled, refetch };
}

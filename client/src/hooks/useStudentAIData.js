import { useState, useEffect, useCallback } from "react";
import { getStudentAIData } from "../utils/api";

export function useStudentAIData(studentId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!studentId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentAIData(studentId);
      setData(res.data?.data ?? null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load student AI data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

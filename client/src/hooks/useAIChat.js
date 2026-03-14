import { useState, useCallback, useRef, useEffect } from "react";
import { getAIChatHistory, sendAIChat } from "../utils/api";

const MODES = ["vocab", "hint", "explain_task"];

export function useAIChat(readingId, readingTitle) {
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState("vocab");
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!readingId) {
      setMessages([]);
      setHistoryLoading(false);
      return;
    }
    setHistoryLoading(true);
    setError(null);
    getAIChatHistory(readingId)
      .then((res) => {
        const list = res.data?.data?.messages ?? [];
        setMessages(list.map((m) => ({ role: m.role, content: m.content })));
      })
      .catch((err) => {
        setMessages([]);
        const status = err?.response?.status;
        const msg = err?.response?.data?.message;
        if (status === 404) {
          setError("Chat history is not available. Restart the server to load previous messages.");
        } else if (msg) {
          setError(msg);
        }
      })
      .finally(() => setHistoryLoading(false));
  }, [readingId]);

  const sendMessage = useCallback(
    async (content) => {
      if (!content?.trim() || !readingId) return;
      const userMessage = { role: "user", content: content.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setLoading(true);
      setError(null);
      try {
        const res = await sendAIChat(readingId, modeRef.current, newMessages);
        const assistant = res.data?.data?.message;
        if (assistant) {
          setMessages((prev) => [...prev, assistant]);
        }
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to send message";
        setError(msg);
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setLoading(false);
      }
    },
    [readingId, messages]
  );

  return { messages, mode, setMode, sendMessage, loading, historyLoading, error, MODES };
}

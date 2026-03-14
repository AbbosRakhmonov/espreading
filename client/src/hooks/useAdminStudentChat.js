import { useState, useCallback } from "react";
import { adminAskAboutStudent } from "../utils/api";

export function useAdminStudentChat(studentId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (content) => {
      if (!content?.trim() || !studentId) return;
      const userMessage = { role: "user", content: content.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setLoading(true);
      try {
        const res = await adminAskAboutStudent(studentId, newMessages);
        const assistant = res.data?.data?.message;
        if (assistant) {
          setMessages((prev) => [...prev, assistant]);
        }
      } catch (err) {
        const errMsg = err?.response?.data?.message || "Request failed";
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${errMsg}` }]);
      } finally {
        setLoading(false);
      }
    },
    [studentId, messages]
  );

  return { messages, sendMessage, loading };
}

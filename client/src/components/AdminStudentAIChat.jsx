import React, { useRef, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

export default function AdminStudentAIChat({
  studentId,
  studentName,
  messages = [],
  onSend,
  loading = false,
  disabled = false,
}) {
  const [input, setInput] = React.useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading || disabled || !studentId) return;
    onSend(text);
    setInput("");
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 360 }}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 1.5, "&:last-child": { pb: 1.5 } }}>
        {studentName && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Asking about: {studentName}
          </Typography>
        )}
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 160,
            maxHeight: 320,
            mb: 1,
          }}
        >
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Ask about this student&apos;s progress, readings, or AI usage.
            </Typography>
          )}
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
                mb: 1,
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}
            >
              <Box sx={{ mt: 0.5 }}>
                {msg.role === "user" ? (
                  <PersonIcon fontSize="small" color="action" />
                ) : (
                  <SmartToyIcon fontSize="small" color="primary" />
                )}
              </Box>
              <Box
                sx={{
                  maxWidth: "85%",
                  p: 1,
                  borderRadius: 1,
                  bgcolor: msg.role === "user" ? "primary.light" : "grey.100",
                  color: msg.role === "user" ? "primary.contrastText" : "text.primary",
                }}
              >
                <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {msg.content}
                </Typography>
              </Box>
            </Box>
          ))}
          {loading && <Typography variant="body2" color="text.secondary">Thinking...</Typography>}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Ask about this student..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={loading || disabled}
            multiline
            maxRows={2}
          />
          <IconButton color="primary" onClick={handleSend} disabled={loading || disabled || !input.trim()} aria-label="Send">
            <SendIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

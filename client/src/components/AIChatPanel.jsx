import React, { useRef, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

const MODE_LABELS = {
  vocab: "Vocabulary",
  hint: "Hint",
  explain_task: "Explain task",
};

export default function AIChatPanel({
  messages = [],
  mode,
  onModeChange,
  onSend,
  loading = false,
  historyLoading = false,
  disabled = false,
  taskCompleted = false,
  error = null,
  modes = ["vocab", "hint", "explain_task"],
}) {
  const [input, setInput] = React.useState("");
  const scrollRef = useRef(null);
  const sendDisabled = disabled || taskCompleted || loading;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || sendDisabled) return;
    onSend(text);
    setInput("");
  };

  return (
    <Card sx={{ height: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <CardContent sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", p: 1.5, overflow: "hidden", "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1, flexShrink: 0 }}>
          {modes.map((m) => (
            <Chip
              key={m}
              label={MODE_LABELS[m] || m}
              size="small"
              onClick={() => !taskCompleted && onModeChange && onModeChange(m)}
              color={mode === m ? "primary" : "default"}
              variant={mode === m ? "filled" : "outlined"}
              disabled={taskCompleted}
            />
          ))}
        </Box>
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            mb: 1,
            px: 0.5,
          }}
        >
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              {historyLoading ? "Loading previous messages..." : "Ask for vocabulary, a hint, or an explanation of the task."}
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
          {loading && (
            <Typography variant="body2" color="text.secondary">
              Thinking...
            </Typography>
          )}
        </Box>
        {error && (
          <Typography variant="caption" color="error" sx={{ mb: 0.5, flexShrink: 0 }}>
            {error}
          </Typography>
        )}
        {taskCompleted && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, flexShrink: 0 }}>
            Task completed. AI help is closed for this reading.
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <TextField
            size="small"
            fullWidth
            placeholder={taskCompleted ? "Task completed" : "Type your question..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={sendDisabled}
            multiline
            maxRows={2}
          />
          <IconButton color="primary" onClick={handleSend} disabled={sendDisabled || !input.trim()} aria-label="Send">
            <SendIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

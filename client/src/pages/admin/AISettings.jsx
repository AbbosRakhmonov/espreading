import React from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { useAISetting } from "../../hooks/useAISetting";
import { useError } from "../../contexts/ErrorContext";

export default function AISettings() {
  const { enabled, loading, error, setEnabled } = useAISetting();
  const { showError } = useError();

  const handleToggle = async (e) => {
    const value = e.target.checked;
    try {
      await setEnabled(value);
      showError(`AI help is now ${value ? "enabled" : "disabled"}.`, "success");
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to update setting");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI Help
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            When enabled, students can use the AI help chat on reading tasks. When disabled, the chat is unavailable and
            new requests return a &quot;temporarily disabled&quot; message.
          </Typography>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={handleToggle} color="primary" />}
            label={enabled ? "AI help is enabled" : "AI help is disabled"}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

export default function CorrespondenceThread({
  readingTitle,
  messages = [],
  expanded = false,
  onToggle,
}) {
  return (
    <Accordion expanded={expanded} onChange={onToggle}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2">{readingTitle}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          {messages.length} messages
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}
            >
              <Box sx={{ mt: 0.25 }}>
                {msg.role === "user" ? (
                  <PersonIcon sx={{ fontSize: 18 }} color="action" />
                ) : (
                  <SmartToyIcon sx={{ fontSize: 18 }} color="primary" />
                )}
              </Box>
              <Box
                sx={{
                  maxWidth: "90%",
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

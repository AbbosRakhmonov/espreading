import { useState, useEffect, useCallback, useRef } from "react";
import { Box, IconButton, Tooltip, Paper, Fade } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import useTTS from "../hooks/useTTS";

const POPOVER_OFFSET = 10; // px above selection

const TTSPopover = () => {
  const { speak, stop, speaking, supported } = useTTS();
  const [position, setPosition] = useState(null); // { top, left } or null
  const [selectedText, setSelectedText] = useState("");
  const popoverRef = useRef(null);

  const hide = useCallback(() => {
    setPosition(null);
    setSelectedText("");
  }, []);

  const handleMouseUp = useCallback(
    (e) => {
      // Ignore clicks inside the popover itself
      if (popoverRef.current?.contains(e.target)) return;

      // Small delay lets the browser finalise the selection
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (!text) {
          hide();
          return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Centre the popover above the selection, accounting for scroll
        const top = rect.top + window.scrollY - POPOVER_OFFSET;
        const left = rect.left + rect.width / 2 + window.scrollX;

        setSelectedText(text);
        setPosition({ top, left });
      }, 10);
    },
    [hide]
  );

  // Dismiss when selection is cleared (e.g. click elsewhere)
  const handleSelectionChange = useCallback(() => {
    const text = window.getSelection()?.toString().trim();
    if (!text && !speaking) {
      hide();
    }
  }, [hide, speaking]);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleMouseUp, handleSelectionChange]);

  const handleSpeak = () => {
    if (speaking) {
      stop();
    } else {
      speak(selectedText);
    }
  };

  if (!supported || !position) return null;

  return (
    <Fade in>
      <Paper
        ref={popoverRef}
        elevation={4}
        sx={{
          position: "absolute",
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -100%)",
          zIndex: 1400,
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          px: 0.5,
          py: 0.25,
          pointerEvents: "auto",
        }}
      >
        <Tooltip title={speaking ? "Stop" : "Read aloud"} placement="top">
          <IconButton
            size="small"
            onClick={handleSpeak}
            color={speaking ? "error" : "primary"}
            aria-label={speaking ? "Stop reading" : "Read selected text aloud"}
          >
            {speaking ? (
              <StopIcon fontSize="small" />
            ) : (
              <VolumeUpIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Paper>
    </Fade>
  );
};

export default TTSPopover;

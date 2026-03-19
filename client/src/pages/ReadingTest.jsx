import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Drawer, Fab, useMediaQuery, useTheme } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useError } from "../contexts/ErrorContext";
import { checkReadingCompleted } from "../utils/api";
import { lessons } from "../utils/lessons";
import { useAIStatus } from "../hooks/useAIStatus";
import { useAIChat } from "../hooks/useAIChat";
import AIChatPanel from "../components/AIChatPanel";

const ReadingTest = () => {
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const { showError } = useError();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const { id, categoryId, readingId } = useParams();

  const lesson = lessons.find((l) => l.id == id);
  const category = lesson?.categories?.find((c) => c.id == categoryId);
  const reading = category?.readings?.find((r) => r.id == readingId);

  const { enabled: aiEnabled } = useAIStatus();
  const { messages, mode, setMode, sendMessage, loading: chatLoading, historyLoading, error: chatError, MODES } = useAIChat(readingId, reading?.title);
  const [data, setData] = useState({
    completed: false,
    score: 0,
    answers: {},
  });

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  if (!reading) {
    return <div>Reading not found</div>;
  }

  useEffect(() => {
    if (reading) {
      const fetchReadings = async () => {
        try {
          setLoading(true);
          const { data } = await checkReadingCompleted(reading.id);
          if (data.completed) {
            setData(data);
          } else {
            setData({
              completed: false,
              score: 0,
              answers: {},
            });
          }
        } catch (error) {
          showError(
            `Failed to check completion status for reading: ${reading.title}`
          );
        } finally {
          setLoading(false);
        }
      };

      fetchReadings();
      document.title = reading.title;
    }
  }, [reading]);

  return (
    <Box sx={{ position: "relative", userSelect: "text" }}>
      <Suspense fallback={<div>Loading...</div>}>
        {!loading && (
          <reading.reading
            completed={data.completed}
            score={data.score}
            answers={data.answers}
            time={data.time || 0}
          />
        )}
      </Suspense>
      {aiEnabled && readingId && (
        <>
          <Fab
            color="primary"
            aria-label="AI help"
            onClick={() => setChatOpen(true)}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 1200,
            }}
          >
            <SmartToyIcon />
          </Fab>
          <Drawer
            anchor={isXs ? "bottom" : "right"}
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            PaperProps={{
              sx: {
                width: isXs ? "100%" : 380,
                height: isXs ? "85vh" : "100%",
                maxHeight: "100%",
                borderTopLeftRadius: isXs ? 16 : 0,
                borderTopRightRadius: isXs ? 16 : 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              },
            }}
          >
            <Box sx={{ p: 2, height: "100%", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <AIChatPanel
                messages={messages}
                mode={mode}
                onModeChange={setMode}
                onSend={sendMessage}
                loading={chatLoading}
                historyLoading={historyLoading}
                disabled={!aiEnabled}
                taskCompleted={data.completed}
                error={chatError}
                modes={MODES}
              />
            </Box>
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default ReadingTest;

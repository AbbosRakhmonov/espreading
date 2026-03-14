import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { getStudentStatistics } from "../../utils/api";
import { useAdminStudentChat } from "../../hooks/useAdminStudentChat";
import { useStudentAIData } from "../../hooks/useStudentAIData";
import AdminStudentAIChat from "../../components/AdminStudentAIChat";

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleString();
}

export default function AdminAskStudent() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudentStatistics();
        const list = res.data?.data ?? [];
        setStudents(list.map((s) => ({ id: s._id, label: `${s.fullName} (${s.email})`, fullName: s.fullName, email: s.email })));
      } catch {
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const studentId = selectedStudent?.id ?? null;
  const { messages, sendMessage, loading } = useAdminStudentChat(studentId);
  const { data: aiHistoryData, loading: loadingHistory, error: historyError, refetch } = useStudentAIData(studentId);

  const conversations = aiHistoryData?.conversations ?? [];

  const openHistoryModal = () => {
    setHistoryModalOpen(true);
    refetch();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2, pt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Ask about a student
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a student and ask the AI about their progress, readings, or AI help usage. Answers are based only on
        data we have for that student.
      </Typography>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          {loadingStudents ? (
            <CircularProgress />
          ) : (
            <Autocomplete
              options={students}
              getOptionLabel={(opt) => opt.label ?? ""}
              value={selectedStudent}
              onChange={(_, v) => setSelectedStudent(v)}
              renderInput={(params) => <TextField {...params} label="Select student" size="small" />}
            />
          )}
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <AdminStudentAIChat
            studentId={studentId}
            studentName={selectedStudent?.fullName}
            messages={messages}
            onSend={sendMessage}
            loading={loading}
            disabled={!studentId}
          />
        </Grid2>
      </Grid2>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={openHistoryModal}
          disabled={!studentId}
        >
          AI chat tarixi (task bo&apos;yicha)
        </Button>
      </Box>

      <Dialog
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { maxHeight: "90vh" } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ChatBubbleOutlineIcon />
          Student AI history by task
          {selectedStudent?.fullName && (
            <Typography component="span" variant="body2" color="text.secondary" fontWeight="normal">
              — {selectedStudent.fullName}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {!studentId && (
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              Student tanlanmagan.
            </Paper>
          )}

          {studentId && loadingHistory && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}>
              <CircularProgress size={24} />
              <Typography variant="body2">Tarix yuklanmoqda…</Typography>
            </Box>
          )}

          {studentId && !loadingHistory && historyError && (
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "error.light", color: "error.contrastText" }}>
              {historyError}
            </Paper>
          )}

          {studentId && !loadingHistory && !historyError && conversations.length === 0 && (
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              Bu student uchun AI chat tarixi topilmadi.
            </Paper>
          )}

          {studentId && !loadingHistory && !historyError && conversations.length > 0 && (
            <Box sx={{ "& .MuiAccordion-root:before": { display: "none" }, py: 1 }}>
              {conversations.map((conv) => (
                <Accordion key={conv.conversationId} defaultExpanded={false} elevation={0} sx={{ border: "1px solid", borderColor: "divider", "&:not(:last-child)": { mb: 1 } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {conv.readingTitle}
                      </Typography>
                      <Chip label={`Reading ${conv.readingId}`} size="small" variant="outlined" />
                      <Chip label={`${conv.messageCount} xabar`} size="small" />
                      <Typography variant="caption" color="text.secondary">
                        Oxirgi: {formatDate(conv.lastMessageAt)}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, flexDirection: "column", display: "flex" }}>
                    {conv.messages?.length ? (
                      conv.messages.map((msg, idx) => (
                        <Paper
                          key={idx}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            mb: 1,
                            bgcolor: msg.role === "user" ? "grey.50" : "primary.50",
                            borderLeft: "3px solid",
                            borderLeftColor: msg.role === "user" ? "grey.400" : "primary.main",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                            {msg.role === "user" ? "Student" : "AI"} — {formatDate(msg.createdAt)}
                          </Typography>
                          <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", m: 0 }}>
                            {msg.content || "(bo'sh)"}
                          </Typography>
                        </Paper>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">Xabarlar yo&apos;q.</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryModalOpen(false)}>Yopish</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

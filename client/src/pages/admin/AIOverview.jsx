import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid2,
  Typography,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";
import { useAdminAIStatistics } from "../../hooks/useAdminAIStatistics";
import AdminAIStatCard from "../../components/AdminAIStatCard";
import AdminAIChartCard from "../../components/AdminAIChartCard";

const AI_ACCENT = "#0d9488";

export default function AIOverview() {
  const { data, loading, error } = useAdminAIStatistics();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const overview = data?.overview ?? {};
  const byMode = data?.byMode ?? {};
  const byRouting = data?.byRouting ?? {};
  const byReading = data?.byReading ?? [];
  const topStudents = data?.topStudents ?? [];

  const modeChartData = Object.entries(byMode).map(([label, value]) => ({ label, value }));
  const routingChartData = Object.entries(byRouting).map(([label, value]) => ({ label, value }));

  return (
    <Container maxWidth="xl" sx={{ py: 2, pt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ borderLeft: 4, borderColor: AI_ACCENT, pl: 2 }}>
          AI Help Overview
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button component={Link} to="/admin/ai/settings" startIcon={<SettingsIcon />} variant="outlined" size="small">
            AI Settings
          </Button>
          <Button component={Link} to="/admin/ai/ask-student" startIcon={<ChatIcon />} variant="contained" size="small">
            Ask about student
          </Button>
        </Box>
      </Box>

      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <AdminAIStatCard
            title="Total conversations"
            value={overview.totalConversations ?? 0}
            icon={<SmartToyIcon />}
            color={AI_ACCENT}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <AdminAIStatCard
            title="Total messages"
            value={overview.totalMessages ?? 0}
            icon={<ChatIcon />}
            color={AI_ACCENT}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <AdminAIStatCard
            title="Active students"
            value={overview.activeStudents ?? 0}
            subtitle="Used AI help"
            icon={<SmartToyIcon />}
            color={AI_ACCENT}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        {modeChartData.length > 0 && (
          <Grid2 size={{ xs: 12, md: 6 }}>
            <AdminAIChartCard title="Usage by mode" data={modeChartData} type="bar" />
          </Grid2>
        )}
        {routingChartData.length > 0 && (
          <Grid2 size={{ xs: 12, md: 6 }}>
            <AdminAIChartCard title="By routing" data={routingChartData} type="pie" />
          </Grid2>
        )}
      </Grid2>

      {byReading.length > 0 && (
        <Card sx={{ mb: 4, borderLeft: 4, borderColor: AI_ACCENT }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Usage by reading
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {byReading.map((r) => (
                <li key={r.readingId}>
                  <Typography variant="body2">
                    {r.readingTitle}: {r.count} conversation(s)
                  </Typography>
                </li>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {topStudents.length > 0 && (
        <Card sx={{ borderLeft: 4, borderColor: AI_ACCENT }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top students by AI usage
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {topStudents.slice(0, 10).map((s) => (
                <li key={s.studentId}>
                  <Typography variant="body2">
                    {s.fullName} ({s.email}): {s.conversationCount} conversation(s)
                  </Typography>
                </li>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

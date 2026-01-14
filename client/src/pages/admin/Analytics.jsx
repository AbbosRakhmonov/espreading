import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
} from "@mui/material";
import { getStatistics } from "../../utils/api";
import { useError } from "../../contexts/ErrorContext";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const { showError } = useError();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await getStatistics();
        setStatistics(response.data.data);
      } catch (error) {
        showError(error?.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [showError]);

  const rows = useMemo(() => {
    if (!statistics) return [];
    const { readingsByLesson = [] } = statistics;
    return readingsByLesson.map((r) => {
      const total = (r.completed || 0) + (r.inProgress || 0);
      const pct = total > 0 ? (r.completed / total) * 100 : 0;
      return {
        key: `${r._id.lesson}-${r._id.category}-${r._id.reading}`,
        readingId: r._id.reading,
        readingTitle: r._id.readingTitle,
        lessonId: r._id.lesson,
        lessonTitle: r._id.lessonTitle,
        categoryId: r._id.category,
        categoryTitle: r._id.categoryTitle,
        completed: r.completed || 0,
        inProgress: r.inProgress || 0,
        total,
        completionPct: pct,
        avgScore: r.avgScore,
        avgTime: r.avgTime,
      };
    });
  }, [statistics]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!statistics) {
    return (
      <Typography variant="h6" color="error" align="center">
        No analytics available
      </Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Lessons / Readings Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Completion rate, average score, and average time per reading.
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Lesson</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Reading</strong></TableCell>
                <TableCell align="right"><strong>Completed</strong></TableCell>
                <TableCell align="right"><strong>In progress</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell align="right"><strong>Avg score</strong></TableCell>
                <TableCell align="right"><strong>Avg time (sec)</strong></TableCell>
                <TableCell><strong>Completion %</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.key} hover>
                  <TableCell>
                    {r.lessonTitle || (r.lessonId ? `Lesson ${r.lessonId}` : "—")}
                  </TableCell>
                  <TableCell>
                    {r.categoryTitle || (r.categoryId ? `Category ${r.categoryId}` : "—")}
                  </TableCell>
                  <TableCell>
                    {r.readingTitle || `Reading ${r.readingId}`}
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={r.completed} size="small" color="success" />
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={r.inProgress} size="small" color="warning" />
                  </TableCell>
                  <TableCell align="right">{r.total}</TableCell>
                  <TableCell align="right">
                    {r.avgScore == null ? "—" : Number(r.avgScore).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {r.avgTime == null ? "—" : Math.round(Number(r.avgTime))}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, Math.max(0, r.completionPct))}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 52 }}>
                        {r.completionPct.toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No readings found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default Analytics;


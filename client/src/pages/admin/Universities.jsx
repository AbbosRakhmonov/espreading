import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  LinearProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PieChart } from "@mui/x-charts/PieChart";
import { getStatistics } from "../../utils/api";
import { useError } from "../../contexts/ErrorContext";

const palette = [
  "#3498db",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#e74c3c",
  "#1abc9c",
  "#34495e",
];

const Universities = () => {
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
        showError(
          error?.response?.data?.message ||
            "Failed to load university statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [showError]);

  const universityRows = useMemo(() => {
    if (!statistics) return [];
    const { universityStats = [], avgScoreByUniversity = [] } = statistics;

    return universityStats.map((u) => {
      const avg = avgScoreByUniversity.find((x) => x._id === u.university);
      return {
        university: u.university,
        students: u.count,
        percentage: Number(u.percentage || 0),
        avgScore: avg ? Number(avg.avgScore || 0) : null,
        totalReadings: avg ? Number(avg.totalReadings || 0) : 0,
      };
    });
  }, [statistics]);

  const pieData = useMemo(() => {
    return universityRows.map((u) => ({
      id: u.university,
      label: u.university,
      value: u.students,
    }));
  }, [universityRows]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!statistics) {
    return (
      <Typography variant="h6" color="error" align="center">
        No university statistics available
      </Typography>
    );
  }

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Universities (Student Distribution)
              </Typography>
              {pieData.length ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                    py: 3,
                  }}
                >
                  <PieChart
                    colors={palette}
                    series={[
                      {
                        data: pieData,
                        arcLabel: (item) => {
                          const total = pieData.reduce(
                            (sum, d) => sum + d.value,
                            0
                          );
                          const percentage = (
                            (item.value / total) *
                            100
                          ).toFixed(1);
                          return `${percentage}%`;
                        },
                        arcLabelMinAngle: 15,
                        innerRadius: 60,
                        outerRadius: 120,
                        paddingAngle: 2,
                        cornerRadius: 5,
                      },
                    ]}
                    width={400}
                    height={300}
                    margin={{ top: 40, right: 40, bottom: 100, left: 40 }}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                        padding: { top: 20 },
                        itemMarkWidth: 12,
                        itemMarkHeight: 12,
                        markGap: 8,
                        itemGap: 16,
                        labelStyle: {
                          fontSize: 14,
                        },
                      },
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                University Performance
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>University</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Students</strong>
                      </TableCell>
                      <TableCell>
                        <strong>% of all students</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Avg score</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Total completed readings</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {universityRows.map((u) => (
                      <TableRow key={u.university} hover>
                        <TableCell>{u.university}</TableCell>
                        <TableCell align="right">
                          <Chip label={u.students} size="small" />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(100, Math.max(0, u.percentage))}
                              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2" sx={{ minWidth: 56 }}>
                              {u.percentage.toFixed(2)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {u.avgScore == null ? "—" : u.avgScore.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">{u.totalReadings}</TableCell>
                      </TableRow>
                    ))}
                    {!universityRows.length && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ py: 3 }}
                          >
                            No universities found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Universities;

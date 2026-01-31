import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
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
import React, { useEffect, useState } from "react";
import InfoCard from "../../components/InfoCard";
import { getStatistics, getQuestionnaireStatistics } from "../../utils/api";
import { useError } from "../../contexts/ErrorContext";
import { formatTime } from "../../utils/formatTime";
import { formatDateTashkent, formatDateOnlyTashkent } from "../../utils/formatDate";

const pieParams = {
  height: 300,
  margin: { top: 20, right: 20, bottom: 80, left: 20 },
};

const colorPalettes = [
  ["#3498db", "#f1c40f", "#e74c3c", "#2ecc71", "#9b59b6"],
  ["#1abc9c", "#e67e73", "#16a085", "#f7dc6f", "#8e44ad"],
  ["#27ae60", "#2980b9", "#d35400", "#2c3e50", "#f39c12"],
  ["#e74c3c", "#3498db", "#f39c12", "#2ecc71", "#9b59b6"],
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [questionnaireStats, setQuestionnaireStats] = useState(null);
  const { showError } = useError();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const [statsResponse, preQResponse, postQResponse] = await Promise.all([
          getStatistics(),
          getQuestionnaireStatistics("pre"),
          getQuestionnaireStatistics("post"),
        ]);
        setStatistics(statsResponse.data.data);
        setQuestionnaireStats({
          pre: preQResponse.data.data,
          post: postQResponse.data.data,
        });
      } catch (error) {
        showError(error?.response?.data?.message || "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [showError]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!statistics) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h6" color="error">
          No statistics available
        </Typography>
      </Container>
    );
  }

  const { overview, universityStats, avgScoreByUniversity, readingsByLesson, studentProgress, completionRate, recentCompletions } = statistics;

  // Prepare score distribution data for pie charts by university
  const getScoreDistributionByUniversity = (university) => {
    const distribution = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    studentProgress.forEach((progress) => {
      if (progress.university === university && progress.completed) {
        const score = progress.score || 0;
        if (score >= 0 && score <= 5) {
          distribution[score] = (distribution[score] || 0) + 1;
        }
      }
    });

    const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
    if (total === 0) return [];

    return [
      { label: "Score 0", value: distribution[0], percentage: ((distribution[0] / total) * 100).toFixed(1) },
      { label: "Score 1", value: distribution[1], percentage: ((distribution[1] / total) * 100).toFixed(1) },
      { label: "Score 2", value: distribution[2], percentage: ((distribution[2] / total) * 100).toFixed(1) },
      { label: "Score 3", value: distribution[3], percentage: ((distribution[3] / total) * 100).toFixed(1) },
      { label: "Score 4", value: distribution[4], percentage: ((distribution[4] / total) * 100).toFixed(1) },
      { label: "Score 5", value: distribution[5], percentage: ((distribution[5] / total) * 100).toFixed(1) },
    ].filter((item) => item.value > 0);
  };

  // Calculate total lessons (unique lesson IDs from readingsByLesson)
  const totalLessons = new Set(readingsByLesson.map((r) => r._id.lesson)).size;
  const totalReadings = new Set(readingsByLesson.map((r) => r._id.reading)).size;

  return (
    <Box>
      <Container maxWidth="xl" sx={{ py: 2, pt: 4 }}>
        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoCard
              icon={<GroupsIcon fontSize="large" />}
              title="Total Students"
              value={overview.totalStudents || 0}
              color="primary.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoCard
              icon={<MenuBookIcon fontSize="large" />}
              title="Total Lessons"
              value={totalLessons || 0}
              color="secondary.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoCard
              icon={<AutoStoriesIcon fontSize="large" />}
              title="Total Readings"
              value={totalReadings || 0}
              color="info.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoCard
              icon={<TrendingUpIcon fontSize="large" />}
              title="Completed Readings"
              value={overview.totalReadings || 0}
              color="success.main"
            />
          </Grid>
        </Grid>

        {/* University Statistics */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
              University Statistics
            </Typography>
            <Grid container spacing={3}>
              {universityStats.map((uni, index) => {
                const scoreData = getScoreDistributionByUniversity(uni.university);
                const avgScore = avgScoreByUniversity.find((a) => a._id === uni.university);
                
                return (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={uni.university}>
                    <Paper sx={{ p: 2, height: "100%" }}>
                      <Typography variant="h6" component="h3" align="center" gutterBottom>
                        {uni.university}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Students: {uni.count} ({uni.percentage}%)
                        </Typography>
                        {avgScore && (
                          <Typography variant="body2" color="text.secondary" align="center">
                            Avg Score: {avgScore.avgScore.toFixed(2)} | Readings: {avgScore.totalReadings}
                          </Typography>
                        )}
                      </Box>
                      {scoreData.length > 0 ? (
                        <PieChart
                          colors={colorPalettes[index % colorPalettes.length]}
                          series={[
                            {
                              data: scoreData,
                              innerRadius: 30,
                              outerRadius: 100,
                              arcLabel: (item) => `${item.percentage}%`,
                              arcLabelMinAngle: 15,
                            },
                          ]}
                          slotProps={{
                            legend: {
                              direction: "row",
                              position: { vertical: "bottom", horizontal: "middle" },
                              padding: { top: 20 },
                            },
                          }}
                          {...pieParams}
                        />
                      ) : (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No data available
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>

        {/* Reading Completion Rates */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
              Reading Completion Rates
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Reading ID</strong></TableCell>
                    <TableCell><strong>Lesson</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Completed</strong></TableCell>
                    <TableCell align="right"><strong>In Progress</strong></TableCell>
                    <TableCell align="right"><strong>Total</strong></TableCell>
                    <TableCell align="right"><strong>Avg Score</strong></TableCell>
                    <TableCell align="right"><strong>Avg Time</strong></TableCell>
                    <TableCell align="center"><strong>Completion %</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {readingsByLesson.map((reading) => {
                    const total = reading.completed + reading.inProgress;
                    const completionPercentage = total > 0 ? ((reading.completed / total) * 100).toFixed(1) : 0;
                    
                    return (
                      <TableRow key={`${reading._id.lesson}-${reading._id.category}-${reading._id.reading}`}>
                        <TableCell>{reading._id.reading}</TableCell>
                        <TableCell>
                          {reading._id.lessonTitle
                            ? reading._id.lessonTitle
                            : `Lesson ${reading._id.lesson}`}
                        </TableCell>
                        <TableCell>
                          {reading._id.categoryTitle
                            ? reading._id.categoryTitle
                            : `Category ${reading._id.category}`}
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={reading.completed} color="success" size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={reading.inProgress} color="warning" size="small" />
                        </TableCell>
                        <TableCell align="right">{total}</TableCell>
                        <TableCell align="right">
                          {reading.avgScore ? reading.avgScore.toFixed(2) : "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          {reading.avgTime ? formatTime(Math.round(reading.avgTime)) : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(completionPercentage)}
                              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2" sx={{ minWidth: 45 }}>
                              {completionPercentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Student Progress Table */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
              Student Progress Details
            </Typography>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>University</strong></TableCell>
                    <TableCell><strong>Reading</strong></TableCell>
                    <TableCell><strong>Lesson</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Score</strong></TableCell>
                    <TableCell align="right"><strong>Time</strong></TableCell>
                    <TableCell align="center"><strong>Status</strong></TableCell>
                    <TableCell><strong>Completed At</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentProgress.slice(0, 100).map((progress, index) => (
                    <TableRow key={index}>
                      <TableCell>{progress.studentName}</TableCell>
                      <TableCell>{progress.studentEmail}</TableCell>
                      <TableCell>{progress.university}</TableCell>
                    <TableCell>
                      {progress.readingTitle ? progress.readingTitle : `Reading ${progress.reading}`}
                    </TableCell>
                    <TableCell>
                      {progress.lessonTitle
                        ? progress.lessonTitle
                        : progress.lesson
                          ? `Lesson ${progress.lesson}`
                          : "N/A"}
                    </TableCell>
                    <TableCell>
                      {progress.categoryTitle
                        ? progress.categoryTitle
                        : progress.category
                          ? `Category ${progress.category}`
                          : "N/A"}
                    </TableCell>
                      <TableCell align="right">
                        {progress.completed ? (
                          <Chip label={progress.score || 0} color="success" size="small" />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {progress.completed && progress.time
                          ? formatTime(progress.time)
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={progress.completed ? "Completed" : "In Progress"}
                          color={progress.completed ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {progress.completed && progress.completedAt
                          ? formatDateOnlyTashkent(progress.completedAt)
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {studentProgress.length > 100 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
                Showing first 100 records of {studentProgress.length} total
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Recent Completions */}
        {recentCompletions && recentCompletions.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                Recent Completions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Student</strong></TableCell>
                      <TableCell><strong>University</strong></TableCell>
                      <TableCell><strong>Reading</strong></TableCell>
                      <TableCell align="right"><strong>Score</strong></TableCell>
                      <TableCell align="right"><strong>Time</strong></TableCell>
                      <TableCell><strong>Completed At</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentCompletions.map((completion, index) => (
                      <TableRow key={index}>
                        <TableCell>{completion.user?.fullName || "N/A"}</TableCell>
                        <TableCell>{completion.user?.university || "N/A"}</TableCell>
                        <TableCell>
                          {completion.readingTitle
                            ? completion.readingTitle
                            : `Reading ${completion.reading}`}
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={completion.score || 0} color="success" size="small" />
                        </TableCell>
                        <TableCell align="right">
                          {completion.time ? formatTime(completion.time) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {completion.completedAt
                            ? formatDateTashkent(completion.completedAt)
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Questionnaire Statistics */}
        {questionnaireStats && (
          <>
            {/* Overall Questionnaire Statistics */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                  Reading Strategies Questionnaire - Overall Statistics
                </Typography>
                <Grid container spacing={3}>
                  {/* Pre-Questionnaire */}
                  {questionnaireStats.pre && questionnaireStats.pre.overall && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                          Pre-Questionnaire (Before Lesson 1)
                        </Typography>
                        <PieChart
                          colors={["#3498db", "#f1c40f", "#e74c3c"]}
                          series={[
                            {
                              data: [
                                {
                                  label: `Global (${questionnaireStats.pre.overall.globAverage.toFixed(2)})`,
                                  value: questionnaireStats.pre.overall.globAverage,
                                },
                                {
                                  label: `Problem Solving (${questionnaireStats.pre.overall.probAverage.toFixed(2)})`,
                                  value: questionnaireStats.pre.overall.probAverage,
                                },
                                {
                                  label: `Support (${questionnaireStats.pre.overall.supAverage.toFixed(2)})`,
                                  value: questionnaireStats.pre.overall.supAverage,
                                },
                              ],
                              innerRadius: 30,
                              outerRadius: 100,
                              arcLabel: (item) => `${item.value.toFixed(2)}`,
                              arcLabelMinAngle: 15,
                            },
                          ]}
                          slotProps={{
                            legend: {
                              direction: "row",
                              position: { vertical: "bottom", horizontal: "middle" },
                              padding: { top: 20 },
                            },
                          }}
                          {...pieParams}
                        />
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <Typography variant="body2">
                            <strong>Global:</strong> {questionnaireStats.pre.overall.globAverage.toFixed(2)} ({questionnaireStats.pre.overall.globLevel}) |{" "}
                            <strong>Problem Solving:</strong> {questionnaireStats.pre.overall.probAverage.toFixed(2)} ({questionnaireStats.pre.overall.probLevel}) |{" "}
                            <strong>Support:</strong> {questionnaireStats.pre.overall.supAverage.toFixed(2)} ({questionnaireStats.pre.overall.supLevel})
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            3.5 or higher = High | 2.5 – 3.4 = Medium | 2.4 or lower = Low
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  )}

                  {/* Post-Questionnaire */}
                  {questionnaireStats.post && questionnaireStats.post.overall && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                          Post-Questionnaire (After Lesson 12)
                        </Typography>
                        <PieChart
                          colors={["#2ecc71", "#f39c12", "#9b59b6"]}
                          series={[
                            {
                              data: [
                                {
                                  label: `Global (${questionnaireStats.post.overall.globAverage.toFixed(2)})`,
                                  value: questionnaireStats.post.overall.globAverage,
                                },
                                {
                                  label: `Problem Solving (${questionnaireStats.post.overall.probAverage.toFixed(2)})`,
                                  value: questionnaireStats.post.overall.probAverage,
                                },
                                {
                                  label: `Support (${questionnaireStats.post.overall.supAverage.toFixed(2)})`,
                                  value: questionnaireStats.post.overall.supAverage,
                                },
                              ],
                              innerRadius: 30,
                              outerRadius: 100,
                              arcLabel: (item) => `${item.value.toFixed(2)}`,
                              arcLabelMinAngle: 15,
                            },
                          ]}
                          slotProps={{
                            legend: {
                              direction: "row",
                              position: { vertical: "bottom", horizontal: "middle" },
                              padding: { top: 20 },
                            },
                          }}
                          {...pieParams}
                        />
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <Typography variant="body2">
                            <strong>Global:</strong> {questionnaireStats.post.overall.globAverage.toFixed(2)} ({questionnaireStats.post.overall.globLevel}) |{" "}
                            <strong>Problem Solving:</strong> {questionnaireStats.post.overall.probAverage.toFixed(2)} ({questionnaireStats.post.overall.probLevel}) |{" "}
                            <strong>Support:</strong> {questionnaireStats.post.overall.supAverage.toFixed(2)} ({questionnaireStats.post.overall.supLevel})
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            3.5 or higher = High | 2.5 – 3.4 = Medium | 2.4 or lower = Low
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Questionnaire Statistics by Institution */}
            {questionnaireStats.pre && questionnaireStats.pre.byInstitution && questionnaireStats.pre.byInstitution.length > 0 && (
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                    Pre-Questionnaire Statistics by Institution
                  </Typography>
                  <Grid container spacing={3}>
                    {questionnaireStats.pre.byInstitution.map((inst, index) => (
                      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={inst.university}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="h6" align="center" gutterBottom>
                            {inst.university}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                            {inst.count} {inst.count === 1 ? "response" : "responses"}
                          </Typography>
                          <PieChart
                            colors={colorPalettes[index % colorPalettes.length]}
                            series={[
                              {
                                data: [
                                  {
                                    label: `Global (${inst.globAverage.toFixed(2)})`,
                                    value: inst.globAverage,
                                  },
                                  {
                                    label: `Problem Solving (${inst.probAverage.toFixed(2)})`,
                                    value: inst.probAverage,
                                  },
                                  {
                                    label: `Support (${inst.supAverage.toFixed(2)})`,
                                    value: inst.supAverage,
                                  },
                                ],
                                innerRadius: 30,
                                outerRadius: 100,
                                arcLabel: (item) => `${item.value.toFixed(2)}`,
                                arcLabelMinAngle: 15,
                              },
                            ]}
                            slotProps={{
                              legend: {
                                direction: "row",
                                position: { vertical: "bottom", horizontal: "middle" },
                                padding: { top: 20 },
                              },
                            }}
                            {...pieParams}
                          />
                          <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Typography variant="body2">
                              <strong>Global:</strong> {inst.globAverage.toFixed(2)} ({inst.globLevel}) |{" "}
                              <strong>Problem Solving:</strong> {inst.probAverage.toFixed(2)} ({inst.probLevel}) |{" "}
                              <strong>Support:</strong> {inst.supAverage.toFixed(2)} ({inst.supLevel})
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                              3.5 or higher = High | 2.5 – 3.4 = Medium | 2.4 or lower = Low
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Post-Questionnaire Statistics by Institution */}
            {questionnaireStats.post && questionnaireStats.post.byInstitution && questionnaireStats.post.byInstitution.length > 0 && (
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                    Post-Questionnaire Statistics by Institution
                  </Typography>
                  <Grid container spacing={3}>
                    {questionnaireStats.post.byInstitution.map((inst, index) => (
                      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={inst.university}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography variant="h6" align="center" gutterBottom>
                            {inst.university}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                            {inst.count} {inst.count === 1 ? "response" : "responses"}
                          </Typography>
                          <PieChart
                            colors={colorPalettes[index % colorPalettes.length]}
                            series={[
                              {
                                data: [
                                  {
                                    label: `Global (${inst.globAverage.toFixed(2)})`,
                                    value: inst.globAverage,
                                  },
                                  {
                                    label: `Problem Solving (${inst.probAverage.toFixed(2)})`,
                                    value: inst.probAverage,
                                  },
                                  {
                                    label: `Support (${inst.supAverage.toFixed(2)})`,
                                    value: inst.supAverage,
                                  },
                                ],
                                innerRadius: 30,
                                outerRadius: 100,
                              },
                            ]}
                            slotProps={{
                              legend: {
                                direction: "column",
                                position: { vertical: "middle", horizontal: "right" },
                                padding: 0,
                              },
                            }}
                            {...pieParams}
                          />
                          <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Typography variant="body2">
                              <strong>Global:</strong> {inst.globAverage.toFixed(2)} ({inst.globLevel}) |{" "}
                              <strong>Problem Solving:</strong> {inst.probAverage.toFixed(2)} ({inst.probLevel}) |{" "}
                              <strong>Support:</strong> {inst.supAverage.toFixed(2)} ({inst.supLevel})
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                              3.5 or higher = High | 2.5 – 3.4 = Medium | 2.4 or lower = Low
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;

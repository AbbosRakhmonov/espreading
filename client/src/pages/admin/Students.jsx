import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import React, { useEffect, useMemo, useState } from "react";
import {
  getStudentStatistics,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  exportStudents,
  exportStatistics,
} from "../../utils/api";
import { useError } from "../../contexts/ErrorContext";
import { formatTime } from "../../utils/formatTime";
import { lessons } from "../../utils/lessons";
import { categoris } from "../../utils/generateCategories";
import { useSearchParams } from "react-router-dom";

// Helper function to get reading title
const getReadingTitle = (readingId, lessonId) => {
  if (!lessonId) return `Reading ${readingId}`;
  
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return `Reading ${readingId}`;

  for (const category of lesson.categories) {
    const reading = category.readings.find((r) => r.id === parseInt(readingId));
    if (reading) {
      return reading.title;
    }
  }
  return `Reading ${readingId}`;
};

// Helper function to get category title
const getCategoryTitle = (categoryId) => {
  const category = categoris.find((c) => c.id === categoryId);
  return category ? category.title : `Category ${categoryId}`;
};

const getLessonTitle = (lessonId) => {
  const lesson = lessons.find((l) => l.id === Number(lessonId));
  return lesson ? lesson.title : `Lesson ${lessonId}`;
};

const Students = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { showError } = useError();
  
  // CRUD modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    university: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  
  // Date range filter
  const startDateFilter = searchParams.get("startDate") || "";
  const endDateFilter = searchParams.get("endDate") || "";

  // URL-backed filters (persist on refresh / share link)
  const searchTerm = searchParams.get("q") || "";
  const universityFilter = searchParams.get("university") || "";
  const lessonFilter = searchParams.get("lesson") || "";
  const readingFilter = searchParams.get("reading") || "";
  const page = Math.max(0, Number(searchParams.get("page") || 0));
  const rowsPerPage = Math.max(1, Number(searchParams.get("rows") || 10));

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || Number.isNaN(value)) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getStudentStatistics();
        setStudents(response.data.data);
      } catch (error) {
        showError(error?.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [showError]);

  const handleViewHistory = async (studentId) => {
    try {
      setLoadingDetails(true);
      const response = await getStudentById(studentId);
      setStudentDetails(response.data.data);
      setSelectedStudent(studentId);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to load student details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setStudentDetails(null);
  };

  // CRUD handlers
  const handleCreateClick = () => {
    setFormData({ fullName: "", email: "", password: "", university: "" });
    setCreateModalOpen(true);
  };

  const handleEditClick = (student) => {
    setStudentToEdit(student);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      password: "",
      university: student.university,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const handleCreateStudent = async () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.university) {
      showError("Please fill in all required fields");
      return;
    }

    try {
      setFormLoading(true);
      const response = await createStudent(formData);
      setStudents((prev) => [response.data.data, ...prev]);
      setCreateModalOpen(false);
      setFormData({ fullName: "", email: "", password: "", university: "" });
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to create student");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStudent = async () => {
    if (!formData.fullName || !formData.email || !formData.university) {
      showError("Please fill in all required fields");
      return;
    }

    try {
      setFormLoading(true);
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password; // Don't update password if empty
      }
      const response = await updateStudent(studentToEdit._id, updateData);
      setStudents((prev) =>
        prev.map((s) => (s._id === studentToEdit._id ? response.data.data : s))
      );
      setEditModalOpen(false);
      setStudentToEdit(null);
      setFormData({ fullName: "", email: "", password: "", university: "" });
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to update student");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    try {
      setFormLoading(true);
      await deleteStudent(studentToDelete._id);
      setStudents((prev) => prev.filter((s) => s._id !== studentToDelete._id));
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to delete student");
    } finally {
      setFormLoading(false);
    }
  };

  // Export handlers
  const handleExportStudents = async () => {
    try {
      const response = await exportStudents();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `students_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to export students");
    }
  };

  const handleExportStatistics = async () => {
    try {
      const response = await exportStatistics();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `statistics_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to export statistics");
    }
  };

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return students
      .filter((student) => {
        if (!normalizedSearch) return true;
        return (
          student.fullName.toLowerCase().includes(normalizedSearch) ||
          student.email.toLowerCase().includes(normalizedSearch) ||
          student.university.toLowerCase().includes(normalizedSearch)
        );
      })
      .filter((student) => {
        if (universityFilter && student.university !== universityFilter) return false;

        if (lessonFilter) {
          const lessonNum = Number(lessonFilter);
          const hasLesson = (student.readings || []).some(
            (r) => Number(r.lesson) === lessonNum
          );
          if (!hasLesson) return false;
        }

        if (readingFilter) {
          const readingId = String(readingFilter);
          const hasReading = (student.readings || []).some(
            (r) => String(r.reading) === readingId
          );
          if (!hasReading) return false;
        }

        // Date range filter
        if (startDateFilter || endDateFilter) {
          const studentDate = new Date(student.createdAt);
          if (startDateFilter) {
            const startDate = new Date(startDateFilter);
            if (studentDate < startDate) return false;
          }
          if (endDateFilter) {
            const endDate = new Date(endDateFilter);
            endDate.setHours(23, 59, 59, 999); // Include entire end date
            if (studentDate > endDate) return false;
          }
        }

        return true;
      });
  }, [students, searchTerm, universityFilter, lessonFilter, readingFilter, startDateFilter, endDateFilter]);

  const universities = Array.from(
    new Set((students || []).map((s) => s.university).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const lessonOptions = lessons
    .filter((l) => (l.categories || []).some((c) => (c.readings || []).length > 0))
    .map((l) => ({
      id: l.id,
      label: `${l.title}${l.subtitle ? ` — ${l.subtitle}` : ""}`,
    }));

  const allReadingOptions = lessons
    .flatMap((l) =>
      (l.categories || []).flatMap((c) =>
        (c.readings || []).map((r) => ({
          id: String(r.id),
          lessonId: l.id,
          // Use trimmed titles to avoid accidental trailing spaces from source data
          label: `${r.id} — ${String(r.title || "").trim()}`,
        }))
      )
    )
    // de-dupe by reading id (IDs are unique in this app, but keep safe)
    .filter(
      (opt, idx, arr) => arr.findIndex((x) => x.id === opt.id) === idx
    )
    .sort((a, b) => Number(a.id) - Number(b.id));

  const readingOptions = lessonFilter
    ? allReadingOptions.filter((r) => r.lessonId === Number(lessonFilter))
    : allReadingOptions;

  const handleChangePage = (event, newPage) => {
    updateParams({ page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    updateParams({ rows: parseInt(event.target.value, 10), page: 0 });
  };

  // Calculate paginated students
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={2}
            sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" component="h1">
                Students Management
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "flex-start", md: "flex-end" }, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateClick}
                >
                  Add Student
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExportStudents}
                >
                  Export Students
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExportStatistics}
                >
                  Export Statistics
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Grid container spacing={2} sx={{ justifyContent: { xs: "flex-start", md: "flex-start" } }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => updateParams({ q: e.target.value, page: 0 })}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>University</InputLabel>
                    <Select
                      label="University"
                      value={universityFilter}
                      onChange={(e) => updateParams({ university: e.target.value, page: 0 })}
                    >
                      <MenuItem value="">All universities</MenuItem>
                      {universities.map((u) => (
                        <MenuItem key={u} value={u}>
                          {u}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Lesson</InputLabel>
                    <Select
                      label="Lesson"
                      value={lessonFilter}
                      onChange={(e) =>
                        updateParams({
                          lesson: e.target.value,
                          // reset dependent reading when lesson changes
                          reading: "",
                          page: 0,
                        })
                      }
                    >
                      <MenuItem value="">All</MenuItem>
                      {lessonOptions.map((l) => (
                        <MenuItem key={l.id} value={String(l.id)}>
                          {l.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Reading</InputLabel>
                    <Select
                      label="Reading"
                      value={readingFilter}
                      onChange={(e) => updateParams({ reading: e.target.value, page: 0 })}
                    >
                      <MenuItem value="">All</MenuItem>
                      {readingOptions.map((r) => (
                        <MenuItem key={r.id} value={r.id}>
                          {r.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    size="small"
                    value={startDateFilter}
                    onChange={(e) => updateParams({ startDate: e.target.value, page: 0 })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    size="small"
                    value={endDateFilter}
                    onChange={(e) => updateParams({ endDate: e.target.value, page: 0 })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>University</strong></TableCell>
                  <TableCell align="right"><strong>Total Readings</strong></TableCell>
                  <TableCell align="right"><strong>Completed</strong></TableCell>
                  <TableCell align="right"><strong>In Progress</strong></TableCell>
                  <TableCell align="right"><strong>Avg Score</strong></TableCell>
                  <TableCell align="right"><strong>Total Time</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        {searchTerm ? "No students found matching your search" : "No students found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student) => (
                    <TableRow key={student._id} hover>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.university}</TableCell>
                      <TableCell align="right">{student.totalReadings}</TableCell>
                      <TableCell align="right">
                        <Chip label={student.completedReadings} color="success" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Chip label={student.inProgressReadings} color="warning" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        {student.completedReadings > 0 ? (
                          <Chip label={student.avgScore} color="info" size="small" />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {student.totalTime > 0 ? formatTime(student.totalTime) : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewHistory(student._id)}
                            size="small"
                            title="View History"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            color="info"
                            onClick={() => handleEditClick(student)}
                            size="small"
                            title="Edit Student"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(student)}
                            size="small"
                            title="Delete Student"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredStudents.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        </CardContent>
      </Card>

      {/* Student History Modal */}
      <Dialog
        open={!!selectedStudent}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { maxHeight: "90vh" },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5">
              {studentDetails?.student?.fullName || "Student"} - Reading History
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : studentDetails ? (
            <Box>
              {/* Student Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {studentDetails.student.email}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        University
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {studentDetails.student.university}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Joined Date
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {new Date(studentDetails.student.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Statistics Summary */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statistics Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {studentDetails.statistics.totalReadings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Readings
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h4" color="success.main">
                          {studentDetails.statistics.completedReadings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completed
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h4" color="warning.main">
                          {studentDetails.statistics.inProgressReadings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          In Progress
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h4" color="info.main">
                          {studentDetails.statistics.avgScore}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Score
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Reading History Table */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Reading History
                  </Typography>
                  {studentDetails.readings.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                      No readings found for this student
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
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
                          {studentDetails.readings.map((reading) => (
                            <TableRow key={reading._id}>
                              <TableCell>
                                {reading.readingTitle ||
                                  getReadingTitle(reading.reading, reading.lesson)}
                              </TableCell>
                              <TableCell>
                                {reading.lessonTitle ||
                                  (reading.lesson ? getLessonTitle(reading.lesson) : "N/A")}
                              </TableCell>
                              <TableCell>
                                {reading.categoryTitle ||
                                  (reading.category ? getCategoryTitle(reading.category) : "N/A")}
                              </TableCell>
                              <TableCell align="right">
                                {reading.completed ? (
                                  <Chip
                                    label={reading.score || 0}
                                    color={reading.score >= 4 ? "success" : reading.score >= 2 ? "warning" : "error"}
                                    size="small"
                                  />
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    -
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {reading.completed && reading.time
                                  ? formatTime(reading.time)
                                  : "-"}
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={reading.completed ? "Completed" : "In Progress"}
                                  color={reading.completed ? "success" : "warning"}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {reading.completed && reading.completedAt
                                  ? new Date(reading.completedAt).toLocaleString()
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No student details available
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Student Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Student</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Full Name"
              fullWidth
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <FormControl fullWidth required>
              <InputLabel>University</InputLabel>
              <Select
                label="University"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              >
                {universities.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateStudent} variant="contained" disabled={formLoading}>
            {formLoading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Full Name"
              fullWidth
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Password (leave empty to keep current)"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <FormControl fullWidth required>
              <InputLabel>University</InputLabel>
              <Select
                label="University"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              >
                {universities.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStudent} variant="contained" disabled={formLoading}>
            {formLoading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{studentToDelete?.fullName}</strong> (
            {studentToDelete?.email})? This action cannot be undone and will delete all
            associated reading data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteStudent} variant="contained" color="error" disabled={formLoading}>
            {formLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Students;

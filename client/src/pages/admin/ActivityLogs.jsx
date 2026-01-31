import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useError } from "../../contexts/ErrorContext";
import { getActivityLogs as fetchActivityLogs } from "../../utils/api";
import { formatDateTashkent } from "../../utils/formatDate";

const ActivityLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    action: "",
    startDate: "",
    endDate: "",
  });
  const { showError } = useError();

  const actionOptions = [
    { value: "", label: "All Actions" },
    { value: "create_student", label: "Create Student" },
    { value: "update_student", label: "Update Student" },
    { value: "delete_student", label: "Delete Student" },
    { value: "export_students", label: "Export Students" },
    { value: "export_statistics", label: "Export Statistics" },
    { value: "view_student", label: "View Student" },
    { value: "view_statistics", label: "View Statistics" },
  ];

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetchActivityLogs({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setLogs(response.data.data.logs);
      setPagination(response.data.data.pagination);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, pagination.limit, filters.action, filters.startDate, filters.endDate]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  const getActionColor = (action) => {
    switch (action) {
      case "create_student":
        return "success";
      case "update_student":
        return "info";
      case "delete_student":
        return "error";
      case "export_students":
      case "export_statistics":
        return "warning";
      default:
        return "default";
    }
  };

  const formatAction = (action) => {
    return actionOptions.find((opt) => opt.value === action)?.label || action;
  };

  if (loading && logs.length === 0) {
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
          <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
            Activity Logs
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Action</InputLabel>
                <Select
                  label="Action"
                  value={filters.action}
                  onChange={(e) => handleFilterChange("action", e.target.value)}
                >
                  {actionOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                size="small"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                size="small"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>Admin</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                  <TableCell><strong>Target</strong></TableCell>
                  <TableCell><strong>Details</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        No activity logs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log._id} hover>
                      <TableCell>
                        {formatDateTashkent(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        {log.admin?.fullName || "Unknown"} ({log.admin?.email || "N/A"})
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatAction(log.action)}
                          color={getActionColor(log.action)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {log.targetId?.fullName ? (
                          <Typography variant="body2">
                            {log.targetId.fullName} ({log.targetId.email})
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{log.details || "-"}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[25, 50, 100]}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityLogs;

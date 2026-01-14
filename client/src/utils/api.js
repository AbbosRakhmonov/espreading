import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This is important for sending cookies with requests
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the error is due to an unauthorized access (possibly expired cookie)
    if (error.response.status === 401) {
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

const checkReadingCompleted = async (readingId) => {
  return await api.get(`/api/v1/readings/${readingId}/completed`);
};

const completeReading = async (readingId, data) => {
  return await api.post(`/api/v1/readings/${readingId}/completed`, data);
};

const getStatistics = async () => {
  return await api.get("/api/v1/admin/statistics");
};

const getStudentStatistics = async () => {
  return await api.get("/api/v1/admin/students");
};

const getStudentById = async (studentId) => {
  return await api.get(`/api/v1/admin/students/${studentId}`);
};

const createStudent = async (studentData) => {
  return await api.post("/api/v1/admin/students", studentData);
};

const updateStudent = async (studentId, studentData) => {
  return await api.put(`/api/v1/admin/students/${studentId}`, studentData);
};

const deleteStudent = async (studentId) => {
  return await api.delete(`/api/v1/admin/students/${studentId}`);
};

const exportStudents = async () => {
  return await api.get("/api/v1/admin/students/export", {
    responseType: "blob",
  });
};

const exportStatistics = async () => {
  return await api.get("/api/v1/admin/statistics/export", {
    responseType: "blob",
  });
};

const getActivityLogs = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });
  return await api.get(`/api/v1/admin/activity-logs?${queryParams.toString()}`);
};

export default api;

export {
  checkReadingCompleted,
  completeReading,
  getStatistics,
  getStudentStatistics,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  exportStudents,
  exportStatistics,
  getActivityLogs,
};

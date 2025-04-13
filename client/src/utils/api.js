import axios from "axios";

const api = axios.create({
  baseURL: "/",
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

export default api;

export { checkReadingCompleted, completeReading };

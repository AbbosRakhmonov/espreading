import { Container, Card, CardContent, Typography, Button, Box, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Lessons from "./Lessons";
import { getQuestionnaireStatus } from "../utils/api";
import { useError } from "../contexts/ErrorContext";

function StudentDashboard() {
  const navigate = useNavigate();
  const { showError } = useError();
  const [questionnaireStatus, setQuestionnaireStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getQuestionnaireStatus();
        setQuestionnaireStatus(response.data.data);
      } catch (error) {
        showError(
          error?.response?.data?.message || "Failed to load questionnaire status"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [showError]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Header />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Header />
      <Lessons />
    </Container>
  );
}

export default StudentDashboard;

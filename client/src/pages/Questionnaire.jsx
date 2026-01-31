import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
    CircularProgress,
    Alert,
    Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionnaireStatus, submitQuestionnaire } from "../utils/api";
import { useError } from "../contexts/ErrorContext";
import Header from "../components/Header";
import { QUESTIONS, SCALE_LABELS } from "../utils/questionnaireQuestions";

const Questionnaire = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { showError } = useError();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);
                const response = await getQuestionnaireStatus();
                const statusData = response.data.data;
                setStatus(statusData);

                // Check if already submitted - redirect silently without error
                if (type === "pre" && statusData.pre.submitted) {
                    navigate("/student");
                    return;
                }
                if (type === "post" && statusData.post.submitted) {
                    navigate("/student");
                    return;
                }

                // Check if can take
                // Pre-questionnaire: No validation - allow access if not submitted
                // Post-questionnaire: Check if can take

                if (type === "post" && !statusData.post.canTake) {
                    showError(
                        "Post-questionnaire can only be taken after completing the last lesson with content"
                    );
                    navigate("/student");
                    return;
                }
            } catch (error) {
                showError(
                    error?.response?.data?.message || "Failed to load questionnaire status"
                );
                navigate("/student");
            } finally {
                setLoading(false);
            }
        };

        if (type && ["pre", "post"].includes(type)) {
            fetchStatus();
        } else {
            navigate("/student");
        }
    }, [type, navigate, showError]);

    const handleAnswerChange = (questionNum, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionNum]: parseInt(value),
        }));
    };

    const handleSubmit = async () => {
        // Prevent double submission
        if (submitting) {
            return;
        }

        // Validate all questions answered
        if (Object.keys(answers).length !== 30) {
            showError("Please answer all 30 questions");
            return;
        }

        for (let i = 1; i <= 30; i++) {
            if (!answers[i] || answers[i] < 1 || answers[i] > 5) {
                showError(`Please answer question ${i}`);
                return;
            }
        }

        try {
            setSubmitting(true);
            const response = await submitQuestionnaire(type, answers);
            // Check if it was already submitted (backend returns 200 with message)
            const message = response?.data?.message || "";
            if (message.includes("already submitted") || message.includes("already exists")) {
                showError(
                    `${type === "pre" ? "Pre" : "Post"
                    }-questionnaire was already submitted successfully!`,
                    "success"
                );
            } else {
                showError(
                    `${type === "pre" ? "Pre" : "Post"
                    }-questionnaire submitted successfully!`,
                    "success"
                );
            }
            // Navigate after a short delay to ensure message is seen
            setTimeout(() => {
                navigate("/student");
            }, 1500);
        } catch (error) {
            // Only show error if it's a real error (not already submitted)
            const errorMessage = error?.response?.data?.message || "Failed to submit questionnaire";
            // If it's a 200 response that got caught, treat as success
            if (error?.response?.status === 200 || errorMessage.includes("already submitted")) {
                showError(
                    `${type === "pre" ? "Pre" : "Post"
                    }-questionnaire was already submitted successfully!`,
                    "success"
                );
                setTimeout(() => {
                    navigate("/student");
                }, 1500);
            } else {
                showError(errorMessage);
                setSubmitting(false);
            }
        }
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Header />
            <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Survey of Reading Strategies
                </Typography>
                <Typography variant="h6" gutterBottom align="center" color="text.secondary">
                    {type === "pre"
                        ? "Pre-Questionnaire (Before Lesson 1)"
                        : "Post-Questionnaire (After Lesson 12)"}
                </Typography>
                <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="body2">
                        The purpose of this survey is to collect information about the
                        various strategies you use when you read school-related academic
                        materials in ENGLISH. Each statement is followed by five numbers, 1,
                        2, 3, 4, and 5. After reading each statement, select the number
                        which applies to you. Note that there are no right or wrong
                        responses to any of the items on this survey.
                    </Typography>
                </Alert>

                <Box sx={{ mt: 4 }}>
                    {QUESTIONS.map((question, index) => {
                        const questionNum = index + 1;
                        return (
                            <Card key={questionNum} sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {questionNum}. {question}
                                    </Typography>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            row
                                            value={answers[questionNum] || ""}
                                            onChange={(e) =>
                                                handleAnswerChange(questionNum, e.target.value)
                                            }
                                            sx={{ flexWrap: "wrap" }}
                                        >
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <FormControlLabel
                                                    key={value}
                                                    value={value.toString()}
                                                    control={<Radio />}
                                                    label={
                                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 120 }}>
                                                            <Typography variant="body2" fontWeight="bold">
                                                                {value}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ textAlign: "center", fontSize: "0.7rem" }}>
                                                                {SCALE_LABELS[value]}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/student")}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSubmit();
                        }}
                        disabled={submitting || Object.keys(answers).length !== 30}
                        size="large"
                        type="button"
                    >
                        {submitting ? <CircularProgress size={24} /> : "Submit"}
                    </Button>
                </Box>

                <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="body2" fontWeight="bold">
                        Important: Once you click Submit, you cannot change your answers.
                        Please review all your responses before submitting.
                    </Typography>
                </Alert>
            </Paper>
        </Container>
    );
};

export default Questionnaire;


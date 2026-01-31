import { Grid, Typography, useMediaQuery, useTheme, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LinkCard from "../components/LinkCard";
import { lessons } from "../utils/lessons";
import { getQuestionnaireStatus, checkReadingCompleted } from "../utils/api";
import { useError } from "../contexts/ErrorContext";

const Lessons = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { showError } = useError();
  const [questionnaireStatus, setQuestionnaireStatus] = useState(null);
  const [lessonsCompletion, setLessonsCompletion] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch questionnaire status
        const qResponse = await getQuestionnaireStatus();
        const statusData = qResponse.data.data;
        setQuestionnaireStatus(statusData);

        // Debug: log the questionnaire status
        console.log("Questionnaire Status Response:", statusData);
        console.log("Pre canTake:", statusData?.pre?.canTake);
        console.log("Pre submitted:", statusData?.pre?.submitted);
        console.log("Post canTake:", statusData?.post?.canTake);
        console.log("Post submitted:", statusData?.post?.submitted);

        // Check completion status for lessons with content
        const lessonsWithContent = lessons.filter(
          (lesson) =>
            lesson.categories &&
            lesson.categories.some((cat) => cat.readings && cat.readings.length > 0)
        );

        const completionStatus = {};
        // Check completion for all lessons with content
        for (const lesson of lessonsWithContent) {
          for (const category of lesson.categories) {
            if (category.readings && category.readings.length > 0) {
              for (const reading of category.readings) {
                try {
                  const response = await checkReadingCompleted(reading.id);
                  if (response.data.completed) {
                    completionStatus[lesson.id] = true;
                    break;
                  }
                } catch {
                  // Ignore errors for individual readings
                }
              }
            }
          }
        }
        setLessonsCompletion(completionStatus);
      } catch (error) {
        console.error("Error fetching questionnaire status:", error);
        showError(
          error?.response?.data?.message || "Failed to load lesson data"
        );
        // If error, set status to null so lessons are disabled by default
        setQuestionnaireStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  // Check if pre-questionnaire is available
  // Simple logic: If not submitted, it's always available (regardless of canTake status)
  const preQuestionnaireSubmitted = questionnaireStatus?.pre?.submitted || false;

  // Pre-questionnaire is available if it's NOT submitted
  // This ensures students can always access it if they haven't submitted it
  const preQuestionnaireAvailable = !preQuestionnaireSubmitted;

  // Debug logging
  console.log("Questionnaire Status Debug:", {
    questionnaireStatus,
    preQuestionnaireSubmitted,
    preQuestionnaireAvailable,
    loading
  });

  // Lessons should be disabled if pre-questionnaire is available and not submitted
  // Also disable while loading to prevent premature access
  // If status is null (not loaded), assume pre-questionnaire is available to disable lessons
  const shouldDisableLessons = loading ? true : (questionnaireStatus === null ? true : preQuestionnaireAvailable);

  // Find the last lesson with content dynamically
  const lessonsWithContent = lessons.filter(
    (lesson) =>
      lesson.categories &&
      lesson.categories.some((cat) => cat.readings && cat.readings.length > 0)
  );
  const lastLessonWithContent = lessonsWithContent.length > 0
    ? lessonsWithContent[lessonsWithContent.length - 1]
    : null;
  const lastLessonId = lastLessonWithContent ? lastLessonWithContent.id : null;

  // Check if the last lesson with content is completed
  const lastLessonCompleted = lastLessonId ? lessonsCompletion[lastLessonId] === true : false;

  // Check if post-questionnaire is available (can take and not submitted)
  // Default to false if status hasn't loaded yet (will be enabled when eligible)
  const postQuestionnaireCanTake = questionnaireStatus?.post?.canTake || false;
  const postQuestionnaireSubmitted = questionnaireStatus?.post?.submitted || false;
  const postQuestionnaireAvailable = postQuestionnaireCanTake && !postQuestionnaireSubmitted;

  // Pre-questionnaire card data - always show, but disable if not available
  const preQuestionnaireCard = {
    id: "pre-questionnaire",
    title: "Pre-Questionnaire",
    subtitle: preQuestionnaireSubmitted
      ? "Reading Strategies Survey (Completed)"
      : "Reading Strategies Survey (Before Starting)",
    image: "/images/cards/default.avif",
    href: "/questionnaire/pre",
    disabled: !preQuestionnaireAvailable,
  };

  // Find Lesson 12
  const lesson12 = lessons.find((lesson) => lesson.id === 12);

  // Check if Lesson 12 is completed
  const lesson12Completed = lessonsCompletion[12] === true;

  // Post-questionnaire card data - always show, but disable if not available
  const postQuestionnaireCard = {
    id: "post-questionnaire",
    title: "Post-Questionnaire",
    subtitle: postQuestionnaireSubmitted
      ? "Reading Strategies Survey (Completed)"
      : lesson12
        ? `Reading Strategies Survey (After ${lesson12.title})`
        : "Reading Strategies Survey (After Completion)",
    image: "/images/cards/default.avif",
    href: "/questionnaire/post",
    disabled: !postQuestionnaireAvailable,
  };

  // Combine cards: pre-questionnaire, lessons, post-questionnaire
  const allCards = [];

  // Always add pre-questionnaire before Lesson 1 (disabled if not available)
  allCards.push(preQuestionnaireCard);

  // Add all lessons, inserting post-questionnaire after Lesson 12
  lessons.forEach((lesson) => {
    allCards.push({
      id: lesson.id,
      title: lesson.title,
      subtitle: lesson.subtitle,
      image: lesson.image,
      href: `/lesson/${lesson.id}`,
      disabled: shouldDisableLessons, // Disable if pre-questionnaire is available and not submitted
    });

    // Insert post-questionnaire right after Lesson 12
    // Always show it, but it will be disabled if not available
    if (lesson.id === 12) {
      allCards.push(postQuestionnaireCard);
    }
  });

  if (loading) {
    return (
      <Box>
        <Typography variant={isMobile ? "h6" : "h5"} component="h2" gutterBottom sx={{ mb: 2 }}>
          Available Lessons
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        component="h2"
        gutterBottom
        sx={{
          mb: 2,
        }}
      >
        Available Lessons
      </Typography>
      {preQuestionnaireAvailable && !preQuestionnaireSubmitted && (
        <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
          ⚠️ Please complete the Pre-Questionnaire before starting any lessons.
        </Typography>
      )}
      <Grid container spacing={3}>
        {allCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <LinkCard
              text={card.subtitle}
              title={card.title}
              href={card.href}
              image={card.image}
              disabled={card.disabled}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Lessons;

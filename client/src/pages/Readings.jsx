import { Container, Grid, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import LinkCard from "../components/LinkCard";
import { useError } from "../contexts/ErrorContext";
import { checkReadingCompleted } from "../utils/api";
import { categoris } from "../utils/generateCategories";
import { lessons } from "../utils/lessons";
import { Link as RouterLink } from "react-router-dom";

const Readings = () => {
  const [loading, setLoading] = useState(true);
  const [updatedReadings, setUpdatedReadings] = useState([]);
  const { id, categoryId } = useParams();
  const lesson = lessons.find((l) => l.id == id);
  const { showError } = useError();

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const category = lesson.categories.find((c) => c.id == categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  let readings = category?.readings || [];

  useEffect(() => {
    const fetchReadings = async () => {
      const readingsWithCompletionStatus = await Promise.all(
        readings.map(async (reading) => {
          try {
            const response = await checkReadingCompleted(reading.id);
            return { ...reading, ...response.data };
          } catch {
            showError(
              `Failed to check completion status for reading: ${reading.title}`
            );
            return { ...reading, completed: false };
          }
        })
      );

      setUpdatedReadings(readingsWithCompletionStatus);
    };

    fetchReadings().finally(() => setLoading(false));
  }, [readings, showError]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Header />
      <Typography variant="h6" component="h1" mb={2}>
        <Link component={RouterLink} to={`/`}>
          Available Lessons
        </Link>{" "}
        /{" "}
        <Link component={RouterLink} to={`/lesson/${id}`}>
          Lesson {id}
        </Link>{" "}
        /{" "}
        <Typography component="span">
          {categoris[categoryId - 1]["title"]}
        </Typography>
      </Typography>
      {loading ? (
        <Typography variant="body1" align="center" paragraph>
          Loading readings...
        </Typography>
      ) : !readings.length ? (
        <Typography variant="body1" align="center" paragraph>
          No readings found for this category.
        </Typography>
      ) : null}
      <Grid container spacing={3}>
        {updatedReadings.map((reading) => (
          <Grid item xs={12} sm={6} md={4} key={reading.id}>
            <LinkCard
              text={`${reading.questions} questions`}
              title={reading.title}
              href={`reading/${reading.id}`}
              completed={reading.completed}
              score={reading.score}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Readings;

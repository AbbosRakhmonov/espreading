import { Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import LinkCard from "../components/LinkCard";
import { checkReadingCompleted } from "../utils/api";
import { categoris } from "../utils/generateCategories";
import { lessons } from "../utils/lessons";

const Readings = () => {
  const [updatedReadings, setUpdatedReadings] = useState([]);
  const { id, categoryId } = useParams();
  const lesson = lessons.find((l) => l.id == id);

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
          } catch (error) {
            showError(
              `Failed to check completion status for reading: ${reading.title}`
            );
            return { ...reading, completed: false };
          }
        })
      );

      setUpdatedReadings(readingsWithCompletionStatus);
    };

    fetchReadings();
  }, [readings]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Header />
      <Typography variant="h6" component="h1" mb={2}>
        Lesson {id} /{" "}
        <Typography component="span" color="primary">
          {categoris[categoryId - 1]["title"]}
        </Typography>
      </Typography>
      {updatedReadings.length === 0 && (
        <Typography variant="body1" align="center" paragraph>
          Loading readings...
        </Typography>
      )}
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

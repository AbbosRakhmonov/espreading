import { Box, Container, Link, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import FolderCard from "../components/FolderCard";
import Header from "../components/Header";
import { lessons } from "../utils/lessons";
import { Link as RouterLink } from "react-router-dom";

const Categories = () => {
  const { id } = useParams();
  const lesson = lessons.find((l) => l.id == id);
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Header />
      <Typography variant="h6" component="h1" mb={2}>
        <Link component={RouterLink} to={`/`}>
          Available Lessons
        </Link>{" "}
        / Lesson {id}
      </Typography>
      <Box
        sx={{
          display: "grid",
          flexWrap: "wrap",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: "2rem",
        }}
      >
        {lesson?.categories.map((category) => (
          <FolderCard
            key={category.id}
            title={category.title}
            to={`category/${category.id}`}
            subtitle={category.subtitle}
            materials={category.materials}
          />
        ))}
      </Box>
    </Container>
  );
};

export default Categories;

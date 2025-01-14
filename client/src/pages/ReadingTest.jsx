import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { lessons } from "../utils/lessons";

const ReadingTest = () => {
  const { id, categoryId, readingId } = useParams();

  const lesson = lessons.find((l) => l.id == id);

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const category = lesson.categories.find((c) => c.id == categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  const reading = category.readings.find((r) => r.id == readingId);

  if (!reading) {
    return <div>Reading not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>{<reading.reading />}</Suspense>
  );
};

export default ReadingTest;

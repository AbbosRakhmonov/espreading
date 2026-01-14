import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError } from "../contexts/ErrorContext";
import { checkReadingCompleted } from "../utils/api";
import { lessons } from "../utils/lessons";

const ReadingTest = () => {
  const [loading, setLoading] = useState(true);
  const { showError } = useError();
  const [data, setData] = useState({
    completed: false,
    score: 0,
    answers: {},
  });
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

  useEffect(() => {
    if (reading) {
      const fetchReadings = async () => {
        try {
          setLoading(true);
          const { data } = await checkReadingCompleted(reading.id);
          if (data.completed) {
            setData(data);
          } else {
            setData({
              completed: false,
              score: 0,
              answers: {},
            });
          }
        } catch (error) {
          showError(
            `Failed to check completion status for reading: ${reading.title}`
          );
        } finally {
          setLoading(false);
        }
      };

      fetchReadings();
      document.title = reading.title;
    }
  }, [reading]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {!loading && (
        <reading.reading
          completed={data.completed}
          score={data.score}
          answers={data.answers}
          time={data.time || 0}
        />
      )}
    </Suspense>
  );
};

export default ReadingTest;

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { useParams } from "react-router-dom";
import CorrectAnswer from "../../../../components/CorrectAnswer";
import IncorrectAnswer from "../../../../components/IncorrectAnswer";
import { useError } from "../../../../contexts/ErrorContext";
import { completeReading } from "../../../../utils/api";
import { formatTime } from "../../../../utils/formatTime";

const answer = {
  0: 2,
  1: 3,
  2: 5,
  3: 6,
  4: 7,
  5: 1,
  6: 4,
};

const DialogueCard = ({
  id,
  content,
  index,
  moveCard,
  disabled,
  isCorrect,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !disabled,
  });

  const [, drop] = useDrop({
    accept: "card",
    hover(item, monitor) {
      if (!ref.current || disabled) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  if (!disabled) {
    drag(drop(ref));
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Card
        ref={ref}
        sx={{
          opacity: isDragging ? 0.4 : 1,
          cursor: disabled ? "default" : "move",
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: disabled ? "none" : 3,
          },
          flexGrow: 1,
        }}
      >
        <CardContent>
          <Typography dangerouslySetInnerHTML={{ __html: content }} />
        </CardContent>
      </Card>
      {disabled && isCorrect && <CorrectAnswer />}
      {disabled && !isCorrect && <IncorrectAnswer />}
    </Box>
  );
};

export default function Sequencing({
  score = 0,
  time = 0,
  completed = false,
  answers = {},
}) {
  const { showError } = useError();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(time);
  const [dialogues, setDialogues] = useState([
    {
      id: "1",
      content:
        "<b>Client:</b> So, you're saying it's okay that I couldn't control everything?",
    },
    {
      id: "2",
      content:
        "<b>Psychologist:</b> It sounds like you're feeling guilty and trying to make sense of what happened. Can you tell me more about what's on your mind?",
    },
    {
      id: "3",
      content:
        "<b>Client:</b> I just feel like if I had done things differently, none of this would've happened. Maybe I can still fix it somehow?",
    },
    {
      id: "4",
      content:
        "<b>Psychologist:</b> Exactly. Accepting that can be hard, but it's also freeing. Let's focus on what you need right now to heal and move forward.",
    },
    {
      id: "5",
      content:
        "<b>Psychologist:</b> That's a common thought in situations like this. But remember, not everything was in your control. Blaming yourself won't change the past, and it's important to focus on what's within your power now.",
    },
    {
      id: "6",
      content:
        "<b>Client:</b> But I keep thinking, what if I had tried harder? What if I made better choices?",
    },
    {
      id: "7",
      content:
        '<b>Psychologist:</b> Those "what if" questions show how much you care. But they can also hold you back. You did the best you could with what you knew at the time.',
    },
  ]);
  const { readingId } = useParams();

  useEffect(() => {
    if (completed) {
      const sortedDialogues = [...dialogues].sort(
        (a, b) =>
          Object.values(answers).indexOf(a.id) -
          Object.values(answers).indexOf(b.id)
      );
      setDialogues(sortedDialogues);
    }
  }, [completed, answers]);

  useEffect(() => {
    if (completed) return;
    const timer = setInterval(
      () => setTimeLeft((prevTime) => prevTime + 1),
      1000
    );
    return () => clearInterval(timer);
  }, [completed]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setDialogues((prevCards) => {
      const newCards = [...prevCards];
      const [removed] = newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, removed);
      return newCards;
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(event.target);
      formData.append("time", timeLeft);
      const answers = dialogues.reduce((acc, dialogue, index) => {
        acc[index] = dialogue.id;
        return acc;
      }, {});
      formData.append("answers", JSON.stringify(answers));
      await completeReading(readingId, formData);
      window.location.reload();
    } catch (error) {
      showError(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Conversation – Bargaining Stage
        </Typography>
        <Typography variant="h5">Time: {formatTime(timeLeft)}</Typography>
      </Box>
      <Typography variant="body1" paragraph>
        Read the conversation below. The sentences are out of order. Drag and
        drop them to create a logical and meaningful dialogue between the
        psychologist and the client.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Hint:</strong> Start with the psychologist initiating speech,
        then follow the logical flow of questions and responses.
      </Typography>
      <Typography variant="body1" paragraph>
        Total possible score: <strong>7 points</strong> (1 point per correct
        position).
      </Typography>
      <form onSubmit={handleSubmit}>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <Box sx={{ mb: 4 }}>
            {dialogues.map((dialogue, index) => (
              <DialogueCard
                key={dialogue.id}
                id={dialogue.id}
                content={dialogue.content}
                index={index}
                moveCard={moveCard}
                disabled={completed}
                isCorrect={answers[index] == answer[index]}
              />
            ))}
          </Box>
        </DndProvider>
        <Box
          sx={{
            textAlign: "center",
            mt: 4,
          }}
        >
          {completed && (
            <Typography
              variant="h6"
              component="h2"
              align="center"
              sx={{ mb: 2 }}
              color="success.main"
              gutterBottom
            >
              Score: {score} / 7
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || completed}
          >
            {loading ? "Submitting..." : "Submit Answers"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}

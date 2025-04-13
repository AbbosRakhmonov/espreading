import {
  Container,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BackButton from "../../../../components/BackButton";
import ReadingTitle from "../../../../components/ReadingTitle";
import TrueFalse from "../../../../components/TrueFalse";
import CorrectAnswer from "../../../../components/CorrectAnswer";
import IncorrectAnswer from "../../../../components/IncorrectAnswer";
import CustomSelect from "../../../../components/CustomSelect";
import CompleteButton from "../../../../components/CompleteButton";
import { useTime } from "../../../../hooks/useTime";
import { useParams } from "react-router-dom";
import { useError } from "../../../../contexts/ErrorContext";
import { useCallback, useState } from "react";
import { completeReading } from "../../../../utils/api";

const selectOptions = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
];

const headings = [
  { id: "1", title: "The Impact of Stress on Children", correctValue: "B" },
  {
    id: "2",
    title: "How Parents Can Create a Supportive Environment",
    correctValue: "A",
  },
  {
    id: "3",
    title: "The Importance of Routine in Stress Management",
    correctValue: "C",
  },
  { id: "4", title: "Teaching Healthy Coping Strategies", correctValue: "D" },
  {
    id: "5",
    title: "Recognizing Signs of Stress in Children",
    correctValue: "E",
  },
];

const answer = {
  "q1-1": "false",
  "q1-2": "true",
  "q1-3": "false",
  "q1-4": "true",
  "q1-5": "false",
  "q1-6": "true",
  "q1-7": "false",
  "q1-8": "true",
  "q1-9": "false",
  "q1-10": "true",
  "q2-1": "B",
  "q2-2": "A",
  "q2-3": "C",
  "q2-4": "D",
  "q2-5": "E",
};

const ChildhoodStress = ({
  completed = false,
  score = 0,
  answers = {},
  time = 0,
}) => {
  const { timeLeft } = useTime({ completed, time });
  const [loading, setLoading] = useState(false);
  const { readingId } = useParams();
  const { showError } = useError();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const formData = new FormData(e.target);
        formData.append("time", timeLeft);
        const data = Object.fromEntries(formData.entries());
        await completeReading(readingId, data);
        window.location.reload();
      } catch (error) {
        showError(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    },
    [readingId, showError, timeLeft]
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <BackButton />
      <ReadingTitle
        title="Childhood Stress: How Parents Can Help"
        timeLeft={timeLeft}
      />
      <Grid2 container spacing={2}>
        <Grid2
          size={{
            md: 12,
            lg: 6,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              A
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Parents play an essential role in helping their children manage
              stress by creating a supportive environment where they feel safe
              to express their emotions. A positive and nurturing home
              environment can help reduce stress levels and encourage children
              to communicate their feelings.
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              B
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Children, just like adults, experience stress in different ways.
              While some stress can help them develop resilience, too much
              stress can lead to negative effects on their mental and emotional
              well-being.
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              C
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              One way to reduce stress is by maintaining a stable routine, which
              gives children a sense of security. When children know what to
              expect daily, they feel more in control and less anxious about
              sudden changes or uncertainties.
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              D
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Parents can also teach their children healthy coping strategies,
              such as deep breathing, exercise, and creative activities, to help
              them cope with stress. Encouraging problem-solving and emotional
              expression can also help children develop long-term resilience.
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              E
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              If a child feels overwhelmed by school, friendships, or other
              pressures, they may show signs of anxiety, mood swings, or
              withdrawal. Recognizing these signs early and using effective
              intervention techniques can help children develop a healthy
              response to stress.
            </Typography>
          </Paper>
        </Grid2>
        <Grid2
          size={{
            md: 12,
            lg: 6,
          }}
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            style={{
              position: "sticky",
              top: 0,
              overflow: "auto",
              maxHeight: "100vh",
            }}
          >
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pre-Reading Activities
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Discussion Questions</b>. Before reading the text, consider
                the following questions to activate your background knowledge:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="What do you think causes stress in children?"
                    slotProps={{ primary: { variant: "body1" } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="How do you think parents can help?"
                    slotProps={{ primary: { variant: "body1" } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="What are some common stressors in childhood?"
                    slotProps={{ primary: { variant: "body1" } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="How do children usually react to stress?"
                    slotProps={{ primary: { variant: "body1" } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="What strategies do you think parents can use to help their children cope with stress?"
                    slotProps={{ primary: { variant: "body1" } }}
                  />
                </ListItem>
              </List>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                1. Match the Headings
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="heading matching table">
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          fontSize: isMobile ? "0.8rem" : "1rem",
                          fontWeight: "bold",
                          background: "#f8f8f8",
                        },
                      }}
                    >
                      <TableCell sx={{ width: "70%" }}>Heading</TableCell>
                      <TableCell>Paragraph</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {headings.map((heading) => (
                      <TableRow key={`heading-${heading.id}`}>
                        <TableCell component="th" scope="row">
                          {heading.title}
                        </TableCell>
                        <TableCell
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <CustomSelect
                            name={`q2-${heading.id}`}
                            disabled={loading || completed}
                            key={heading.id}
                            value={completed ? answers[`q2-${heading.id}`] : ""}
                            error={
                              completed &&
                              answers[`q2-${heading.id}`] !=
                                answer[`q2-${heading.id}`]
                            }
                            options={selectOptions}
                            label="Please select a paragraph"
                          />
                          {completed &&
                            (answers[`q2-${heading.id}`] ===
                            answer[`q2-${heading.id}`] ? (
                              <CorrectAnswer />
                            ) : (
                              <IncorrectAnswer />
                            ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                2. Check the Truth of the Following Statements
              </Typography>
              <TrueFalse
                name="q1-1"
                completed={completed}
                answer={completed ? answers["q1-1"] : ""}
                correctAnswer="false"
              >
                1. Stress is always harmful to children.
              </TrueFalse>
              <TrueFalse
                name="q1-2"
                completed={completed}
                answer={completed ? answers["q1-2"] : ""}
                correctAnswer="true"
              >
                2. A stable routine can help children feel more secure and
                reduce stress.
              </TrueFalse>
              <TrueFalse
                name="q1-3"
                completed={completed}
                answer={completed ? answers["q1-3"] : ""}
                correctAnswer="false"
              >
                3. Parents should avoid talking about stress with their children
                so they don’t worry more.
              </TrueFalse>
              <TrueFalse
                name="q1-4"
                completed={completed}
                answer={completed ? answers["q1-4"] : ""}
                correctAnswer="true"
              >
                4. Teaching children coping strategies, such as deep breathing
                and exercise, can help them manage stress.
              </TrueFalse>
              <TrueFalse
                name="q1-5"
                completed={completed}
                answer={completed ? answers["q1-5"] : ""}
                correctAnswer="false"
              >
                5. Children never show physical signs of stress.
              </TrueFalse>
              <TrueFalse
                name="q1-6"
                completed={completed}
                answer={completed ? answers["q1-6"] : ""}
                correctAnswer="true"
              >
                6. A supportive home environment can make it easier for children
                to express their emotions.
              </TrueFalse>
              <TrueFalse
                name="q1-7"
                completed={completed}
                answer={completed ? answers["q1-7"] : ""}
                correctAnswer="false"
              >
                7. Ignoring a child’s stress will help them become stronger and
                more independent.
              </TrueFalse>
              <TrueFalse
                name="q1-8"
                completed={completed}
                answer={completed ? answers["q1-8"] : ""}
                correctAnswer="true"
              >
                8. Mood swings, withdrawal, and anxiety can be signs of
                childhood stress.
              </TrueFalse>
              <TrueFalse
                name="q1-9"
                completed={completed}
                answer={completed ? answers["q1-9"] : ""}
                correctAnswer="false"
              >
                9. Parents should solve all their children's problems to keep
                them stress-free.
              </TrueFalse>
              <TrueFalse
                name="q1-10"
                completed={completed}
                answer={completed ? answers["q1-10"] : ""}
                correctAnswer="true"
              >
                10. Recognizing signs of stress early can help children develop
                a healthier response to challenges.
              </TrueFalse>
            </Paper>
            <CompleteButton
              completed={completed}
              loading={loading}
              score={score}
              total={15}
            />
          </form>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default ChildhoodStress;

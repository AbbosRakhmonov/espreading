import {
  Box,
  Container,
  FormControl,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BackButton from "../../../../components/BackButton";
import ReadingTitle from "../../../../components/ReadingTitle";
import { useTime } from "../../../../hooks/useTime";
import { useParams } from "react-router-dom";
import { useError } from "../../../../contexts/ErrorContext";
import { useCallback, useState } from "react";
import { completeReading } from "../../../../utils/api";
import TrueFalse from "../../../../components/TrueFalse";
import CorrectAnswer from "../../../../components/CorrectAnswer";
import CompleteButton from "../../../../components/CompleteButton";
import IncorrectAnswer from "../../../../components/IncorrectAnswer";
import CustomSelect from "../../../../components/CustomSelect";

const selectOptions = [
  {
    value: 4,
    label:
      "The act of imagining a successful outcome to improve performance or reduce anxiety.",
  },
  {
    value: 1,
    label: "The act of tracking one’s own progress or behaviour.",
  },
  {
    value: 3,
    label: "Replacing one behaviour with another, typically a healthier one.",
  },
  {
    value: 5,
    label: "A technique used to encourage good behaviour by offering rewards.",
  },
  {
    value: 2,
    label:
      "Motivation that comes from within, such as personal satisfaction or enjoyment.",
  },
];

const selects = [
  {
    word: "Positive Reinforcement",
  },
  {
    word: "Self-monitoring",
  },
  {
    word: "Intrinsic Motivation",
  },
  {
    word: "Visualization",
  },
  {
    word: "Behaviour Substitution",
  },
];

const answer = {
  "q1-1": "1",
  "q1-2": "2",
  "q1-3": "3",
  "q1-4": "4",
  "q1-5": "5",
};

const First = ({ completed = false, score = 0, answers = {}, time = 0 }) => {
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
        title="Behaviour Analysis in Health, Sport and Fitness"
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
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Behaviour analysis is a psychological approach that studies how
              people develop habits, respond to their environment, and change
              their actions. In health, sport, and fitness, behaviour analysis
              helps professionals understand motivation, improve performance,
              and support long-term well-being.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Health-related behaviours have a strong impact on physical and
              mental well-being. Some behaviours, like regular exercise and a
              balanced diet, improve health, while others, like smoking and
              excessive alcohol consumption, can be harmful. Behavioural
              psychologists use different techniques to help people adopt
              healthier habits.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              One effective method is <b>positive reinforcement</b>, which
              encourages good behaviour by offering rewards. For example, a
              doctor might praise a patient for maintaining a healthy diet, or a
              smoking cessation program might offer small rewards for every week
              without cigarettes. Another technique is{" "}
              <b>behaviour substitution</b>, where people replace unhealthy
              habits with better ones, such as drinking water instead of soda.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              In mental health, behaviour analysis is also important. Therapists
              use techniques like <b>cognitive-behavioural therapy (CBT)</b> to
              help patients change negative thought patterns and develop
              healthier coping mechanisms for stress and anxiety.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Psychology plays a key role in sports performance. Athletes do not
              only need physical strength and skill but also mental discipline.
              Coaches and sports psychologists use behaviour analysis to help
              athletes stay focused, confident, and motivated.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              A common strategy is <b>goal setting</b>, which helps athletes
              break down large goals into smaller, achievable steps. For
              example, a runner preparing for a marathon might start with
              shorter distances and gradually increase them. Another effective
              method is <b>self-monitoring</b>, where athletes track their
              progress and adjust their training based on results.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Additionally, <b>visualization</b> is a powerful psychological
              tool in sports. Athletes imagine themselves successfully
              completing a task, such as scoring a goal or lifting a heavy
              weight, to improve their performance and reduce anxiety.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Many people struggle to maintain a fitness routine. They may start
              with enthusiasm but lose motivation over time. Behaviour analysis
              helps fitness trainers and psychologists find solutions to keep
              people engaged in regular exercise.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              One useful strategy is <b>habit stacking</b>, which involves
              linking a new habit to an existing one. For example, someone who
              wants to do daily push-ups can link this habit to brushing their
              teeth. Another method is <b>social reinforcement</b>, where
              exercising with friends or joining a group class increases
              motivation and accountability.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Behavioural psychologists also emphasize the importance of{" "}
              <b>intrinsic motivation</b>—exercising because it feels good and
              brings personal satisfaction rather than just focusing on external
              rewards like weight loss or muscle gain. Making exercise
              enjoyable, such as choosing a fun sport or listening to music
              while working out, helps maintain long-term commitment.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Behaviour analysis provides valuable insights into how people
              develop habits and stay motivated in health, sport, and fitness.
              By understanding what drives human behaviour, psychologists,
              coaches, and healthcare professionals can design better strategies
              to help individuals achieve their goals, improve their well-being,
              and maintain a healthy lifestyle.
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
                <b>Vocabulary Activation</b>. Before reading the text, introduce
                key vocabulary words related to the topic. This will help
                students understand the terminology and build confidence as they
                read.
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                1. Match the following words to their definitions.
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
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
                      <TableCell
                        sx={{
                          width: "30%",
                        }}
                        component={"th"}
                        scope="row"
                      >
                        Word
                      </TableCell>
                      <TableCell>Definition</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selects.map((select, index) => (
                      <TableRow key={`select-${index}`}>
                        <TableCell component="th" scope="row">
                          {select.word}
                        </TableCell>
                        <TableCell sx={{ display: "flex" }}>
                          <CustomSelect
                            name={`q1-${index + 1}`}
                            disabled={loading || completed}
                            key={select.word}
                            value={completed ? answers[`q1-${index + 1}`] : ""}
                            error={
                              completed &&
                              answers[`q1-${index + 1}`] !=
                                answer[`q1-${index + 1}`]
                            }
                            options={selectOptions}
                            label="Please select a definition"
                          />
                          {completed &&
                            (answers[`q1-${index + 1}`] ===
                            answer[`q1-${index + 1}`] ? (
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
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                1. Check the truth of the following statements.
              </Typography>
              <TrueFalse
                name="q2-1"
                completed={completed}
                answer={completed ? answers["q2-1"] : ""}
                correctAnswer={"false"}
              >
                1. Behaviour analysis focuses on changing people’s thoughts
                only.
              </TrueFalse>
              <TrueFalse
                name="q2-2"
                completed={completed}
                answer={completed ? answers["q2-2"] : ""}
                correctAnswer={"true"}
              >
                2. Self-monitoring helps athletes track their progress.
              </TrueFalse>
              <TrueFalse
                name="q2-3"
                completed={completed}
                answer={completed ? answers["q2-3"] : ""}
                correctAnswer={"false"}
              >
                3. Positive reinforcement can be used to encourage unhealthy
                habits.
              </TrueFalse>
              <TrueFalse
                name="q2-4"
                completed={completed}
                answer={completed ? answers["q2-4"] : ""}
                correctAnswer={"false"}
              >
                4. Intrinsic motivation comes from external rewards, like money
                or prizes.
              </TrueFalse>
              <TrueFalse
                name="q2-5"
                completed={completed}
                answer={completed ? answers["q2-5"] : ""}
                correctAnswer={"true"}
              >
                5. Habit stacking involves linking new behaviours to existing
                ones.
              </TrueFalse>
            </Paper>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Discussion-Based Task: Connecting Theory to Real Life
              </Typography>
              <Typography variant="h6" gutterBottom>
                Answer the following questions.
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                After reading the article, what would you say to the following
                individuals as a future psychologist?
              </Typography>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                1. Which behaviour analysis techniques could be used to help
                someone stop smoking?
              </Typography>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                2. How could a coach use self-monitoring with an athlete
                preparing for a competition?
              </Typography>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                3. How can behaviour analysis be used to improve consistency in
                a fitness routine?
              </Typography>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                4. What are the benefits of intrinsic motivation compared to
                relying on external rewards?
              </Typography>
            </Paper>
            <CompleteButton
              completed={completed}
              loading={loading}
              score={score}
              total={10}
            />
          </form>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default First;

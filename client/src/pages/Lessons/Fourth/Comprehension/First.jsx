import {
  Container,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BackButton from "../../../../components/BackButton";
import ReadingTitle from "../../../../components/ReadingTitle";
import TrueFalse from "../../../../components/TrueFalse";
import CorrectAnswer from "../../../../components/CorrectAnswer";
import IncorrectAnswer from "../../../../components/IncorrectAnswer";
import CompleteButton from "../../../../components/CompleteButton";
import CustomSelect from "../../../../components/CustomSelect";
import { useTime } from "../../../../hooks/useTime";
import { useParams } from "react-router-dom";
import { useError } from "../../../../contexts/ErrorContext";
import { useCallback, useState } from "react";
import { completeReading } from "../../../../utils/api";
import { shuffle } from "lodash";

const selectOptions = shuffle([
  {
    value: 1,
    label: "Releases endorphins, boosts mood, improves sleep.",
  },
  {
    value: 2,
    label: "Calms the mind, reduces stress.",
  },
  {
    value: 3,
    label: "Helps the body recover, improves energy levels.",
  },
  {
    value: 4,
    label: "Reduces stress by staying organized.",
  },
  {
    value: 5,
    label: "Provides energy, supports the body’s stress response.",
  },
]);

const strategies = [
  { word: "Exercise Regularly" },
  { word: "Relaxation Techniques" },
  { word: "Prioritize Sleep" },
  { word: "Manage Time Effectively" },
  { word: "Eat a Balanced Diet" },
];

const answer = {
  "q1-1": "true",
  "q1-2": "false",
  "q1-3": "false",
  "q1-4": "true",
  "q1-5": "false",
  "q2-1": "1",
  "q2-2": "2",
  "q2-3": "3",
  "q2-4": "4",
  "q2-5": "5",
};

const StressEnergy = ({
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
        title="Decrease Stress, Improve Your Energy"
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
              Stress is a natural part of life, but when it becomes too much, it
              can have a significant impact on our mental and physical health.
              The good news is that there are simple and effective ways to
              decrease stress and boost energy levels. Understanding the
              connection between stress and energy can help you take steps to
              improve both.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Stress occurs when we feel overwhelmed by the demands placed on
              us, whether at work, school, or in our personal lives. When we
              face a stressful situation, our body responds by releasing
              hormones like adrenaline and cortisol. These hormones prepare us
              to fight or flee, which can be useful in some situations. However,
              when stress is constant or chronic, it can lead to physical
              problems such as headaches, muscle tension, digestive issues, and
              even sleep disturbances.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Stress and energy are closely linked. While short bursts of stress
              can make you feel more alert and focused, long-term stress can
              drain your energy. When you are stressed, your body is constantly
              in a state of “fight or flight,” which uses up a lot of your
              physical resources. Over time, this can leave you feeling tired,
              exhausted, and unable to concentrate. In addition, stress can
              interfere with sleep, further reducing your energy levels the next
              day.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Fortunately, there are many ways to manage and reduce stress. One
              effective strategy is <b>exercise regularly</b>. Physical activity
              releases endorphins, which are natural mood boosters. Regular
              exercise also improves sleep quality, which is essential for
              maintaining high energy levels. Whether it’s going for a walk,
              doing yoga, or hitting the gym, regular physical activity helps
              reduce stress and increases overall energy.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Another method is <b>practicing relaxation techniques</b>.
              Techniques such as deep breathing, meditation, and progressive
              muscle relaxation can help calm your mind and reduce stress
              levels. These practices help you focus on the present moment and
              prevent you from getting caught up in anxious thoughts. Even
              spending just 10 minutes a day on relaxation can make a big
              difference in how you feel.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>Prioritizing sleep</b> is crucial for both stress management
              and maintaining energy. When we don’t get enough sleep, our bodies
              are unable to recover from the stresses of the day. Aim for 7-9
              hours of sleep each night, and establish a bedtime routine to help
              you relax before sleep. Avoid using electronic devices before bed,
              as the blue light from screens can interfere with your ability to
              fall asleep.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>Managing time effectively</b> is another key strategy. Poor
              time management is one of the main causes of stress. When we feel
              overwhelmed by deadlines or too many tasks, stress levels
              increase. Try using time-management tools, like planners or apps,
              to organize your day. Break large tasks into smaller, more
              manageable steps, and remember to take breaks throughout the day.
              By staying organized and pacing yourself, you can reduce stress
              and maintain your energy levels.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Finally, <b>eating a balanced diet</b> can have a big impact on
              how you feel. A healthy, balanced diet helps regulate your energy
              levels and supports your body’s ability to manage stress. Eating a
              variety of fruits, vegetables, whole grains, and proteins will
              give you the nutrients needed to feel energized throughout the
              day. Avoid excessive caffeine or sugary snacks, as they can lead
              to energy crashes that make you feel more stressed.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Once you’ve taken steps to manage stress, you may notice a
              significant increase in your energy levels. Specific actions like
              <b>staying hydrated</b> can help; dehydration can make you feel
              tired and sluggish. Make sure to drink plenty of water throughout
              the day, especially if you’re physically active or working in hot
              environments. Keeping your body hydrated helps you stay alert and
              focused.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              <b>Taking breaks</b> is also important. If you’re working or
              studying for long periods, take short breaks every 30-60 minutes.
              Stand up, stretch, or take a walk outside to refresh your mind and
              body. These small breaks can help restore your energy and prevent
              burnout.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Lastly, <b>staying positive</b> can do wonders for your energy
              levels. Stress can make us feel negative or helpless, but
              practicing gratitude and focusing on positive aspects of your life
              can increase your energy and motivation. Try keeping a gratitude
              journal, where you write down things you’re thankful for each day.
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Managing stress and improving your energy levels are closely
              related. By using these strategies—regular exercise, relaxation
              techniques, prioritizing sleep, managing time effectively, and
              eating a balanced diet—you can reduce stress and feel more
              energized throughout the day. By making small changes in your
              routine, you can enjoy more energy and less stress, helping you
              live your life to the fullest.
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
                <b>Vocabulary Activation</b>. Before reading the text, review
                the key vocabulary words related to the topic. This will help
                you understand the terminology and build confidence as you read.
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table aria-label="vocabulary table">
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
                      <TableCell>Word</TableCell>
                      <TableCell>Definition</TableCell>
                      <TableCell>Example Sentence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        word: "Stress",
                        definition: "A physical and mental response to demands",
                        example: "Stress can lead to sleep problems.",
                      },
                      {
                        word: "Endorphins",
                        definition:
                          "Chemicals in the brain that make us feel good",
                        example:
                          "Exercise releases endorphins, improving mood.",
                      },
                      {
                        word: "Relaxation",
                        definition: "The state of being free from tension",
                        example: "Yoga is a great relaxation technique.",
                      },
                      {
                        word: "Time Management",
                        definition: "Organizing time to reduce stress",
                        example: "Good time management helps reduce pressure.",
                      },
                      {
                        word: "Hydration",
                        definition: "The process of drinking enough fluids",
                        example: "Drinking water is essential for hydration.",
                      },
                    ].map((row, index) => (
                      <TableRow key={`vocab-${index}`}>
                        <TableCell>{row.word}</TableCell>
                        <TableCell>{row.definition}</TableCell>
                        <TableCell>{row.example}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                1. Check the truth of the following statements.
              </Typography>
              <TrueFalse
                name="q1-1"
                completed={completed}
                answer={completed ? answers["q1-1"] : ""}
                correctAnswer={"true"}
              >
                1. Stress can lead to physical problems such as headaches and
                muscle tension.
              </TrueFalse>
              <TrueFalse
                name="q1-2"
                completed={completed}
                answer={completed ? answers["q1-2"] : ""}
                correctAnswer={"false"}
              >
                2. Endorphins make you feel tired and sluggish.
              </TrueFalse>
              <TrueFalse
                name="q1-3"
                completed={completed}
                answer={completed ? answers["q1-3"] : ""}
                correctAnswer={"false"}
              >
                3. You only need 4-5 hours of sleep to manage stress
                effectively.
              </TrueFalse>
              <TrueFalse
                name="q1-4"
                completed={completed}
                answer={completed ? answers["q1-4"] : ""}
                correctAnswer={"true"}
              >
                4. Time management techniques can help reduce stress by
                organizing tasks.
              </TrueFalse>
              <TrueFalse
                name="q1-5"
                completed={completed}
                answer={completed ? answers["q1-5"] : ""}
                correctAnswer={"false"}
              >
                5. Drinking coffee helps with hydration and reduces stress.
              </TrueFalse>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                2. Match the strategies to their benefits.
              </Typography>
              <Typography variant="body1" gutterBottom>
                After reading the text, match each strategy to how it helps
                manage stress and boost energy.
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="strategy table">
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
                      <TableCell sx={{ width: "30%" }}>Strategy</TableCell>
                      <TableCell>How it Helps</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {strategies.map((strategy, index) => (
                      <TableRow key={`strategy-${index}`}>
                        <TableCell component="th" scope="row">
                          {strategy.word}
                        </TableCell>
                        <TableCell
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <CustomSelect
                            name={`q2-${index + 1}`}
                            disabled={loading || completed}
                            key={strategy.word}
                            value={completed ? answers[`q2-${index + 1}`] : ""}
                            error={
                              completed &&
                              answers[`q2-${index + 1}`] !=
                                answer[`q2-${index + 1}`]
                            }
                            options={selectOptions}
                            label="Please select a benefit"
                          />
                          {completed &&
                            (answers[`q2-${index + 1}`] ===
                            answer[`q2-${index + 1}`] ? (
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

export default StressEnergy;

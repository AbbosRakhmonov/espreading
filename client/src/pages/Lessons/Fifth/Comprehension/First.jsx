import {
  Box,
  Container,
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
  List,
  ListItem,
  ListItemText,
  ListSubheader,
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
import { shuffle } from "lodash";

const selectOptions = shuffle([
  {
    value: 1,
    label: "Continuing for a long time without stopping",
  },
  {
    value: 2,
    label: "To become less involved in activities or social interactions",
  },
  {
    value: 3,
    label: "At risk of being hurt emotionally or physically",
  },
  {
    value: 4,
    label: "A belief about oneself that may affect emotions and behavior",
  },
  {
    value: 5,
    label:
      "A type of therapy that helps people change negative thinking patterns",
  },
]);

const vocabWords = [
  { word: "Persistent" },
  { word: "Withdrawal" },
  { word: "Vulnerable" },
  { word: "Self-esteem" },
  { word: "Cognitive-behavioral therapy" },
];

const sentenceQuestions = [
  {
    key: "q3-1",
    sentence:
      "1. Children with depression may experience __________, such as frequent crying or mood swings.",
    answer: "EMOTIONAL SYMPTOMS",
  },
  {
    key: "q3-2",
    sentence:
      "2. One of the most common psychological therapies for childhood depression is __________.",
    answer: "COGNITIVE-BEHAVIORAL THERAPY",
  },
  {
    key: "q3-3",
    sentence:
      "3. A stressful life event, such as __________, can trigger depression in some children.",
    answer: "PARENTAL DIVORCE",
  },
  {
    key: "q3-4",
    sentence:
      "4. To help manage depression, it is important to encourage __________, such as exercise and a balanced diet.",
    answer: "HEALTHY HABITS",
  },
];

const answer = {
  "q1-1": "false",
  "q1-2": "true",
  "q1-3": "false",
  "q1-4": "true",
  "q1-5": "false",
  "q2-1": "1",
  "q2-2": "2",
  "q2-3": "3",
  "q2-4": "4",
  "q2-5": "5",
  "q3-1": "EMOTIONAL SYMPTOMS",
  "q3-2": "COGNITIVE-BEHAVIORAL THERAPY",
  "q3-3": "PARENTAL DIVORCE",
  "q3-4": "HEALTHY HABITS",
};

const ChildhoodDepression = ({
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
      <ReadingTitle title="Depression in Children" timeLeft={timeLeft} />
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
              Depression is often thought of as an adult problem, but it can
              also affect children. It is a serious mental health condition that
              impacts thoughts, emotions, and behavior. While all children feel
              sad or upset at times, depression is different—it is a persistent
              and overwhelming feeling of sadness, hopelessness, and lack of
              motivation that lasts for weeks or months. If left untreated,
              depression can interfere with a child’s education, relationships,
              and overall well-being.
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Causes of Depression in Children
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              There is no single cause of depression. Instead, it is influenced
              by multiple factors, including biological, psychological, and
              environmental aspects.
            </Typography>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Biological and Genetic Factors
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="Depression often runs in families. If a parent or close relative has experienced depression, a child may have a higher risk."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Imbalances in brain chemicals such as serotonin and dopamine, which regulate mood and emotions, can contribute to depression."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Some children may have a more sensitive stress response system, making them more vulnerable to depression."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Psychological and Emotional Factors
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="Children with low self-esteem or a negative self-image may be more prone to depression."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Perfectionism and high expectations can create pressure, leading to stress and feelings of failure."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Children who experience excessive guilt, anxiety, or feelings of worthlessness are at higher risk."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Environmental and Social Factors
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      <i>Family issues:</i> Parental divorce, family conflicts,
                      or neglect can create emotional distress.
                    </>
                  }
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      <i>School-related stress:</i> Academic pressure, bullying,
                      or difficulties in making friends can contribute to
                      depression.
                    </>
                  }
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      <i>Trauma or loss:</i> The death of a loved one, abuse, or
                      witnessing violence can have a lasting psychological
                      impact.
                    </>
                  }
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      <i>Social media influence:</i> Constant exposure to
                      unrealistic standards, cyberbullying, or negative
                      comparisons with others can lower self-esteem.
                    </>
                  }
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Signs and Symptoms of Depression in Children
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Unlike adults, children may not always express their feelings
              verbally. Instead, their depression may manifest in different
              ways.
            </Typography>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Emotional Symptoms
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="Persistent sadness, irritability, or frequent mood swings"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Feelings of hopelessness or worthlessness"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Frequent crying or excessive sensitivity to criticism"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Loss of interest in hobbies, school, or social activities"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Behavioral Symptoms
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="Withdrawing from family and friends"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Sudden drop in school performance or refusal to attend school"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Increased irritability, aggression, or defiant behavior"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Changes in sleeping patterns—sleeping too much or too little"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Eating disorders or significant weight gain/loss"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Physical Symptoms
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="Frequent headaches or stomachaches with no clear medical reason"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Fatigue or lack of energy even after rest"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Slowed movements or speech"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Complaints of feeling sick often"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Consequences of Untreated Depression
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="Poor academic performance due to difficulty concentrating and lack of motivation."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Social withdrawal, leading to isolation and difficulty forming relationships."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Increased risk of anxiety disorders or self-harm behaviors."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Higher likelihood of depression in adulthood if not treated early."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              How to Help a Child with Depression
            </Typography>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Providing Emotional Support
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="Encourage children to express their feelings in a safe and non-judgmental environment."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Show empathy and active listening instead of dismissing their emotions."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Avoid phrases like “Just cheer up” or “You have nothing to be sad about”, as these can make the child feel misunderstood."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Build self-esteem by focusing on strengths and achievements."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Promoting Healthy Lifestyle Habits
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="Encourage regular exercise, which releases endorphins and improves mood."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Ensure a balanced diet with essential nutrients that support mental well-being."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Limit screen time, especially before bedtime, to improve sleep quality."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Promote social connections through extracurricular activities or support groups."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Seeking Professional Help
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="If symptoms persist, a psychologist or mental health professional can provide guidance. Some effective treatments include:"
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      <i>Cognitive-Behavioral Therapy (CBT):</i> Helps children
                      identify negative thought patterns and replace them with
                      positive ones. Teaches coping skills to manage stress and
                      emotions.
                    </>
                  }
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      <i>Family Therapy:</i> Involves parents and siblings to
                      improve communication and emotional support within the
                      family. Helps resolve conflicts that may contribute to
                      depression.
                    </>
                  }
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      <i>Medication:</i> In severe cases, doctors may prescribe
                      antidepressants (such as selective serotonin reuptake
                      inhibitors, or SSRIs). Medication is usually combined with
                      therapy for the best results.
                    </>
                  }
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <Typography
              variant="h6"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Preventing Depression in Children
            </Typography>
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{ fontWeight: "bold", fontSize: "1rem", lineHeight: 1.8 }}
                >
                  Steps to Reduce Risk
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  primary="Encouraging open communication at home so children feel comfortable sharing their feelings."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Teaching stress management skills, such as mindfulness, relaxation techniques, or journaling."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Recognizing early warning signs and seeking help before symptoms worsen."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Creating a supportive environment at school and home where children feel valued and loved."
                  slotProps={{ primary: { variant: "subtitle1" } }}
                />
              </ListItem>
            </List>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb={2}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Depression in children is a serious but treatable condition.
              Understanding the causes, recognizing the symptoms, and providing
              the right support can help children recover and lead healthier,
              happier lives. Parents, teachers, and healthcare professionals all
              play a key role in ensuring that children receive the care they
              need. By raising awareness and promoting mental well-being, we can
              create a more supportive world for every child.
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
                    primary="What do you already know about childhood depression?"
                    slotProps={{ primary: { variant: "body1" } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="How can depression in children differ from depression in adults?"
                    slotProps={{ primary: { variant: "body1" } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="What factors do you think contribute to depression in children?"
                    slotProps={{ primary: { variant: "body1" } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="How can family and school environments impact a child’s mental health?"
                    slotProps={{ primary: { variant: "body1" } }}
                  />
                </ListItem>
              </List>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                1. Match the words with their definitions.
              </Typography>
              <TableContainer component={Paper}>
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
                      <TableCell sx={{ width: "30%" }}>Word</TableCell>
                      <TableCell>Definition</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vocabWords.map((vocab, index) => (
                      <TableRow key={`vocab-${index}`}>
                        <TableCell component="th" scope="row">
                          {vocab.word}
                        </TableCell>
                        <TableCell
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <CustomSelect
                            name={`q1-${index + 1}`}
                            disabled={loading || completed}
                            key={vocab.word}
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
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                2. Check the truth of the following statements.
              </Typography>
              <TrueFalse
                name="q2-1"
                completed={completed}
                answer={completed ? answers["q2-1"] : ""}
                correctAnswer={"false"}
              >
                1. Depression in children is usually just a temporary feeling of
                sadness.
              </TrueFalse>
              <TrueFalse
                name="q2-2"
                completed={completed}
                answer={completed ? answers["q2-2"] : ""}
                correctAnswer={"true"}
              >
                2. Genetics can play a role in childhood depression.
              </TrueFalse>
              <TrueFalse
                name="q2-3"
                completed={completed}
                answer={completed ? answers["q2-3"] : ""}
                correctAnswer={"false"}
              >
                3. All children with depression show the same symptoms.
              </TrueFalse>
              <TrueFalse
                name="q2-4"
                completed={completed}
                answer={completed ? answers["q2-4"] : ""}
                correctAnswer={"true"}
              >
                4. Physical activity can help reduce symptoms of depression.
              </TrueFalse>
              <TrueFalse
                name="q2-5"
                completed={completed}
                answer={completed ? answers["q2-5"] : ""}
                correctAnswer={"false"}
              >
                5. Professional help is necessary if symptoms last more than two
                days.
              </TrueFalse>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                3. Complete the Sentences
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                💡 <i>Objective</i>: Reinforce vocabulary and comprehension.
                Complete the sentences using words or phrases from the text:
              </Typography>
              {sentenceQuestions.map((q) => (
                <Box key={q.key} sx={{ my: 2 }}>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ lineHeight: 2 }}
                  >
                    {q.sentence.split("__________").map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <TextField
                            name={q.key}
                            variant="outlined"
                            size="small"
                            placeholder="Your answer"
                            disabled={completed}
                            defaultValue={answers[q.key] || ""}
                            sx={{
                              mx: 1,
                              width: `${Math.max(
                                10,
                                (q.answer?.length || 10) * 15
                              )}px`,
                              verticalAlign: "middle",
                              "& .MuiInputBase-input": {
                                paddingY: "0 !important",
                                textTransform: "uppercase",
                              },
                            }}
                          />
                        )}
                      </span>
                    ))}
                    <Box
                      sx={{
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      {completed &&
                        (q.answer === answers[q.key] ? (
                          <CorrectAnswer />
                        ) : (
                          <IncorrectAnswer />
                        ))}
                    </Box>
                  </Typography>
                </Box>
              ))}
            </Paper>
            <CompleteButton
              completed={completed}
              loading={loading}
              score={score}
              total={14}
            />
          </form>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default ChildhoodDepression;

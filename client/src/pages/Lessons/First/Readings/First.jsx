import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CorrectAnswer from "../../../../components/CorrectAnswer";
import CustomAudio from "../../../../components/CustomAudio";
import { useError } from "../../../../contexts/ErrorContext";
import { completeReading } from "../../../../utils/api";
import CustomSelect from "../../../../components/CustomSelect";
import BackButton from "../../../../components/BackButton";
import { useTime } from "../../../../hooks/useTime";
import ReadingTitle from "../../../../components/ReadingTitle";
import WordPopper from "../../../../components/WordPopper";
import CompleteButton from "../../../../components/CompleteButton";

const answer = {
  emma: 1,
  carlos: 2,
  fatima: 3,
  liam: 4,
  sofia: 5,
};

const selectOptions = [
  { value: 4, label: "Depression" },
  { value: 2, label: "Anger" },
  { value: 3, label: "Bargaining" },
  { value: 1, label: "Denial" },
  { value: 5, label: "Acceptance" },
];

function First({ completed = false, score = 0, answers = {}, time = 0 }) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { readingId } = useParams();
  const { showError } = useError();

  const { timeLeft } = useTime({ time, completed });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.target);
      formData.append("time", timeLeft);
      await completeReading(readingId, formData);
      window.location.reload();
    } catch (error) {
      showError(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <BackButton />
      <ReadingTitle timeLeft={timeLeft} />
      <Typography
        variant="body1"
        sx={{
          mb: 2,
        }}
      >
        Read and listen to the five real-life situations of individuals who are
        grieving after losing a loved one. Carefully analyze the emotions and
        thoughts described in each scenario. Then, match each situation with the
        correct stage of grief: <b>Denial, Anger, Bargaining, Depression,</b> or{" "}
        <b>Acceptance.</b>
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 3,
        }}
      >
        Total possible score: <b>5 points</b> (1 point per situation).
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative", height: "100%" }}>
            <svg style={{ display: "none" }}>
              <filter id="wavy2">
                <feTurbulence
                  x="0"
                  y="0"
                  baseFrequency="0.01"
                  numOctaves="2"
                  seed="1"
                />
                <feDisplacementMap in="SourceGraphic" scale="20" />
              </filter>
            </svg>
            <Box
              id="parchment"
              sx={{
                position: "absolute",
                display: "flex",
                width: "100%",
                top: 0,
                bottom: 0,
                height: "100%",
                padding: "6em",
                zIndex: -1,
                boxShadow: "2px 3px 20px black, 0 0 125px #8f5922 inset",
                background: "#fffef0",
                /* v2.1 : borders effect with SVG : try to play with scale to change them */
                filter: "url(#wavy2)",
                /* v2.2 : Noise added for a vellum paper effect */
                backgroundImage:
                  "url('data:image/png;base64,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')",
                "&::after": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "conic-gradient(#fff3, #fff0 2% 24%, #fff2 25%, #4321 0, #0000 27% 48%, #9632 50%, #fff2 0, #fff0 52% 73%, #9632 75%, #fff3 0, #fff0 78% 97%, #9632);",
                },
              }}
            ></Box>
            <Typography
              variant="body1"
              sx={{
                padding: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              <WordPopper word="Grief" /> is a natural response to loss. It
              affects everyone differently, but psychologists have identified
              five common stages that many people experience. Understanding
              these stages can help us cope with difficult emotions and support
              others going through tough times.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                paddingX: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              1. <WordPopper word="Denial" />
            </Typography>
            <Typography
              variant="body1"
              sx={{
                padding: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              The first stage of grief is denial. When faced with a loss, people
              often feel shocked or unable to accept the situation. For example,
              someone might think, "This can’t be happening to me." Denial acts
              as a defense mechanism to protect us from overwhelming emotions.
              It gives the mind time to adjust to the reality of the loss.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                paddingX: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              2. <WordPopper word="Anger" />
            </Typography>
            <Typography
              variant="body1"
              sx={{
                padding: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              After denial, people often feel anger. This stage might involve
              blaming others, feeling frustrated or even directing anger at
              oneself. A grieving person might say, "Why did this happen? It’s
              not fair!" Anger is a way of expressing the pain we feel inside.
              While it can be uncomfortable, it is an important part of the
              healing process.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                paddingX: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              3. <WordPopper word="Bargaining" />
            </Typography>
            <Typography
              variant="body1"
              sx={{
                padding: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              In the bargaining stage, people try to regain control of the
              situation. They may make promises to themselves or a higher power,
              hoping to reverse the loss. For instance, someone might think, "If
              only I had done things differently, this wouldn’t have happened."
              Bargaining reflects our desire to make sense of the loss and find
              a way to ease the pain.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                paddingX: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              4. <WordPopper word="Depression" />
            </Typography>
            <Typography
              variant="body1"
              sx={{
                padding: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              Depression is often the most challenging stage. During this time,
              people feel deep sadness and may withdraw from others. Thoughts
              like, "I don’t know how to move on," are common. Depression is not
              a sign of weakness but a normal reaction to loss. Acknowledging
              these feelings and seeking support can help people navigate this
              stage.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                paddingX: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              5. <WordPopper word="Acceptance" />
            </Typography>
            <Typography
              variant="body1"
              sx={{
                padding: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              The final stage is acceptance. Here, people begin to come to terms
              with the loss and adjust to their new reality. This does not mean
              they forget their loved one or the loss becomes insignificant.
              Instead, they find ways to move forward, cherishing the memories
              while embracing life again.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                paddingX: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              Coping with Grief
            </Typography>
            <Typography
              variant="body1"
              sx={{
                padding: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              Grief is a personal journey, and not everyone experiences these
              stages in order. Some may revisit stages, and others might skip
              certain stages altogether. It is important to be patient with
              yourself and others during this process. Support from friends,
              family, or counsellors can make a big difference in helping people
              heal.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                paddingX: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              By understanding the five stages of grief, we can better manage
              our emotions and help others in times of need. Grieving is not
              about forgetting but learning to live with loss while finding
              strength to move forward.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                background: "#f5f5f5",
                padding: 2,
                mb: 3,
              }}
            >
              <Typography variant={"h6"} gutterBottom>
                Situation 1
              </Typography>
              <Typography variant="body2" gutterBottom>
                Liam feels empty and struggles to get out of bed after his
                grandfather’s passing. He has lost interest in his favorite
                hobbies and often thinks that life will never feel the same
                again.
              </Typography>
              <CustomAudio audioUrl="/audios/liam.wav" type="audio/wav" />
              <Typography variant={"h6"} gutterBottom>
                Situation 2
              </Typography>
              <Typography variant="body2" gutterBottom>
                Sofia lost her best friend two years ago. Though she still
                misses her, she has started volunteering at a community center,
                inspired by her friend’s love for helping others. She has found
                a way to honor her memory while moving forward.
              </Typography>
              <CustomAudio audioUrl="/audios/sofia.wav" type="audio/wav" />
              <Typography variant={"h6"} gutterBottom>
                Situation 3
              </Typography>
              <Typography variant="body2" gutterBottom>
                Emma recently lost her husband in an accident. She often feels
                numb and keeps thinking he will walk through the door any
                minute. She avoids looking at his belongings because it makes
                the situation feel too real.
              </Typography>
              <CustomAudio audioUrl="/audios/emma.wav" type="audio/wav" />
              <Typography variant={"h6"} gutterBottom>
                Situation 4
              </Typography>
              <Typography variant="body2" gutterBottom>
                Carlos lost his younger sister to illness. He feels frustrated
                and angry at the doctors for not doing enough to save her. He
                also blames himself for not recognizing the severity of her
                symptoms earlier.
              </Typography>
              <CustomAudio audioUrl="/audios/carlos.wav" type="audio/wav" />
              <Typography variant={"h6"} gutterBottom>
                Situation 5
              </Typography>
              <Typography variant="body2" gutterBottom>
                After losing her mother, Fatima spends a lot of time wondering
                if she could have prevented it. She often thinks, "If only I had
                encouraged her to see a doctor sooner, maybe she would still be
                alive."
              </Typography>
              <CustomAudio audioUrl="/audios/fatima.wav" type="audio/wav" />
            </Box>
            <form onSubmit={handleSubmit}>
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
                          width: isMobile ? "40%" : "20%",
                        }}
                        component={"th"}
                        scope="row"
                      >
                        Person
                      </TableCell>
                      <TableCell>Stage of Grief</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Carlos
                      </TableCell>
                      <TableCell sx={{ display: "flex" }}>
                        <CustomSelect
                          name="carlos"
                          disabled={loading || completed}
                          key={"carlos"}
                          value={completed ? answers.carlos : ""}
                          error={completed && answers.carlos != answer.carlos}
                          options={selectOptions}
                          label="Please select a situation"
                        />
                        {completed && answers.carlos == answer.carlos && (
                          <CorrectAnswer />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Liam
                      </TableCell>
                      <TableCell sx={{ display: "flex" }}>
                        <CustomSelect
                          name="liam"
                          disabled={loading || completed}
                          key={"liam"}
                          value={completed ? answers.liam : ""}
                          error={completed && answers.liam != answer.liam}
                          options={selectOptions}
                          label="Please select a situation"
                        />
                        {completed && answers.liam == answer.liam && (
                          <CorrectAnswer />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Fatima
                      </TableCell>
                      <TableCell sx={{ display: "flex" }}>
                        <CustomSelect
                          name="fatima"
                          disabled={loading || completed}
                          key={"fatima"}
                          value={completed ? answers.fatima : ""}
                          error={completed && answers.fatima != answer.fatima}
                          options={selectOptions}
                          label="Please select a situation"
                        />
                        {completed && answers.fatima == answer.fatima && (
                          <CorrectAnswer />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Sofia
                      </TableCell>
                      <TableCell sx={{ display: "flex" }}>
                        <CustomSelect
                          name="sofia"
                          disabled={loading || completed}
                          key={"sofia"}
                          value={completed ? answers.sofia : ""}
                          error={completed && answers.sofia != answer.sofia}
                          options={selectOptions}
                          label="Please select a situation"
                        />
                        {completed && answers.sofia == answer.sofia && (
                          <CorrectAnswer />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Emma
                      </TableCell>
                      <TableCell sx={{ display: "flex" }}>
                        <CustomSelect
                          name="emma"
                          disabled={loading || completed}
                          key={"emma"}
                          value={completed ? answers.emma : ""}
                          error={completed && answers.emma != answer.emma}
                          options={selectOptions}
                          label="Please select a situation"
                        />
                        {completed && answers.emma == answer.emma && (
                          <CorrectAnswer />
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <CompleteButton
                loading={loading}
                completed={completed}
                score={score}
                total={5}
              />
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default First;

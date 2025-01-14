import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import React, { useEffect, useState } from "react";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSelect = ({ name = "", disabled = false, value = "" }) => {
  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      <InputLabel id="demo-simple-select-label">
        Please select an order
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue={value}
        label="Please select an order"
        name={name}
        disabled={disabled}
      >
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={7}>7</MenuItem>
      </Select>
    </FormControl>
  );
};

const Sequencing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // 60 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          mb: 2,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          color="primary"
        >
          Conversation – Bargaining Stage
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ mt: isMobile ? 2 : 0 }}
        >
          Time: {formatTime(timeLeft)}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{
          mb: 2,
        }}
      >
        Read the conversation below. The sentences are out of order. Rearrange
        them to create a logical and meaningful dialogue between the
        psychologist and the client.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 2,
        }}
      >
        <b>Hint:</b> Start with the psychologist initiating speech, then follow
        the logical flow of questions and responses.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 2,
        }}
      >
        Total possible score: <b>7 points</b> (1 point per order).
      </Typography>
      <form>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontSize: isMobile ? "0.8rem" : "1rem",
                    fontWeight: "bold",
                  },
                }}
              >
                <TableCell component={"th"} scope="row">
                  Conversation
                </TableCell>
                <TableCell
                  sx={{
                    minWidth: isMobile ? "100px" : "250px",
                  }}
                >
                  Order
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  <b>Client:</b> So, you’re saying it’s okay that I couldn’t
                  control everything?
                </TableCell>
                <TableCell>
                  <CustomSelect name="1" disabled={loading} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <b>Psychologist:</b> It sounds like you’re feeling guilty and
                  trying to make sense of what happened. Can you tell me more
                  about what’s on your mind?
                </TableCell>
                <TableCell>
                  <CustomSelect name="2" disabled={loading} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <b>Client:</b> I just feel like if I had done things
                  differently, none of this would’ve happened. Maybe I can still
                  fix it somehow?
                </TableCell>
                <TableCell>
                  <CustomSelect name="3" disabled={loading} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <b>Psychologist:</b> Exactly. Accepting that can be hard, but
                  it’s also freeing. Let’s focus on what you need right now to
                  heal and move forward.
                </TableCell>
                <TableCell>
                  <CustomSelect name="4" disabled={loading} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <b>Psychologist:</b> That’s a common thought in situations
                  like this. But remember, not everything was in your control.
                  Blaming yourself won’t change the past, and it’s important to
                  focus on what’s within your power now.
                </TableCell>
                <TableCell>
                  <CustomSelect name="5" disabled={loading} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <b>Client:</b> But I keep thinking, what if I had tried
                  harder? What if I made better choices?
                </TableCell>
                <TableCell>
                  <CustomSelect name="6" disabled={loading} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <b>Psychologist:</b> Those “what if” questions show how much
                  you care. But they can also hold you back. You did the best
                  you could with what you knew at the time.
                </TableCell>
                <TableCell>
                  <CustomSelect name="7" disabled={loading} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Button
            sx={{
              mt: 4,
            }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            Submit Answers
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Sequencing;

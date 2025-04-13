import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CorrectAnswer from "./CorrectAnswer";
import IncorrectAnswer from "./IncorrectAnswer";

const TrueFalse = ({
  children,
  name = "",
  completed = false,
  answer,
  correctAnswer,
}) => {
  return (
    <Box
      mb={2}
      sx={{
        ":not(:last-of-type)": {
          borderBottom: "1px solid #ccc",
        },
      }}
    >
      <Typography variant="body1" gutterBottom>
        {children}
      </Typography>
      <FormControl disabled={completed}>
        <RadioGroup row name={name} defaultValue={answer}>
          <FormControlLabel value={true} control={<Radio />} label="True" />
          <FormControlLabel value={false} control={<Radio />} label="False" />
          {completed &&
            (answer === correctAnswer ? (
              <CorrectAnswer />
            ) : (
              <IncorrectAnswer />
            ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default TrueFalse;

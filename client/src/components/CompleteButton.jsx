import { Box, Button, Typography } from "@mui/material";

const CompleteButton = ({ loading, completed, score, total = 5 }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        my: 4,
      }}
    >
      {completed && (
        <Typography
          variant="h6"
          component="h2"
          align="center"
          sx={{ mb: 1 }}
          color="success.main"
          gutterBottom
        >
          Score: {score} / {total}
        </Typography>
      )}
      {!completed && (
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          Submit Answers
        </Button>
      )}
    </Box>
  );
};

export default CompleteButton;

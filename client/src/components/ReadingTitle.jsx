import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { formatTime } from "../utils/formatTime";

const ReadingTitle = ({ title = "The Five Stages of Grief", timeLeft }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
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
        {title}
      </Typography>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        sx={{ mt: isMobile ? 2 : 0 }}
      >
        Time: {formatTime(timeLeft)}
      </Typography>
    </Box>
  );
};

export default ReadingTitle;

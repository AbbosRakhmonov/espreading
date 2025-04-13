import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
const BackButton = () => {
  return (
    <Box
      sx={{
        flex: 1,
        marginY: "1rem",
      }}
    >
      <Button component={RouterLink} to={-1} variant="contained">
        go Back
      </Button>
    </Box>
  );
};

export default BackButton;

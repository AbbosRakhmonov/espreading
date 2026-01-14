import { Box, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
const BackButton = ({ to }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        marginY: "1rem",
      }}
    >
      <Button onClick={handleClick} variant="contained">
        go Back
      </Button>
    </Box>
  );
};

export default BackButton;

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Box } from "@mui/material";

const CorrectAnswer = () => {
  return (
    <Box
      component={"span"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
      }}
    >
      <CheckBoxIcon color="success" />
    </Box>
  );
};

export default CorrectAnswer;

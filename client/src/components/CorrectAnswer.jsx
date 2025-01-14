import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Box } from "@mui/material";
import React from "react";

const CorrectAnswer = () => {
  return (
    <Box
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

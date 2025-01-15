import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Box } from "@mui/material";
import React from "react";

const IncorrectAnswer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
      }}
    >
      <DisabledByDefaultIcon color="error" />
    </Box>
  );
};

export default IncorrectAnswer;

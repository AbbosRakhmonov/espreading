import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          You do not have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
}

export default Unauthorized;

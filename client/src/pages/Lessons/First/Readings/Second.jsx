import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

function Second() {
  const [timeLeft, setTimeLeft] = useState(0); // 60 minutes
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const submit = async (e) => {};

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
          The History of Tea
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ mt: isMobile ? 2 : 0 }}
        >
          Time: {formatTime(timeLeft)}
        </Typography>
      </Box>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative", height: "100%" }}>
            <svg style={{ display: "none" }}>
              <filter id="wavy2">
                <feTurbulence
                  x="0"
                  y="0"
                  baseFrequency="0.01"
                  numOctaves="2"
                  seed="1"
                />
                <feDisplacementMap in="SourceGraphic" scale="20" />
              </filter>
            </svg>
            <Box
              id="parchment"
              sx={{
                position: "absolute",
                display: "flex",
                width: "100%",
                top: 0,
                bottom: 0,
                height: "100%",
                padding: "6em",
                zIndex: -1,
                boxShadow: "2px 3px 20px black, 0 0 125px #8f5922 inset",
                background: "#fffef0",
                /* v2.1 : borders effect with SVG : try to play with scale to change them */
                filter: "url(#wavy2)",
                /* v2.2 : Noise added for a vellum paper effect */
                backgroundImage:
                  "url('data:image/png;base64,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')",
                "&::after": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "conic-gradient(#fff3, #fff0 2% 24%, #fff2 25%, #4321 0, #0000 27% 48%, #9632 50%, #fff2 0, #fff0 52% 73%, #9632 75%, #fff3 0, #fff0 78% 97%, #9632);",
                },
              }}
            ></Box>
            <Typography
              variant="body1"
              sx={{
                padding: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptates molestiae nemo nihil aliquid laboriosam natus nam
              delectus libero quae eos. Magnam praesentium illo voluptate hic
              distinctio vitae sapiente expedita, commodi ad mollitia? Nostrum
              sint animi illo distinctio amet exercitationem, laboriosam nobis
            </Typography>
            <Typography
              variant="body1"
              sx={{
                paddingX: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptates molestiae nemo nihil aliquid laboriosam natus nam
              delectus libero quae eos. Magnam praesentium illo voluptate hic
              distinctio vitae sapiente expedita, commodi ad mollitia? Nostrum
              sint animi illo distinctio amet exercitationem, laboriosam nobis
            </Typography>
            <Typography
              variant="body1"
              sx={{
                padding: 3,
                fontFamily: "Playwrite AU SA, serif",
                lineHeight: 1.8,
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptates molestiae nemo nihil aliquid laboriosam natus nam
              delectus libero quae eos. Magnam praesentium illo voluptate hic
              distinctio vitae sapiente expedita, commodi ad mollitia? Nostrum
              sint animi illo distinctio amet exercitationem, laboriosam nobis
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              Questions
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                1. Tea originated in China.
              </Typography>
              <RadioGroup row name="1">
                <FormControlLabel
                  value={"True"}
                  control={<Radio />}
                  label={"True"}
                />
                <FormControlLabel
                  value={"False"}
                  control={<Radio />}
                  label={"False"}
                />
              </RadioGroup>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                2. Match the tea type with its origin:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: "bold", flexShrink: 0 }}
                    component="span"
                    variant="body1"
                  >
                    Green Tea
                  </Typography>
                  {/* select */}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Please select an option
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Please select an option"
                      defaultValue={""}
                    >
                      <MenuItem value={"China"}>China</MenuItem>
                      <MenuItem value={"India"}>India</MenuItem>
                      <MenuItem value={"Taiwan"}>Taiwan</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: "bold", flexShrink: 0 }}
                    component="span"
                    variant="body1"
                  >
                    Black Tea
                  </Typography>
                  {/* select */}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Please select an option
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Please select an option"
                      defaultValue={""}
                    >
                      <MenuItem value={"China"}>China</MenuItem>
                      <MenuItem value={"India"}>India</MenuItem>
                      <MenuItem value={"Taiwan"}>Taiwan</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: "bold", flexShrink: 0 }}
                    component="span"
                    variant="body1"
                  >
                    Oolong Tea
                  </Typography>
                  {/* select */}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Please select an option
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Please select an option"
                      defaultValue={""}
                    >
                      <MenuItem value={"China"}>China</MenuItem>
                      <MenuItem value={"India"}>India</MenuItem>
                      <MenuItem value={"Taiwan"}>Taiwan</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                3. Match the tea type with its origin:
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your answer"
              />
            </Box>

            <Button variant="contained" color="primary">
              Submit Answers
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Second;

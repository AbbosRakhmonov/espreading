import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import LinkCard from "../components/LinkCard";

import { lessons } from "../utils/lessons";

const Lessons = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        component="h2"
        gutterBottom
        sx={{
          mb: 2,
        }}
      >
        Available Lessons
      </Typography>
      <Grid container spacing={3}>
        {lessons.map((passage) => (
          <Grid item xs={12} sm={6} md={4} key={passage.id}>
            <LinkCard
              text={passage.subtitle}
              title={passage.title}
              href={`/lesson/${passage.id}`}
              image={passage?.image}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Lessons;

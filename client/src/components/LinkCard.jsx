import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const LinkCard = ({
  text,
  title = "",
  image = "/images/cards/default.avif",
  href = "#",
  completed = false,
  score = 0,
  disabled = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Card
      sx={{
        height: "100%",
        transition: "all 0.3s ease-in-out",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        "&:hover": disabled
          ? {}
          : {
              transform: "scale(1.05)",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              backgroundColor: "secondary.main",
              "& h6, & p": {
                color: "secondary.contrastText",
              },
            },
      }}
    >
      <CardActionArea
        component={disabled ? "div" : RouterLink}
        to={disabled ? "#" : href}
        disabled={disabled}
        sx={{
          position: "relative",
          pointerEvents: disabled ? "none" : "auto",
          // ribbon for completed
          "&:after": {
            content: "'completed'",
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "success.main",
            color: "common.white",
            padding: "0.25rem 0.5rem",
            fontSize: "0.75rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            zIndex: 1,
            borderRadius: "0 0 0 0.25rem",
            display: completed ? "block" : "none",
          },
        }}
      >
        <CardMedia sx={{ height: 140, objectFit: "cover" }} image={image} />
        <CardContent>
          <Typography
            gutterBottom
            variant={isMobile ? "subtitle1" : "h6"}
            component="h6"
            sx={{
              color: "secondary.main",
            }}
          >
            {title}
          </Typography>
          <Typography component={"p"} variant="body2" color="text.secondary">
            {text}
          </Typography>
          {completed && (
            <Typography component={"p"} variant="body2" color="success.main">
              Score: {score}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LinkCard;

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
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Card
      sx={{
        height: "100%",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          backgroundColor: "secondary.main",
          "& h6, & p": {
            color: "secondary.contrastText",
          },
        },
      }}
    >
      <CardActionArea component={RouterLink} to={href}>
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LinkCard;

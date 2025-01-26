import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";

const InfoCard = ({ color = "primary", icon, title, value }) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="warning" variant="h6">
                {title}
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ bgcolor: color, height: 50, width: 50 }}>
              {icon}
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InfoCard;

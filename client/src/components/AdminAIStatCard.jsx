import React from "react";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";

export default function AdminAIStatCard({ title, value, subtitle, icon, color = "primary.main" }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }} spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {value}
              </Typography>
              {subtitle != null && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Stack>
            <Avatar sx={{ bgcolor: color, height: 48, width: 48 }}>{icon}</Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

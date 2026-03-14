import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

export default function AdminAIChartCard({ title, data, type = "bar", colors }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {type === "bar" && data?.length > 0 && (
          <BarChart
            dataset={data}
            xAxis={[{ scaleType: "band", dataKey: "label" }]}
            series={[{ dataKey: "value", label: "Count" }]}
            height={280}
            colors={colors}
          />
        )}
        {type === "pie" && data?.length > 0 && (
          <PieChart
            series={[{ data: data.map((d) => ({ id: d.label, value: d.value, label: d.label })) }]}
            height={280}
            slotProps={{ legend: { direction: "row", position: { vertical: "bottom" } } }}
          />
        )}
        {(!data || data.length === 0) && (
          <Typography variant="body2" color="text.secondary">
            No data
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

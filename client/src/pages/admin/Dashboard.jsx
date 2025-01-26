import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PieChart } from "@mui/x-charts/PieChart";
import React from "react";
import InfoCard from "../../components/InfoCard";
const pieParams = {
  height: 200,
  margin: { right: 5 },
  slotProps: { legend: { hidden: true } },
};

const palette1 = [
  "#3498db", // blue
  "#f1c40f", // yellow
  "#e74c3c", // red
  "#2ecc71", // green
  "#9b59b6", // purple
];
const palette2 = [
  "#1abc9c", // teal
  "#e67e73", // orange
  "#16a085", // dark teal
  "#f7dc6f", // light yellow
  "#8e44ad", // dark purple
];
const palette3 = [
  "#27ae60", // green
  "#2980b9", // blue
  "#d35400", // orange
  "#2c3e50", // dark blue
  "#f39c12", // yellow orange
];

const Dashboard = () => {
  return (
    <Box>
      <Container maxWidth="xl" sx={{ py: "64px" }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoCard
              icon={<MenuBookIcon fontSize="large" />}
              title="Lessons"
              value="12"
              color="primary.main"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoCard
              icon={<AutoStoriesIcon fontSize="large" />}
              title="Readings"
              value="12"
              color="secondary.main"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoCard
              icon={<GroupsIcon fontSize="large" />}
              title="Students"
              value="12"
              color="success.light"
            />
          </Grid>
          <Grid size={12}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              gutterBottom
              color="info"
              sx={{ my: 4 }}
            >
              Statistics
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" component="h2" mb={2} align="center">
                  Navoiy Davlat Universiteti
                </Typography>
                <PieChart
                  colors={palette1}
                  series={[
                    {
                      arcLabel: (item) => `${item.value}%`,
                      arcLabelMinAngle: 20,
                      arcLabelRadius: "50%",
                      data: [
                        {
                          label: "Score 2",
                          value: 10,
                        },
                        {
                          label: "Score 3",
                          value: 20,
                        },
                        {
                          label: "Score 4",
                          value: 30,
                        },
                        {
                          label: "Score 5",
                          value: 40,
                        },
                      ],
                    },
                  ]}
                  {...pieParams}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" component="h2" mb={2} align="center">
                  Qarshi Davlat Universiteti
                </Typography>
                <PieChart
                  colors={palette2}
                  series={[
                    {
                      arcLabel: (item) => `${item.value}%`,
                      arcLabelMinAngle: 20,
                      arcLabelRadius: "50%",
                      data: [
                        {
                          label: "Score 2",
                          value: 10,
                        },
                        {
                          label: "Score 3",
                          value: 20,
                        },
                        {
                          label: "Score 4",
                          value: 30,
                        },
                        {
                          label: "Score 5",
                          value: 40,
                        },
                      ],
                    },
                  ]}
                  {...pieParams}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" component="h2" mb={2} align="center">
                  Guliston Davlat Universiteti
                </Typography>
                <PieChart
                  colors={palette3}
                  series={[
                    {
                      arcLabel: (item) => `${item.value}%`,
                      arcLabelMinAngle: 20,
                      arcLabelRadius: "50%",
                      data: [
                        {
                          label: "Score 2",
                          value: 10,
                        },
                        {
                          label: "Score 3",
                          value: 20,
                        },
                        {
                          label: "Score 4",
                          value: 30,
                        },
                        {
                          label: "Score 5",
                          value: 40,
                        },
                      ],
                    },
                  ]}
                  {...pieParams}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;

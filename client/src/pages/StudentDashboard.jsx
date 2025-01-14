import { Container } from "@mui/material";
import Header from "../components/Header";
import Lessons from "./Lessons";



function StudentDashboard() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Header />
      <Lessons />
    </Container>
  );
}

export default StudentDashboard;

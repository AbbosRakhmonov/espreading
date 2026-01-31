import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MonitorIcon from "@mui/icons-material/Monitor";
import RateReviewIcon from "@mui/icons-material/RateReview";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const testimonials = [
    {
      name: "Dilshod Karimov",
      rating: 5.0,
      avatar: "DK",
      review:
        "Amazing platform! My reading comprehension skills have improved significantly. The interactive exercises are very helpful.",
      university: "Navoiy State University",
    },
    {
      name: "Gulnoza Toshmatova",
      rating: 4.9,
      avatar: "GT",
      review:
        "This platform has greatly helped me develop my English reading skills. I highly recommend it!",
      university: "Qarshi State University",
    },
    {
      name: "Javohir Ismoilov",
      rating: 4.8,
      avatar: "JI",
      review:
        "The statistics and analytics are very detailed. The ability to see my results after each exercise is amazing.",
      university: "Guliston State University",
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const handlePrev = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setAutoPlay(false);
  };

  const handleDotClick = (index) => {
    setCurrentTestimonial(index);
    setAutoPlay(false);
  };

  return (
    <Box className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <Container maxWidth="lg" className="header-container">
          <Box className="logo-section">
            <SchoolIcon className="logo-icon" />
            <Typography variant="h5" className="logo-text">
              ESPREADING
            </Typography>
          </Box>

          <Box className="nav-section">
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#services" className="nav-link">
              Services
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#courses" className="nav-link">
              Courses
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </Box>

          <Box className="header-actions">
            <Button className="login-btn" onClick={handleLogin}>
              Login
            </Button>
            <Button className="signup-btn" onClick={handleSignUp}>
              Sign Up
            </Button>
          </Box>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-decorative-shapes">
          <div className="decorative-circle circle-1"></div>
          <div className="decorative-circle circle-2"></div>
          <div className="decorative-circle circle-3"></div>
        </div>
        <Container maxWidth="lg" className="hero-container">
          <Box className="hero-content">
            <Box className="hero-text">
              <Typography variant="h1" className="hero-title">
                Read Like a Psychologist. Think Like a Professional
              </Typography>
              <Typography variant="body1" className="hero-description">
                Enhance your reading comprehension skills through interactive
                exercises, comprehensive analytics, and personalized learning
                experiences designed for university students.
              </Typography>
              <Box className="email-input-section">
                <TextField
                  placeholder="Enter your email..."
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          className="get-started-btn"
                          onClick={handleGetStarted}
                          endIcon={<ArrowForwardIcon />}
                        >
                          Get Started
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box className="hero-illustration">
              <div className="illustration-person">
                <img
                  src="https://www.techwomen.org/wp-content/uploads/2019/03/2-1.jpg"
                  alt="Student"
                  className="person-image"
                />
              </div>
              <Card className="stat-card stat-card-1">
                <CardContent>
                  <Box className="stat-icon-container">
                    <MonitorIcon className="stat-icon" />
                  </Box>
                  <Typography variant="h6" className="stat-number">
                    100,00+
                  </Typography>
                  <Typography variant="body2" className="stat-text">
                    Free Reading Exercises
                  </Typography>
                </CardContent>
              </Card>
              <Card className="stat-card stat-card-2">
                <CardContent>
                  <Box className="stat-icon-container">
                    <PeopleIcon className="stat-icon" />
                  </Box>
                  <Typography variant="h6" className="stat-number">
                    Total Students 16K
                  </Typography>
                  <Box className="student-avatars">
                    <Avatar className="mini-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                        alt="Student"
                      />
                    </Avatar>
                    <Avatar className="mini-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
                        alt="Student"
                      />
                    </Avatar>
                    <Avatar className="mini-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                        alt="Student"
                      />
                    </Avatar>
                    <Avatar className="mini-avatar">+</Avatar>
                  </Box>
                </CardContent>
              </Card>
              <Card className="stat-card stat-card-3">
                <CardContent>
                  <Box className="stat-icon-container">
                    <StarIcon className="stat-icon" />
                  </Box>
                  <Typography variant="h6" className="stat-number">
                    4.9/5
                  </Typography>
                  <Typography variant="body2" className="stat-text">
                    Average Rating
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <div className="section-decoration">
          <div className="decoration-line line-1"></div>
          <div className="decoration-line line-2"></div>
        </div>
        <Container maxWidth="lg">
          <Box className="features-grid">
            <Box className="feature-item">
              <Box className="feature-icon green">
                <MenuBookIcon />
              </Box>
              <Typography variant="h6" className="feature-text">
                1,000+ Free best online reading courses
              </Typography>
            </Box>
            <Box className="feature-item">
              <Box className="feature-icon red">
                <PersonIcon />
              </Box>
              <Typography variant="h6" className="feature-text">
                1,000+ Experienced and expert mentors
              </Typography>
            </Box>
            <Box className="feature-item">
              <Box className="feature-icon teal">
                <RateReviewIcon />
              </Box>
              <Typography variant="h6" className="feature-text">
                1M+ students rate and review
              </Typography>
            </Box>
          </Box>
        </Container>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose-section" id="about">
        <div className="section-pattern"></div>
        <Container maxWidth="lg">
          <Box className="section-header">
            <Typography variant="h2" className="section-title">
              Why Choose ESPREADING?
            </Typography>
            <Typography
              variant="body1"
              className="section-description centered"
              style={{ margin: "0 auto" }}
            >
              We provide comprehensive reading comprehension tools designed to
              help university students improve their skills through interactive
              exercises and detailed analytics.
            </Typography>
          </Box>

          <Box className="benefits-grid">
            <Card className="benefit-card">
              <CardContent>
                <WorkspacePremiumIcon className="benefit-icon yellow" />
                <Typography variant="h5" className="benefit-title">
                  Get Certificate
                </Typography>
                <Typography variant="body2" className="benefit-text">
                  We are providing a certificate to you after completing your
                  reading exercises and this will help you in your future
                  academic journey.
                </Typography>
              </CardContent>
            </Card>

            <Card className="benefit-card">
              <CardContent>
                <GroupIcon className="benefit-icon green" />
                <Typography variant="h5" className="benefit-title">
                  Get Membership
                </Typography>
                <Typography variant="body2" className="benefit-text">
                  We are providing an offer that you can join our membership
                  club and you will get some extra features and benefits.
                </Typography>
              </CardContent>
            </Card>

            <Card className="benefit-card">
              <CardContent>
                <PersonAddIcon className="benefit-icon red" />
                <Typography variant="h5" className="benefit-title">
                  Become a Mentor
                </Typography>
                <Typography variant="body2" className="benefit-text">
                  We are giving you the opportunity to become a mentor after
                  completing your courses and you can join freely.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="courses">
        <Container maxWidth="lg">
          <Box className="section-header">
            <Typography variant="h2" className="section-title">
              Student Testimonials
            </Typography>
            <Typography
              variant="body1"
              className="section-description centered"
            >
              Real reviews and feedback from students at universities across
              Uzbekistan
            </Typography>
          </Box>

          <Box className="testimonials-content">
            <Box className="testimonials-left">
              <Typography variant="h3" className="testimonials-title">
                1000+ Happy Students
              </Typography>
              <Box className="testimonials-carousel-container">
                <Box className="testimonials-carousel-wrapper">
                  <Box
                    className="testimonials-carousel"
                    style={{
                      transform: `translateX(-${currentTestimonial * 100}%)`,
                    }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <Card key={index} className="testimonial-card">
                        <CardContent>
                          <Box className="testimonial-header">
                            <Avatar className="testimonial-avatar">
                              {testimonial.avatar}
                            </Avatar>
                            <Box className="testimonial-info">
                              <Typography
                                variant="body1"
                                className="testimonial-name"
                              >
                                {testimonial.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="testimonial-university"
                              >
                                {testimonial.university}
                              </Typography>
                              <Box className="testimonial-rating">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={
                                      i < Math.floor(testimonial.rating)
                                        ? "star-filled"
                                        : "star-empty"
                                    }
                                  />
                                ))}
                                <Typography
                                  variant="body2"
                                  className="rating-text"
                                >
                                  {testimonial.rating}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            className="testimonial-review"
                          >
                            "{testimonial.review}"
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
                <Box className="carousel-controls">
                  <IconButton
                    className="carousel-btn carousel-btn-prev"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Box className="carousel-dots">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot ${index === currentTestimonial ? "active" : ""
                          }`}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </Box>
                  <IconButton
                    className="carousel-btn carousel-btn-next"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box className="social-testimonials">
                <IconButton className="social-btn">
                  <FacebookIcon />
                </IconButton>
                <IconButton className="social-btn">
                  <TwitterIcon />
                </IconButton>
                <IconButton className="social-btn">
                  <LinkedInIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" className="design-testimonials">
                1000+ Students from Uzbekistan trust us
              </Typography>
              <Card className="achievement-card">
                <CardContent>
                  <Typography variant="h4" className="achievement-number">
                    95%
                  </Typography>
                  <Typography variant="body1" className="achievement-text">
                    Student Satisfaction Rate
                  </Typography>
                  <Box className="achievement-stats">
                    <Box className="achievement-stat-item">
                      <Typography variant="h6" className="stat-value">
                        50K+
                      </Typography>
                      <Typography variant="body2" className="stat-label">
                        Completed Exercises
                      </Typography>
                    </Box>
                    <Box className="achievement-stat-item">
                      <Typography variant="h6" className="stat-value">
                        98%
                      </Typography>
                      <Typography variant="body2" className="stat-label">
                        Success Rate
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box className="testimonials-right">
              <Typography variant="h2" className="section-title">
                Real Reviews from Our Students
              </Typography>
              <Typography variant="body1" className="section-description">
                Thousands of students from universities across Uzbekistan are
                using our platform to improve their reading comprehension
                skills. Read their real experiences and feedback.
              </Typography>
              <Box className="check-list">
                <Box className="check-item">
                  <CheckCircleIcon className="check-icon" />
                  <Typography variant="body1">
                    Real reviews from actual users
                  </Typography>
                </Box>
                <Box className="check-item">
                  <CheckCircleIcon className="check-icon" />
                  <Typography variant="body1">
                    Students from Uzbekistan universities
                  </Typography>
                </Box>
              </Box>
              <Button className="learn-more-btn" onClick={handleGetStarted}>
                Learn More
              </Button>
            </Box>
          </Box>
        </Container>
      </section>

      {/* Analytics Section */}
      <section className="analytics-section" id="services">
        <Container maxWidth="lg">
          <Box className="analytics-content">
            <Box className="analytics-left">
              <Typography variant="h2" className="section-title">
                Analytics your daily, weekly and monthly activity
              </Typography>
              <Typography variant="body1" className="section-description">
                Track your reading progress with comprehensive analytics that
                show your daily, weekly, and monthly performance metrics.
              </Typography>
              <Box className="check-list">
                <Box className="check-item">
                  <CheckCircleIcon className="check-icon" />
                  <Typography variant="body1">
                    Get real-time updates on your progress
                  </Typography>
                </Box>
                <Box className="check-item">
                  <CheckCircleIcon className="check-icon" />
                  <Typography variant="body1">
                    Track activity and performance metrics
                  </Typography>
                </Box>
              </Box>
              <Button className="learn-more-btn" onClick={handleGetStarted}>
                Learn More
              </Button>
            </Box>

            <Box className="analytics-right">
              <Card className="analytics-card">
                <CardContent>
                  <Typography variant="h5" className="analytics-title">
                    Course Statistics
                  </Typography>
                  <Box className="chart-container">
                    <CircularProgress
                      variant="determinate"
                      value={80}
                      size={120}
                      className="chart-segment lesson"
                    />
                    <CircularProgress
                      variant="determinate"
                      value={20}
                      size={120}
                      className="chart-segment completed"
                    />
                    <CircularProgress
                      variant="determinate"
                      value={30}
                      size={120}
                      className="chart-segment task"
                    />
                  </Box>
                  <Box className="chart-legend">
                    <Box className="legend-item">
                      <Box className="legend-color lesson"></Box>
                      <Typography variant="body2">Lesson (80%)</Typography>
                    </Box>
                    <Box className="legend-item">
                      <Box className="legend-color completed"></Box>
                      <Typography variant="body2">Completed (20%)</Typography>
                    </Box>
                    <Box className="legend-item">
                      <Box className="legend-color task"></Box>
                      <Typography variant="body2">Task (30%)</Typography>
                    </Box>
                  </Box>
                  <Box className="stats-info">
                    <Typography variant="h6" className="stat-info">
                      2 Courses in progress
                    </Typography>
                    <Typography variant="h6" className="stat-info">
                      5.5 Hours spent this week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <Container maxWidth="lg">
          <Box className="cta-content">
            <Typography variant="h3" className="cta-question">
              Are you ready to start your reading journey now!
            </Typography>
            <Box className="cta-buttons">
              <Button className="cta-btn-white" onClick={handleGetStarted}>
                Let's Get Started
              </Button>
              <Button className="cta-btn-teal" onClick={handleGetStarted}>
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="contact">
        <Container maxWidth="lg">
          <Box className="footer-content">
            <Box className="footer-column">
              <Box className="footer-logo">
                <SchoolIcon className="logo-icon" />
                <Typography variant="h6" className="logo-text">
                  ESPREADING
                </Typography>
              </Box>
              <Typography variant="body2" className="footer-description">
                A comprehensive platform designed to help university students
                improve their reading comprehension skills through interactive
                exercises and detailed analytics.
              </Typography>
              <Box className="footer-social">
                <IconButton className="social-icon">
                  <FacebookIcon />
                </IconButton>
                <IconButton className="social-icon">
                  <TwitterIcon />
                </IconButton>
                <IconButton className="social-icon">
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Box>

            <Box className="footer-column">
              <Typography variant="h6" className="footer-heading">
                Take a tour
              </Typography>
              <a href="#features" className="footer-link">
                Features
              </a>
              <a href="#pricing" className="footer-link">
                Pricing
              </a>
              <a href="#product" className="footer-link">
                Product
              </a>
              <a href="#support" className="footer-link">
                Support
              </a>
            </Box>

            <Box className="footer-column">
              <Typography variant="h6" className="footer-heading">
                Our company
              </Typography>
              <a href="#about" className="footer-link">
                About Us
              </a>
              <a href="#blog" className="footer-link">
                Blog
              </a>
              <a href="#media" className="footer-link">
                Media
              </a>
              <a href="#contact" className="footer-link">
                Contact Us
              </a>
            </Box>

            <Box className="footer-column">
              <Typography variant="h6" className="footer-heading">
                Subscribe
              </Typography>
              <Typography variant="body2" className="footer-description">
                Subscribe to get the latest news from us.
              </Typography>
              <Box className="footer-email">
                <TextField
                  placeholder="Enter your email..."
                  variant="outlined"
                  size="small"
                  className="footer-input"
                />
                <IconButton className="footer-arrow">
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box className="footer-bottom">
            <Typography variant="body2" className="copyright">
              Copyright @2024. Crafted with love.
            </Typography>
          </Box>
        </Container>
      </footer>
    </Box>
  );
};

export default Landing;

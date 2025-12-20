"use client";
import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  Chip,
  Divider,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
} from "@mui/icons-material";
import Link from "next/link";


const COLORS = {
  lightBg: "#F9F8F6",
  sectionBg: "#EFE9E3",
  border: "#D9CFC7",
  primary: "#C9B59C",
  text: "#5D4037",
  textLight: "#8D6E63",
  textMuted: "#A1887F",
  success: "#10B981",
  white: "#FFFFFF",
};

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

 
  const handleChange = () => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = () => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }

    setTimeout(() => {
      setSubmitted(true);
      setError("");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000); 
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <LocationOn />,
      title: "Visit Us",
      details: ["123 Main Street", "Lahore, Pakistan 54000"],
    },
    {
      icon: <Phone />,
      title: "Call Us",
      details: ["+92 300 1234567", "Mon-Sat: 9AM - 6PM"],
    },
    {
      icon: <Email />,
      title: "Email Us",
      details: ["support@yourstore.pk", "We reply within 24 hours"],
    },
    {
      icon: <AccessTime />,
      title: "Working Hours",
      details: ["Monday - Saturday", "9:00 AM - 6:00 PM"],
    },
  ];

  return (
    <Box sx={{ bgcolor: COLORS.lightBg, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: COLORS.sectionBg,
            borderRadius: 4,
            p: { xs: 6, md: 10 },
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            mb: 8,
            "&::before": {
              content: '""',
              position: "absolute",
              top: -80,
              left: -80,
              width: 250,
              height: 250,
              borderRadius: "50%",
              bgcolor: COLORS.primary,
              opacity: 0.1,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -120,
              right: -120,
              width: 320,
              height: 320,
              borderRadius: "50%",
              bgcolor: COLORS.primary,
              opacity: 0.08,
            },
          }}
        >
          <Chip
            label="Get in Touch"
            sx={{
              bgcolor: COLORS.primary,
              color: "white",
              fontWeight: 600,
              mb: 3,
              py: 2.5,
              fontSize: "0.95rem",
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.8rem", md: "4.2rem" },
              color: COLORS.text,
              mb: 3,
              lineHeight: 1.1,
            }}
          >
            We&apos;d Love to
            <Box
              component="span"
              sx={{ color: COLORS.primary, display: "block" }}
            >
              Hear From You
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: COLORS.textLight,
              maxWidth: "750px",
              mx: "auto",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Have a question? Need help with an order? Our team is here to assist
            you 24/7.
          </Typography>
        </Box>

        {/* Contact Info Cards */}
        <Grid
          container
          spacing={4}
          sx={{ mb: 10, display: "flex", justifyContent: "center" }}
        >
          {contactInfo.map((info, i) => (
            <Grid
              item
              key={i}
              sx={{ width: "auto" }}
            >
              <Box
                sx={{
                  bgcolor: COLORS.white,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 3,
                  p: 4,
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.07)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    bgcolor: COLORS.sectionBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    color: COLORS.primary,
                  }}
                >
                  {React.cloneElement(info.icon, { sx: { fontSize: 36 } })}
                </Box>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: COLORS.text, mb: 2 }}
                >
                  {info.title}
                </Typography>

                {info.details.map((line, idx) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{
                      color: idx === 0 ? COLORS.text : COLORS.textLight,
                      fontWeight: idx === 0 ? 600 : 400,
                      mb: 0.5,
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 8, borderColor: COLORS.border }} />

        {/* Contact Form + Map - Column Layout */}
        <Grid container spacing={6} sx={{ mb: 10 }}>
          {/* Form - Full Width, Vertical Column */}
          <Grid
            item
            xs={12}
            lg={7}
            sx={{
              width: { lg: "60%", xs: "100%" }, 
            }}
          >
            <Box
              sx={{
                bgcolor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
                p: { xs: 4, md: 6 },
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: COLORS.text, mb: 4 }}
              >
                Send Us a Message
              </Typography>

              {submitted && (
                <Alert
                  icon={<CheckCircle />}
                  severity="success"
                  sx={{
                    mb: 3,
                    bgcolor: `${COLORS.success}10`,
                    border: `1px solid ${COLORS.success}`,
                  }}
                >
                  Thank you! Your message has been sent successfully. We&apos;ll
                  get back to you soon.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                {/* All Fields in One Column */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Your Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: COLORS.sectionBg,
                        "&:hover": { bgcolor: COLORS.sectionBg },
                        "&.Mui-focused": { bgcolor: COLORS.white },
                      },
                      "& .MuiInputLabel-root": { color: COLORS.textLight },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: COLORS.sectionBg,
                        "&:hover": { bgcolor: COLORS.sectionBg },
                        "&.Mui-focused": { bgcolor: COLORS.white },
                      },
                      "& .MuiInputLabel-root": { color: COLORS.textLight },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="subject"
                    label="Subject (Optional)"
                    value={formData.subject}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: COLORS.sectionBg,
                        "&:hover": { bgcolor: COLORS.sectionBg },
                        "&.Mui-focused": { bgcolor: COLORS.white },
                      },
                      "& .MuiInputLabel-root": { color: COLORS.textLight },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="message"
                    label="Your Message *"
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: COLORS.sectionBg,
                        "&:hover": { bgcolor: COLORS.sectionBg },
                        "&.Mui-focused": { bgcolor: COLORS.white },
                      },
                      "& .MuiInputLabel-root": { color: COLORS.textLight },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<Send />}
                    sx={{
                      bgcolor: COLORS.primary,
                      color: "white",
                      px: 6,
                      py: 1.8,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      boxShadow: "0 10px 25px rgba(201, 181, 156, 0.3)",
                      "&:hover": {
                        bgcolor: COLORS.text,
                        transform: "translateY(-3px)",
                        boxShadow: "0 15px 30px rgba(93, 64, 55, 0.25)",
                      },
                      alignSelf: "flex-start",
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Map / Location */}
          <Grid
            item
            xs={12}
            lg={5}
            sx={{
              width: { lg: "35%", xs: "100%" }, 
            }}
          >
            <Box
              sx={{
                bgcolor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
                p: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: COLORS.text, mb: 3 }}
              >
                Find Us Here
              </Typography>

              <Box
                sx={{
                  height: 300,
                  bgcolor: COLORS.sectionBg,
                  borderRadius: 2,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: COLORS.textLight,
                  border: `2px dashed ${COLORS.border}`,
                }}
              >
                <LocationOn
                  sx={{ fontSize: 48, mb: 2, color: COLORS.primary }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Store Location
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", maxWidth: "80%" }}
                >
                  123 Main Street, Lahore, Pakistan
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.textLight, mb: 2 }}
                >
                  Follow us on social media
                </Typography>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Link href="https://facebook.com" target="_blank" passHref>
                    <IconButton
                      sx={{
                        bgcolor: COLORS.sectionBg,
                        color: COLORS.primary,
                        "&:hover": { bgcolor: COLORS.primary, color: "white" },
                      }}
                    >
                      <Facebook />
                    </IconButton>
                  </Link>
                  <Link href="https://instagram.com" target="_blank" passHref>
                    <IconButton
                      sx={{
                        bgcolor: COLORS.sectionBg,
                        color: COLORS.primary,
                        "&:hover": { bgcolor: COLORS.primary, color: "white" },
                      }}
                    >
                      <Instagram />
                    </IconButton>
                  </Link>
                  <Link href="https://twitter.com" target="_blank" passHref>
                    <IconButton
                      sx={{
                        bgcolor: COLORS.sectionBg,
                        color: COLORS.primary,
                        "&:hover": { bgcolor: COLORS.primary, color: "white" },
                      }}
                    >
                      <Twitter />
                    </IconButton>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Final CTA */}
        <Box
          sx={{
            bgcolor: COLORS.primary,
            borderRadius: 4,
            p: { xs: 6, md: 8 },
            textAlign: "center",
            color: "white",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              opacity: 0.15,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: "2.2rem", md: "3rem" },
              }}
            >
              Need Help Right Now?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 5, maxWidth: "700px", mx: "auto", opacity: 0.95 }}
            >
              Chat with us on WhatsApp or call +92 300 1234567
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="https://wa.me/923001234567" target="_blank" passHref>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Phone />}
                  sx={{
                    bgcolor: "white",
                    color: COLORS.primary,
                    px: 5,
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: COLORS.lightBg,
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  WhatsApp Us
                </Button>
              </Link>

              <Link href="tel:+923001234567" passHref>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Phone />}
                  sx={{
                    border: "2px solid white",
                    color: "white",
                    px: 5,
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.15)",
                      borderColor: "white",
                    },
                  }}
                >
                  Call Now
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

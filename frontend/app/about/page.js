'use client'
import React from 'react'
import { Container, Typography, Grid, Box, Button, Chip, Divider } from '@mui/material'
import { 
  LocalShipping, 
  Shield, 
  SupportAgent, 
  VerifiedUser,
  Favorite,
  Star,
  People,
  EmojiEvents
} from '@mui/icons-material'
import Link from 'next/link'

// Color Theme
const COLORS = {
  lightBg: '#F9F8F6',
  sectionBg: '#EFE9E3',
  border: '#D9CFC7',
  primary: '#C9B59C',
  text: '#5D4037',
  textLight: '#8D6E63',
  textMuted: '#A1887F',
  white: '#FFFFFF',
}

export default function AboutUs() {
  const team = [
    { name: "Ahmed Khan", role: "Founder & CEO", icon: <People /> },
    { name: "Ayesha Malik", role: "Head of Design", icon: <Star /> },
    { name: "Usman Ali", role: "Product Manager", icon: <EmojiEvents /> },
    { name: "Sana Raza", role: "Customer Success", icon: <Favorite /> },
  ]

  const values = [
    { icon: <VerifiedUser />, title: "Quality First", desc: "We source only premium, authentic products" },
    { icon: <LocalShipping />, title: "Fast Delivery", desc: "Same-day dispatch on all orders" },
    { icon: <Shield />, title: "100% Secure", desc: "Your data & payments are fully protected" },
    { icon: <SupportAgent />, title: "24/7 Support", desc: "Real humans, always ready to help" },
  ]

  return (
    <Box sx={{ bgcolor: COLORS.lightBg, minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>

        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: COLORS.sectionBg,
            borderRadius: 4,
            p: { xs: 6, md: 10 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            mb: 8,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -60,
              left: -60,
              width: 220,
              height: 220,
              borderRadius: '50%',
              bgcolor: COLORS.primary,
              opacity: 0.1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              bgcolor: COLORS.primary,
              opacity: 0.08,
            }
          }}
        >
          <Chip 
            label="Our Story" 
            sx={{ 
              bgcolor: COLORS.primary, 
              color: 'white', 
              fontWeight: 600, 
              mb: 3,
              py: 2.5,
              fontSize: '0.95rem'
            }} 
          />
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2.8rem', md: '4.2rem' }, 
              color: COLORS.text,
              mb: 3,
              lineHeight: 1.1
            }}
          >
            We Believe in
            <Box component="span" sx={{ color: COLORS.primary, display: 'block' }}>
              Quality & Trust
            </Box>
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: COLORS.textLight, 
              maxWidth: '750px', 
              mx: 'auto', 
              lineHeight: 1.7,
              fontWeight: 400
            }}
          >
            Founded in 2020, we started with a simple idea: deliver premium products with exceptional service. 
            Today, we serve over 10,000+ happy customers across Pakistan.
          </Typography>
        </Box>



      </Container>
    </Box>
  )
}
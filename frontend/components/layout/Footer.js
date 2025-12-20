import React from 'react'
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  Shield,
  Truck,
  Clock,
  Award,
} from 'lucide-react'


const COLORS = {
  primary: '#C9B59C',
  lightBg: '#F9F8F6',
  secondaryBg: '#EFE9E3',
  border: '#D9CFC7',
  text: '#5D4037',
  textLight: '#8D6E63',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
}

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', href: '/products' },
        { name: 'New Arrivals', href: '/products?filter=new' },
        { name: 'Best Sellers', href: '/products?filter=bestsellers' },
        { name: 'Sale', href: '/products?filter=sale' },
        { name: 'Gift Cards', href: '/gift-cards' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns & Exchanges', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Affiliate Program', href: '/affiliate' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Accessibility', href: '/accessibility' },
      ],
    },
  ]

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '256-bit encryption',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Always here to help',
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: '30-day returns',
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  return (
    <footer 
      className="relative overflow-hidden"
      style={{ backgroundColor: COLORS.lightBg }}
    >
      {/* Features Section */}
      <div 
        className="border-b"
        style={{ borderColor: COLORS.border }}
      >
        <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl transition-all hover:shadow-md"
                style={{ backgroundColor: COLORS.secondaryBg }}
              >
                <div 
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 
                  className="font-semibold mb-1"
                  style={{ color: COLORS.text }}
                >
                  {feature.title}
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: COLORS.textLight }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: COLORS.primary }}
              >
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span 
                className="text-2xl font-bold"
                style={{ color: COLORS.text }}
              >
                ShopHub
              </span>
            </div>
            <p 
              className="mb-6 max-w-md"
              style={{ color: COLORS.textLight }}
            >
              Your one-stop destination for premium quality products. We're committed to providing exceptional customer service and sustainable shopping experiences.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" style={{ color: COLORS.primary }} />
                <span style={{ color: COLORS.textLight }}>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" style={{ color: COLORS.primary }} />
                <span style={{ color: COLORS.textLight }}>support@shophub.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" style={{ color: COLORS.primary }} />
                <span style={{ color: COLORS.textLight }}>123 Commerce St, City, State 12345</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 rounded-lg transition-all hover:shadow-md"
                  style={{ 
                    backgroundColor: COLORS.secondaryBg,
                    color: COLORS.text
                  }}
                  aria-label={social.label}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.secondaryBg;
                    e.currentTarget.style.color = COLORS.text;
                  }}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 
                className="font-semibold mb-4"
                style={{ color: COLORS.text }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="transition-colors hover:underline"
                      style={{ color: COLORS.textLight }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = COLORS.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = COLORS.textLight;
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        className="border-t py-6"
        style={{ 
          backgroundColor: COLORS.secondaryBg,
          borderColor: COLORS.border
        }}
      >
        <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2">
              <span 
                className="text-sm"
                style={{ color: COLORS.textLight }}
              >
                © 2024 ShopHub. All rights reserved.
              </span>
              <span 
                className="hidden md:inline"
                style={{ color: COLORS.border }}
              >
                •
              </span>
              <span 
                className="hidden md:inline text-sm"
                style={{ color: COLORS.textLight }}
              >
                Made with <Heart className="w-3 h-3 inline mx-1" style={{ color: COLORS.error }} /> for our customers
              </span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center gap-6">
              <a
                href="/privacy"
                className="text-sm transition-colors hover:underline"
                style={{ color: COLORS.textLight }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.textLight;
                }}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm transition-colors hover:underline"
                style={{ color: COLORS.textLight }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.textLight;
                }}
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-sm transition-colors hover:underline"
                style={{ color: COLORS.textLight }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.textLight;
                }}
              >
                Cookies
              </a>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:shadow-md"
              style={{ 
                backgroundColor: COLORS.primary,
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Top</span>
            </button>
          </div>
        </div>
      </div>


    </footer>
  )
}

export default Footer
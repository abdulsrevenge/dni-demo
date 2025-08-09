// config/config.example.js
// Copy this file to config.<prospect>.js and edit values as needed.

window.DNI_CONFIG = {
  brand: {
    name: "Prospect Name",
    logo: "assets/img/logo.png", // Path to logo image
    colors: {
      primary: "#c40404", // Primary brand color
      secondary: "#ffcc00" // Secondary brand color
    }
  },
  tracking: {
    defaultNumber: "1-800-000-0000",
    dniRules: [
      { pattern: "*/checking/*", pool: "session" },
      { pattern: "*/checking/initiate/*", pool: "session" },
      { pattern: "*/checking/optimize/*", pool: "session" }
    ]
  },
  content: {
    landingPageHeadline: "Your headline here",
    ctaText: "Call now to get started"
  }
};

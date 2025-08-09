window.DNI_CONFIG = {
  brand: {
    name: "Wells Fargo Business Banking",
    logo: "assets/img/wellsfargo-logo.png",
    colors: {
      primary: "#c40404",
      secondary: "#ffcc00"
    }
  },
  tracking: {
    defaultNumber: "1-800-416-8658",
    dniRules: [
      { pattern: "*/checking/*", pool: "session" },
      { pattern: "*/checking/initiate/*", pool: "session" },
      { pattern: "*/checking/optimize/*", pool: "session" }
    ]
  },
  content: {
    landingPageHeadline: "Empower Your Business with the Right Account",
    ctaText: "Call now to get started"
  }
};

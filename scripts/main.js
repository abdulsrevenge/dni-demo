// assets/js/main.js
document.addEventListener("DOMContentLoaded", function() {
  if (!window.DNI_CONFIG) {
    console.error("No DNI_CONFIG loaded!");
    return;
  }

  // Apply branding
  document.querySelector("header .brand-name").textContent = DNI_CONFIG.brand.name;
  document.querySelector("header").style.backgroundColor = DNI_CONFIG.brand.colors.primary;
  document.documentElement.style.setProperty("--primary-color", DNI_CONFIG.brand.colors.primary);
  document.documentElement.style.setProperty("--secondary-color", DNI_CONFIG.brand.colors.secondary);

  const logoImg = document.querySelector("header img.brand-logo");
  if (logoImg) {
    logoImg.src = DNI_CONFIG.brand.logo;
  }

  // Example: set headline and CTA
  const headline = document.querySelector("#headline");
  if (headline) headline.textContent = DNI_CONFIG.content.landingPageHeadline;

  const cta = document.querySelector("#cta-button");
  if (cta) cta.textContent = DNI_CONFIG.content.ctaText;
});

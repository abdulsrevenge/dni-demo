import { tracking } from './tracking.js';
import { applyDniForPage } from './dni.js';
import { loadMarchex } from './marchex.js';
import { initNavigation } from './navigation.js';
import { initUI } from './ui.js';
import { simulateCallInit } from './simulate-call.js';

(async function main() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const configFile = urlParams.get('config') || 'config/prospect.json';

    const res = await fetch(configFile);
    if (!res.ok) throw new Error('Could not load config: ' + configFile);
    const config = await res.json();

    applyBrandColors(config.brand);

    tracking.set('source', config.demo.defaultSource || tracking.state.source);
    tracking.set('campaign', config.demo.defaultCampaign || tracking.state.campaign);
    tracking.set('trackingIdentifier', config.demo.trackingIdentifier || '');

    tracking.generateTrackingNumber();
    tracking.generateSessionId(tracking.state.source, tracking.state.campaign);
    tracking.generateClickId(tracking.state.source);

    initUI(config, tracking);
    initNavigation(config, tracking, {
      onPageChange: (pageKey) => {
        applyDniForPage(pageKey, config, tracking);
      }
    });

    const isPaid = tracking.state.campaign === 'paid';
    loadMarchex(isPaid, config.demo.trackingIdentifier, tracking);

    window.__simulateCall = (productPage) => simulateCallInit(productPage, config, tracking);

  } catch (err) {
    console.error('App bootstrap failed:', err);
    document.getElementById('app-root').innerHTML = `<div class="m-3 alert alert-danger">Failed to load demo: ${err.message}</div>`;
  }
})();

function applyBrandColors(brand) {
  if (!brand || !brand.colors) return;
  const root = document.documentElement;
  Object.entries(brand.colors).forEach(([k, v]) => {
    root.style.setProperty(k, v);
  });
}

export const tracking = (function() {
  const state = {
    sessionId: '',
    source: 'google',
    campaign: 'paid',
    trackingType: 'session',
    trackingNumber: '',
    trackingNumberPremium: '',
    currentPage: 'search',
    clickId: '',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'bizbanking_2025_q2',
    utmTerm: 'small business checking account',
    trackingIdentifier: ''
  };

  const listeners = new Set();

  function notify() {
    listeners.forEach(fn => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  function generateTrackingNumber(prefix = '800') {
    const middle = Math.floor(Math.random() * 900) + 100;
    const last = Math.floor(Math.random() * 9000) + 1000;
    state.trackingNumber = `${prefix}-${middle}-${last}`;
    notify();
    return state.trackingNumber;
  }

  function generateTrackingNumberPremium(prefix = '800') {
    const middle = Math.floor(Math.random() * 900) + 100;
    const last = Math.floor(Math.random() * 9000) + 1000;
    state.trackingNumberPremium = `${prefix}-${middle}-${last}`;
    notify();
    return state.trackingNumberPremium;
  }

  function generateSessionId(source, campaign) {
    const randomNum = Math.floor(Math.random() * 100000);
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const prefix = `WF_${campaign === 'paid' ? 'SEM_' : 'ORG_'}`;
    state.sessionId = `${prefix}${y}_${m}_${d}_${randomNum}`;
    notify();
    return state.sessionId;
  }

  function generateClickId(source) {
    const random = Math.random().toString(36).substring(2, 15);
    switch (source) {
      case 'google': state.clickId = `gclid=Cj0KCQjwrMKmBhD0ARIsAKcl6jdP${random}`; break;
      case 'facebook': state.clickId = `fbclid=IwAR2DfN7Zd5qSdD_${random}`; break;
      case 'microsoft': state.clickId = `msclkid=7f31a8d${random}`; break;
      default: state.clickId = ''; break;
    }
    notify();
    return state.clickId;
  }

  function set(k, v) {
    state[k] = v;
    notify();
  }

  return {
    state,
    subscribe,
    generateTrackingNumber,
    generateTrackingNumberPremium,
    generateSessionId,
    generateClickId,
    set
  };
})();
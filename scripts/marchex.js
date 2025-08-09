export function loadMarchex(isPaid, identifier, tracking) {
  const container = document.getElementById('marchex-script-container') || createContainer();
  container.innerHTML = ''; // clear old script

  try {
    localStorage.setItem('demoReferrer', tracking.state.source);
  } catch(e) { console.warn('localStorage not available', e); }

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  const id = identifier || '';
  script.src = `//js.web-2-tel.com/sdk?identifier=${encodeURIComponent(id)}`;
  container.appendChild(script);

  console.log('Marchex loader invoked', { source: tracking.state.source, isPaid, clickId: tracking.state.clickId, campaign: tracking.state.utmCampaign });
}

function createContainer() {
  const div = document.createElement('div');
  div.id = 'marchex-script-container';
  document.body.appendChild(div);
  return div;
}
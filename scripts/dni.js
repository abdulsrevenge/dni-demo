export function applyDniForPage(pageKey, config, tracking) {
  const urlPath = config.pages && config.pages[pageKey] && config.pages[pageKey].urlDisplay
    ? config.pages[pageKey].urlDisplay
    : pageKey;

  const rules = config.dniRules || [];
  let matched = null;

  for (const r of rules) {
    const pattern = '^' + r.pattern.split('*').map(escapeRegExp).join('.*') + '$';
    const re = new RegExp(pattern);
    if (re.test(urlPath) || re.test(pageKey) || (r.pattern.indexOf(urlPath) > -1)) {
      matched = r;
      break;
    }
  }

  if (matched) {
    if (!tracking.state.trackingNumber) tracking.generateTrackingNumber();
    tracking.set('currentPage', pageKey);
    tracking.set('trackingNumber', tracking.state.trackingNumber);
  } else {
    tracking.set('currentPage', pageKey);
  }
}

function escapeRegExp(s) {
  return s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
}
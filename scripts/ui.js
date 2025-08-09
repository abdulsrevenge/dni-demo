import { loadMarchex } from './marchex.js';
import { applyDniForPage } from './dni.js';
import { simulateCallInit } from './simulate-call.js';

export function initUI(config, tracking) {
  renderDniRules(config);
  renderSiteTemplates(config);
  wireUI(config, tracking);
  tracking.subscribe((state) => updateTrackingPanel(state, config));
  updateTrackingPanel(tracking.state, config);
}

function renderDniRules(config) {
  const tbody = $('#dni-rules-table tbody');
  tbody.empty();
  (config.dniRules || []).forEach(r => {
    const row = `<tr><td>${escapeHTML(r.pattern)}</td><td>${escapeHTML(r.original)}</td><td>${escapeHTML(r.pool)}</td></tr>`;
    tbody.append(row);
  });
}

function renderSiteTemplates(config) {
  const panel = $('#website-panel');
  const searchHtml = `
    <div id="search-page" class="p-3">
      <div class="page-display"><i class="fas fa-globe mr-1"></i><span id="url-display">${escapeHTML(config.pages.search.urlDisplay)}</span></div>
      <div class="form-group"><div class="input-group mb-3">
        <input type="text" class="form-control" value="small business checking account" readonly />
        <div class="input-group-append"><button class="btn wf-search-btn">Search</button></div>
      </div></div>
      <div class="search-results">
        <div id="ad-result" class="card mb-3 wf-ad" style="cursor:pointer;"><div class="card-body">
          <span class="badge badge-success">Ad</span>
          <h5 class="text-primary">Small Business Checking | ${escapeHTML(config.brand.name)}</h5>
          <div class="text-success">wellsfargo.com/biz/</div>
          <p>Open a Business Checking Account with ${escapeHTML(config.brand.name)}.</p>
        </div></div>
        <div class="card mb-3"><div class="card-body"><h5 class="text-primary">Best Small Business Checking Accounts of 2025</h5><div class="text-success">www.nerdwallet.com</div><p>Compare options.</p></div></div>
      </div>
    </div>
  `;

  const landingHtml = `
    <div id="main-landing-page" class="p-3" style="display:none;">
      <div class="page-display"><i class="fas fa-lock mr-1"></i><span id="url-display-landing">${escapeHTML(config.pages.landing.urlDisplay)}</span></div>
      <div class="nav mb-3 wf-tablist">
        <a href="#" class="nav-link active">Home</a>
        <a href="#" id="go-to-checking" class="nav-link">Checking</a>
      </div>
      <div class="jumbotron text-center bg-light">
        <h1 class="display-5">Let's Grow Your Business, Together</h1>
        <p class="lead">Find the right financial solutions for your business needs.</p>
        <button id="explore-checking" class="btn wf-btn mt-3">Explore Business Checking</button>
      </div>
    </div>
  `;

  const checkingHtml = `
    <div id="checking-overview-page" class="p-3" style="display:none;">
      <div class="page-display"><i class="fas fa-lock mr-1"></i><span id="url-display-checking">${escapeHTML(config.pages.checking.urlDisplay)}</span></div>
      <div class="nav mb-3 wf-tablist">
        <a href="#" id="back-to-main" class="nav-link">Home</a>
        <a href="#" class="nav-link active">Checking</a>
      </div>
      <h2>Small Business Checking Accounts</h2>
      <div class="row mb-4">
        <div class="col-md-4"><div id="go-to-initiate" class="card h-100 account-card" style="cursor:pointer;"><div class="card-body">
          <span class="badge feature-badge mb-2">Basic</span><h5 class="card-title">Initiate Business Checking</h5><p>For small businesses.</p><small class="text-muted d-block mt-2">Click this card to explore Initiate</small>
        </div></div></div>

        <div class="col-md-4"><div id="go-to-navigate" class="card h-100 account-card" style="cursor:pointer;"><div class="card-body">
          <span class="badge feature-badge mb-2">Popular</span><h5 class="card-title">Navigate Business Checking</h5><p>For growing businesses.</p><small class="text-muted d-block mt-2">Click this card to explore Navigate</small>
        </div></div></div>

        <div class="col-md-4"><div id="go-to-optimize" class="card h-100 account-card" style="cursor:pointer;"><div class="card-body">
          <span class="badge feature-badge mb-2">Premium</span><h5 class="card-title">Optimize Business Checking</h5><p>For established businesses.</p><small class="text-muted d-block mt-2">Click this card to explore Optimize</small>
        </div></div></div>
      </div>

      <div class="text-center p-3 border rounded">
        <p>Questions about business checking? Call our small business specialists:</p>
        <h4 id="overview-number" class="phone-number">1-800-416-8658</h4>
        <p>Monday - Friday: 8am - 8pm (Central Time)</p>
      </div>
    </div>
  `;

  const initiateHtml = `
    <div id="initiate-page" class="p-3" style="display:none;">
      <div class="page-display"><i class="fas fa-lock mr-1"></i><span id="url-display-initiate">${escapeHTML(config.pages.initiate.urlDisplay)}</span></div>
      <div class="nav mb-3 wf-tablist"><a href="#" id="back-to-main-initiate" class="nav-link">Home</a><a href="#" id="back-to-checking-initiate" class="nav-link">Checking</a></div>
      <h2>Initiate Business Checking</h2>
      <div class="row"><div class="col-md-8">
        <p>Basic checking designed for small businesses.</p>
        <div class="mt-4 p-3 border rounded">
          <p>Questions about Initiate Business Checking? Call our specialists:</p>
          <h4 id="initiate-number" class="phone-number">1-800-416-8658</h4>
        </div>
        <button class="btn btn-outline-primary mt-3 mb-3" id="simulate-call-initiate"><i class="fas fa-phone mr-1"></i> Simulate Making a Call</button>
      </div></div>
    </div>
  `;

  const navigateHtml = `
    <div id="navigate-page" class="p-3" style="display:none;">
      <div class="page-display"><i class="fas fa-lock mr-1"></i><span id="url-display-navigate">${escapeHTML(config.pages.navigate.urlDisplay)}</span></div>
      <div class="nav mb-3 wf-tablist"><a href="#" id="back-to-main-2" class="nav-link">Home</a><a href="#" id="back-to-checking" class="nav-link">Checking</a></div>
      <h2>Navigate Business Checking</h2>
      <div class="row"><div class="col-md-8">
        <p>A flexible checking account designed for growing businesses.</p>
        <div class="mt-4 p-3 border rounded">
          <p>Questions about Navigate Business Checking? Call our specialists:</p>
          <h4 id="navigate-number" class="phone-number">1-800-416-8658</h4>
        </div>
        <button class="btn btn-outline-primary mt-3 mb-3" id="simulate-call"><i class="fas fa-phone mr-1"></i> Simulate Making a Call</button>
      </div></div>
    </div>
  `;

  const optimizeHtml = `
    <div id="optimize-page" class="p-3" style="display:none;">
      <div class="page-display"><i class="fas fa-lock mr-1"></i><span id="url-display-optimize">${escapeHTML(config.pages.optimize.urlDisplay)}</span></div>
      <div class="nav mb-3 wf-tablist"><a href="#" id="back-to-main-3" class="nav-link">Home</a><a href="#" id="back-to-checking-2" class="nav-link">Checking</a></div>
      <h2>Optimize Business Checking</h2>
      <div class="row"><div class="col-md-8">
        <p>Premium checking with advanced features.</p>
        <div class="mt-4 p-3 border rounded">
          <p>Questions about Optimize Business Checking? Call our premium specialists:</p>
          <h4 id="optimize-number" class="phone-number">1-866-902-9181</h4>
        </div>
        <button class="btn btn-outline-primary mt-3 mb-3" id="simulate-call-optimize"><i class="fas fa-phone mr-1"></i> Simulate Making a Call</button>
      </div></div>
    </div>
  `;

  panel.append(searchHtml, landingHtml, checkingHtml, initiateHtml, navigateHtml, optimizeHtml);
}

function wireUI(config, tracking) {
  $('#website-panel').on('click', '#ad-result', function() {
    loadMarchex(true, config.demo.trackingIdentifier, tracking);
    showPage('landing');
    tracking.set('currentPage', 'landing');
    updateProgress('landing');
  });

  $('#website-panel').on('click', '#go-to-checking, #explore-checking', function() {
    showPage('checking');
    tracking.set('currentPage', 'checking');
    updateProgress('checking');
    applyDniForPage('checking', config, tracking);
  });

  $('#website-panel').on('click', '#go-to-initiate', function() { showPage('initiate'); applyDniForPage('initiate', config, tracking); updateProgress('initiate'); });
  $('#website-panel').on('click', '#go-to-navigate', function() { showPage('navigate'); applyDniForPage('navigate', config, tracking); updateProgress('navigate'); });
  $('#website-panel').on('click', '#go-to-optimize', function() { showPage('optimize'); applyDniForPage('optimize', config, tracking); updateProgress('optimize'); });

  $('#website-panel').on('click', '#back-to-main', function() { showPage('landing'); tracking.set('currentPage','landing'); updateProgress('landing'); });
  $('#website-panel').on('click', '#back-to-main-2,#back-to-main-initiate,#back-to-main-3', function() { showPage('landing'); tracking.set('currentPage','landing'); updateProgress('landing'); });
  $('#website-panel').on('click', '#back-to-checking-initiate,#back-to-checking,#back-to-checking-2', function() { showPage('checking'); tracking.set('currentPage','checking'); updateProgress('checking'); });

  $('#website-panel').on('click', '#simulate-call', function(){ simulateCallInit('navigate', config, tracking); });
  $('#website-panel').on('click', '#simulate-call-initiate', function(){ simulateCallInit('initiate', config, tracking); });
  $('#website-panel').on('click', '#simulate-call-optimize', function(){ simulateCallInit('optimize', config, tracking); });

  $('#app-root').on('click', '.traffic-source-btn[data-source]', function() {
    $('.traffic-source-btn[data-source]').removeClass('active');
    $(this).addClass('active');
    const src = $(this).data('source');
    tracking.set('source', src);
    tracking.set('utmSource', src);
    tracking.generateClickId(src);
    tracking.generateSessionId(src, tracking.state.campaign);
    try { localStorage.setItem('demoReferrer', src); } catch(e){}
    if ($('#marchex-script-container').children().length > 0) loadMarchex(tracking.state.campaign === 'paid', config.demo.trackingIdentifier, tracking);
  });

  $('#app-root').on('click', '.traffic-source-btn[data-campaign]', function() {
    $('.traffic-source-btn[data-campaign]').removeClass('active');
    $(this).addClass('active');
    const c = $(this).data('campaign');
    tracking.set('campaign', c);
    tracking.generateSessionId(tracking.state.source, c);
    if (c === 'organic') {
      tracking.set('utmMedium', 'organic');
      tracking.set('utmCampaign', '(not set)');
      tracking.set('utmTerm', '(not set)');
    } else {
      tracking.set('utmMedium', 'cpc');
      tracking.set('utmCampaign','bizbanking_2025_q2');
      tracking.set('utmTerm','small business checking account');
    }
    loadMarchex(tracking.state.campaign === 'paid', config.demo.trackingIdentifier, tracking);
  });

  $('#app-root').on('click', '.tracking-type-toggle .btn', function() {
    $('.tracking-type-toggle .btn').removeClass('active');
    $(this).addClass('active');
    const t = $(this).data('tracking');
    tracking.set('trackingType', t);
    if (t === 'channel') {
      tracking.set('trackingNumberPremium', tracking.state.trackingNumber);
    } else {
      tracking.generateTrackingNumberPremium();
    }
  });

  $('#app-root').on('click', '#reset-demo', function() {
    resetDemo(tracking, config);
  });

  $('#app-root').on('click', '#session-tab', function(e){ e.preventDefault(); switchTab('#session-data'); });
  $('#app-root').on('click', '#dni-tab', function(e){ e.preventDefault(); switchTab('#dni-data'); });
  $('#app-root').on('click', '#call-tab', function(e){ e.preventDefault(); switchTab('#call-data'); });
}

export function showPage(key) {
  $('#website-panel > div').hide();
  const mapping = {
    'search': '#search-page',
    'landing': '#main-landing-page',
    'checking': '#checking-overview-page',
    'initiate': '#initiate-page',
    'navigate': '#navigate-page',
    'optimize': '#optimize-page'
  };
  const selector = mapping[key];
  if (selector) $(selector).show();
}

function updateProgress(pageKey) {
  const w = { 'search':'25%','landing':'50%','checking':'75%','initiate':'100%','navigate':'100%','optimize':'100%' }[pageKey] || '25%';
  $('#progress-bar').css('width', w);
}

function updateTrackingPanel(state, config) {
  $('#session-id').text(state.sessionId || '');
  $('#traffic-source').text(state.source || '');
  $('#utm-source').text(state.utmSource || '');
  $('#utm-medium').text(state.utmMedium || '');
  $('#utm-campaign').text(state.utmCampaign || '');
  $('#utm-term').text(state.utmTerm || '');
  $('#click-id').text(state.campaign === 'paid' ? state.clickId : '(not set)');

  const pageKey = state.currentPage || 'search';
  const pageText = (config.pages && config.pages[pageKey] && config.pages[pageKey].urlDisplay) ? config.pages[pageKey].urlDisplay : pageKey;
  $('#current-page').text(pageText);
  $('#current-stage').text('Stage: ' + (pageKey.charAt(0).toUpperCase() + pageKey.slice(1)));

  const matchedRule = (config.dniRules || []).find(r => pageMatchesRule(pageKey, r.pattern, config));
  if (matchedRule) {
    $('#original-number').text(matchedRule.original);
    $('#dni-rule-pattern').text(`Rule matched: ${matchedRule.pattern} → Replace ${matchedRule.original} with tracking number`);
  } else {
    $('#original-number').text('Not visible on page');
    $('#dni-rule-pattern').text('No active replacement');
  }

  const showTrackingNum = ['checking','initiate','navigate'].includes(pageKey);
  if (showTrackingNum && state.trackingNumber) {
    $('#tracking-number').text(state.trackingNumber);
    $('#overview-number').text(state.trackingNumber);
    $('#navigate-number').text(state.trackingNumber);
    $('#initiate-number').text(state.trackingNumber);
  } else if (pageKey === 'optimize' && state.trackingNumberPremium) {
    $('#tracking-number').text(state.trackingNumberPremium);
    $('#optimize-number').text(state.trackingNumberPremium);
  } else {
    $('#tracking-number').text('Not yet assigned');
  }
}

function pageMatchesRule(pageKey, pattern, config) {
  if (!pattern) return false;
  if (pattern.indexOf('*') === -1) return pageKey === pattern;
  return pattern.includes('checking') && pageKey.includes('checking');
}

function switchTab(tabId) {
  $('.panel-tab-content').removeClass('active');
  $(tabId).addClass('active');
  $('.wf-tablist .nav-link').removeClass('active');
  $(`a[href="${tabId}"]`).addClass('active');
}

function resetDemo(tracking, config) {
  $('#marchex-script-container').empty();
  showPage('search');
  tracking.generateTrackingNumber();
  tracking.generateTrackingNumberPremium();
  tracking.generateSessionId(tracking.state.source, tracking.state.campaign);
  tracking.generateClickId(tracking.state.source);
  tracking.set('currentPage','search');
  updateProgress('search');
}

function escapeHTML(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}

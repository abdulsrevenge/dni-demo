export function initNavigation(config, tracking, opts = {}) {
  const root = document.getElementById('app-root');
  root.innerHTML = renderShell(config);

  wireHandlers(config, tracking, opts);
  showPage('search');
  if (opts.onPageChange) opts.onPageChange('search');
}

function renderShell(config) {
  return `
    <div id="marchex-script-container"></div>
    <nav class="navbar navbar-dark" style="background-color: var(--wf-red);">
      <div class="container-fluid">
        <a class="navbar-brand" href="#"><div class="stagecoach"></div><span class="font-weight-bold">${escapeHTML(config.brand.name)}</span> Business Banking</a>
      </div>
    </nav>
    <div class="progress progress-indicator"><div id="progress-bar" class="progress-bar bg-success" role="progressbar" style="width:25%"></div></div>
    <div class="container-fluid"><div class="row">
      <div class="col-md-4 col-lg-3 p-0 tracking-panel">
        <div class="card border-0 rounded-0" id="demo-controls">
          <div class="card-header"><h5 class="mb-0">Demo Controls</h5></div>
          <div class="card-body">
            <div class="mb-3">
              <label class="font-weight-bold mb-2">1. Select Traffic Source:</label>
              <div class="btn-group btn-group-sm d-flex" role="group">
                <button type="button" class="btn btn-outline-primary traffic-source-btn active" data-source="google">Google</button>
                <button type="button" class="btn btn-outline-primary traffic-source-btn" data-source="facebook">Facebook</button>
                <button type="button" class="btn btn-outline-primary traffic-source-btn" data-source="microsoft">Microsoft</button>
              </div>
            </div>
            <div class="mb-3">
              <label class="font-weight-bold mb-2">2. Select Marketing Type:</label>
              <div class="btn-group btn-group-sm d-flex" role="group">
                <button type="button" class="btn btn-outline-primary traffic-source-btn active" data-campaign="paid">Paid Campaign</button>
                <button type="button" class="btn btn-outline-primary traffic-source-btn" data-campaign="organic">Organic Search</button>
              </div>
            </div>
            <div class="mb-3">
              <label class="font-weight-bold mb-2">3. Select Tracking Type:</label>
              <div class="btn-group btn-group-sm d-flex tracking-type-toggle" role="group">
                <button type="button" class="btn btn-outline-primary active" data-tracking="session">Session Tracking</button>
                <button type="button" class="btn btn-outline-primary" data-tracking="channel">Channel Tracking</button>
              </div>
            </div>
            <button id="reset-demo" class="btn btn-primary btn-sm btn-block mt-3">Reset Demo</button>
          </div>
        </div>

        <div class="card border-0 rounded-0 mt-2">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Marchex Tracking Data</h5>
            <span class="stage-badge" id="current-stage">Stage: Initial Search</span>
          </div>
          <div class="card-body p-0">
            <ul class="nav nav-tabs nav-justified wf-tablist" id="tracking-tabs" role="tablist">
              <li class="nav-item"><a class="nav-link active" id="session-tab" data-toggle="tab" href="#session-data" role="tab">Session Data</a></li>
              <li class="nav-item"><a class="nav-link" id="dni-tab" data-toggle="tab" href="#dni-data" role="tab">DNI Rules</a></li>
              <li class="nav-item"><a class="nav-link" id="call-tab" data-toggle="tab" href="#call-data" role="tab">Call Data</a></li>
            </ul>

            <div class="tab-content p-3">
              <div class="panel-tab-content active" id="session-data">
                <div class="data-source-indicator mb-3"><small><strong>Data Source:</strong> Marchex Session Tracking</small></div>
                <table class="table table-sm tracking-table"><tbody>
                  <tr><td width="40%">Session ID</td><td id="session-id">-</td></tr>
                  <tr class="highlight-tracking"><td>Traffic Source</td><td id="traffic-source">-</td></tr>
                  <tr><td>UTM Source</td><td id="utm-source">-</td></tr>
                  <tr><td>UTM Medium</td><td id="utm-medium">-</td></tr>
                  <tr><td>UTM Campaign</td><td id="utm-campaign">-</td></tr>
                  <tr><td>UTM Term</td><td id="utm-term">-</td></tr>
                  <tr class="highlight-tracking"><td>Click ID</td><td id="click-id">-</td></tr>
                  <tr><td>Landing Page</td><td id="current-page">-</td></tr>
                  <tr><td>Original Number</td><td id="original-number">Not yet visible</td></tr>
                  <tr class="highlight-tracking"><td>Tracking Number</td><td id="tracking-number">Not yet assigned</td></tr>
                </tbody></table>
              </div>

              <div class="panel-tab-content" id="dni-data">
                <div class="data-source-indicator mb-3"><small><strong>Data Source:</strong> Marchex DNI Configuration</small></div>
                <h6>Dynamic Number Insertion Rules</h6>
                <table class="table table-sm tracking-table" id="dni-rules-table"><thead><tr><th>Page Pattern</th><th>Original Number</th><th>Pool Type</th></tr></thead><tbody></tbody></table>

                <h6 class="mt-4 mb-2">Active Replacement Pattern</h6>
                <div class="alert alert-light border p-2"><small id="dni-rule-pattern">No active replacement</small></div>
              </div>

              <div class="panel-tab-content" id="call-data">
                <div class="data-source-indicator mb-3"><small><strong>Data Source:</strong> Marchex Call Analytics</small></div>
                <div class="text-center p-3 mb-3 bg-light border rounded">
                  <p class="mb-1"><small>A call would include all tracking data</small></p>
                  <h6 class="mb-0">No Call Made Yet</h6>
                </div>
                <div class="call-info-panel p-3" style="display:none" id="call-info">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-8 col-lg-9 p-0 website-panel" id="website-panel">
      </div>
    </div></div>
  `;
}

function wireHandlers(config, tracking, opts) {
}

function escapeHTML(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}
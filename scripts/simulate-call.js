export function simulateCallInit(productPage, config, tracking) {
  const now = new Date();
  const formatted = now.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric', hour12:true });
  const payload = {
    timestamp: formatted,
    duration: '4:28',
    source: tracking.state.campaign === 'paid' ? `${capitalize(tracking.state.source)} Ads` : `Organic ${capitalize(tracking.state.source)}`,
    campaign: tracking.state.campaign === 'paid' ? tracking.state.utmCampaign : '(not set)',
    keyword: tracking.state.campaign === 'paid' ? tracking.state.utmTerm : '(not set)',
    landing: `wellsfargo.com/biz/checking/${productPage}/`,
    recording: true,
    summary: config.copy.callSummaries[productPage] || 'Customer called about product.',
    intent: productPage === 'optimize' ? 'Premium Service Inquiry' : (productPage === 'initiate' ? 'Basic Account Inquiry' : 'New Account Inquiry'),
    outcome: productPage === 'optimize' ? 'Specialist Meeting Scheduled' : (productPage === 'initiate' ? 'Information Provided' : 'Appointment Scheduled')
  };

  const html = `
    <div class="text-center mb-3">
      <i class="fas fa-check-circle text-success" style="font-size:48px"></i>
      <h5 class="mt-3">Call Successfully Tracked by Marchex</h5>
    </div>
    <p>A call to the tracking number has been simulated. All the session data captured during this customer journey has been attached to the call record.</p>
    <p>The complete customer journey from <strong>${payload.source}</strong> through the website to phone call has been tracked and logged.</p>
    <div class="alert alert-light border"><small>View call details in the "Call Data" tab in the tracking panel.</small></div>
  `;

  $('#call-modal-body').html(html);

  const callInfoHtml = `
    <h6>Call Analytics Data</h6>
    <table class="table table-sm tracking-table mb-3">
      <tbody>
        <tr><td width="40%">Call Timestamp</td><td id="call-timestamp">${payload.timestamp}</td></tr>
        <tr><td>Call Duration</td><td id="call-duration">${payload.duration}</td></tr>
        <tr><td>Marketing Source</td><td id="call-source">${payload.source}</td></tr>
        <tr><td>Campaign</td><td id="call-campaign">${payload.campaign}</td></tr>
        <tr><td>Keyword</td><td id="call-keyword">${payload.keyword}</td></tr>
        <tr><td>Landing Page</td><td id="call-landing">${payload.landing}</td></tr>
        <tr><td>Call Recording</td><td><span class="badge badge-success">Available</span></td></tr>
      </tbody>
    </table>

    <h6 class="mb-2">Marchex AI Insights</h6>
    <div class="card mb-3"><div class="card-header bg-light p-2"><h6 class="mb-0">Call Sentiment Analysis</h6></div>
      <div class="card-body p-2">
        <div class="d-flex align-items-center mb-2">
          <div style="width:120px">Customer Sentiment:</div>
          <div class="progress flex-grow-1" style="height:20px;">
            <div id="customer-sentiment" class="progress-bar bg-success" role="progressbar" style="width:85%;">Positive</div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <div style="width:120px">Agent Performance:</div>
          <div class="progress flex-grow-1" style="height:20px;">
            <div id="agent-performance" class="progress-bar bg-success" role="progressbar" style="width:92%;">Excellent</div>
          </div>
        </div>
        <div class="mt-2 small"><span class="badge badge-success mr-1">Key Positives:</span> Solution-focused, helpful explanations</div>
      </div>
    </div>

    <div class="card mb-2"><div class="card-header bg-light p-2"><h6 class="mb-0">AI Call Summary</h6></div>
      <div class="card-body p-2">
        <p class="mb-1" id="call-summary">${escapeHTML(payload.summary)}</p>
        <div class="mt-2 small"><span class="badge badge-primary mr-1">Intent:</span> <span id="call-intent">${payload.intent}</span>
        <span class="badge badge-info ml-2 mr-1">Outcome:</span> <span id="call-outcome">${payload.outcome}</span></div>
      </div>
    </div>
  `;

  $('#call-info').html(callInfoHtml).show();
  $('.panel-tab-content').removeClass('active');
  $('#call-data').addClass('active');
  $('.wf-tablist .nav-link').removeClass('active');
  $('a[href="#call-data"]').addClass('active');

  $('#callMadeModal').modal('show');
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function escapeHTML(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}
/**
 * GhostShield Content Bridge
 * Runs at document_start.
 * Uses chrome.runtime.getURL to load injection_kernel.js conforming strictly to CSP.
 */

(function () {
  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('content_scripts/injection_kernel.js');
    script.async = false;
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
  } catch (err) {
    console.debug('[GhostShield Bridge] URL injection error:', err);
  }

  // Telemetry relay
  window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data || event.data.source !== 'GHOST_SHIELD_KERNEL') {
      return;
    }
    try {
      if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(event.data);
      }
    } catch (e) {}
  });
})();

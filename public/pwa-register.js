// PWA install support: always offer usable guidance, even without a native prompt.
(() => {
  const button = document.getElementById('install-app-button');
  const dialog = document.getElementById('install-help-dialog');
  const content = document.getElementById('install-help-content');
  if (!button || !dialog || !content) return;
  let deferredPrompt = null;
  const standalone = () => window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true;
  const apple = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const update = () => {
    button.hidden = standalone();
    // Keep the inline SVG from index.html; only the label changes by device.
    const label = button.querySelector('.install-button-label');
    if (label) label.textContent = apple() ? 'Add to Home Screen' : 'Install App';
  };
  function showHelp() {
    content.innerHTML = apple()
      ? '<p><strong>Install on your iPhone or iPad:</strong></p><ol class="install-steps"><li>Open this planner in <strong>Safari</strong>.</li><li>Tap <strong>Share</strong> (square with upward arrow), or open Safari’s page menu.</li><li>Choose <strong>Add to Home Screen</strong> (you may need to scroll or tap More).</li><li>Tap <strong>Add</strong>.</li></ol><p class="install-note">You will still need internet access to sign in and save your planner.</p>'
      : '<p><strong>Install the planner:</strong></p><ol class="install-steps"><li>In Chrome or Edge, open the browser menu (⋮ or ⋯).</li><li>Choose <strong>Install app</strong>, <strong>Apps → Install this site as an app</strong>, or <strong>Add to Home screen</strong>.</li><li>Follow the prompts.</li></ol><p class="install-note">If installation is unavailable, you can still use the planner in your browser. The install option may not appear if it is already installed.</p>';
    try { if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal(); else dialog.setAttribute('open', ''); }
    catch (error) { dialog.setAttribute('open', ''); }
  }
  button.addEventListener('click', () => {
    if (apple() || !deferredPrompt || standalone()) { showHelp(); return; }
    const prompt = deferredPrompt;
    deferredPrompt = null;
    // Call prompt synchronously inside the user gesture.
    try {
      Promise.resolve(prompt.prompt()).then(() => prompt.userChoice).then(choice => {
        if (choice?.outcome !== 'accepted') showHelp();
      }).catch(() => showHelp());
    } catch (error) { showHelp(); }
  });
  for (const id of ['install-help-close', 'install-help-done']) {
    document.getElementById(id)?.addEventListener('click', () => {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
    });
  }
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredPrompt = event; update(); });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; update(); });
  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', update);
  update();
  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(error => console.warn('PWA registration unavailable:', error));
    });
  }
})();

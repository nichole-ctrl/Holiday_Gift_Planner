// Install UI is deliberately separate from account data and cloud syncing.
(() => {
  const button = document.getElementById('install-app-button');
  const dialog = document.getElementById('install-help-dialog');
  const content = document.getElementById('install-help-content');
  if (!button || !dialog || !content) return;
  let deferredPrompt = null;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const update = () => {
    button.hidden = isStandalone();
    button.textContent = isAppleMobile() ? '▣ Add to Home Screen' : '▣ Install App';
  };
  const showHelp = () => {
    if (isAppleMobile()) {
      content.innerHTML = '<p>Install your planner from <strong>Safari</strong>:</p><ol class="install-steps"><li>Open this planner in Safari (if you are in another browser, copy the address into Safari).</li><li>Tap the <strong>Share</strong> icon (a square with an upward arrow). If it is not visible, open the browser menu.</li><li>Choose <strong>Add to Home Screen</strong>. On newer iOS versions, you may need to choose <strong>More</strong> first.</li><li>Tap <strong>Add</strong>. Your Holiday Gift Planner icon will appear on your Home Screen.</li></ol><p class="install-note">You will still need an internet connection to sign in and save your planner.</p>';
    } else {
      content.innerHTML = '<p>Your browser has not offered automatic installation yet.</p><ol class="install-steps"><li>Open your browser menu (usually <strong>⋮</strong> or <strong>⋯</strong>).</li><li>Look for <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li><li>Follow the prompts to add your planner.</li></ol><p class="install-note">If the option is missing, try Chrome or Edge over HTTPS. You can still use the planner normally in your browser.</p>';
    }
    if (typeof dialog.showModal === 'function') dialog.showModal();
  };
  button.addEventListener('click', async () => {
    if (isStandalone()) return;
    if (!isAppleMobile() && deferredPrompt) {
      const prompt = deferredPrompt; deferredPrompt = null;
      try {
        await prompt.prompt();
        await prompt.userChoice;
      } catch (error) { console.warn('Install prompt unavailable:', error); showHelp(); }
    } else showHelp();
  });
  for (const id of ['install-help-close','install-help-done']) {
    document.getElementById(id)?.addEventListener('click', () => dialog.close());
  }
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredPrompt = event; update(); });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; update(); });
  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', update);
  update();
  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(error => console.warn('App installation support unavailable:', error));
    });
  }
})();

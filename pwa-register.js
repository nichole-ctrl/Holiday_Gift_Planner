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

  // Update notification: never force a reload while someone is editing gifts.
  if ('serviceWorker' in navigator && window.isSecureContext) {
    let hadController = Boolean(navigator.serviceWorker.controller);
    let updateAvailable = false;
    let updateBanner = null;
    function offerUpdate() {
      if (updateAvailable) return;
      updateAvailable = true;
      updateBanner = document.createElement('aside');
      updateBanner.setAttribute('role', 'status');
      updateBanner.setAttribute('aria-live', 'polite');
      updateBanner.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;max-width:430px;margin:0 auto;z-index:2147483647;background:#fffaf2;color:#214e40;border:2px solid #bfd5c7;border-radius:16px;padding:16px;box-shadow:0 8px 32px rgba(0,0,0,.22);font:inherit;';
      const heading = document.createElement('div');
      heading.textContent = '🎁 A little holiday magic is ready!';
      heading.style.cssText = 'font-weight:700;margin-bottom:6px;';
      const message = document.createElement('p');
      message.textContent = 'We’ve made some improvements to your Gift Planner. Save any changes, then update to enjoy the latest version.';
      message.style.cssText = 'margin:0 0 12px;line-height:1.4;';
      const actions = document.createElement('div');
      actions.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
      const refresh = document.createElement('button');
      refresh.type = 'button'; refresh.textContent = 'Update Planner';
      refresh.style.cssText = 'background:#214e40;color:white;border:0;border-radius:9px;padding:10px 15px;cursor:pointer;font:inherit;font-weight:700;';
      refresh.addEventListener('click', () => window.location.reload());
      const later = document.createElement('button');
      later.type = 'button'; later.textContent = 'Later';
      later.style.cssText = 'background:transparent;color:#214e40;border:1px solid #9cb9a8;border-radius:9px;padding:10px 15px;cursor:pointer;font:inherit;';
      later.addEventListener('click', () => { updateBanner.remove(); updateBanner = null; });
      actions.append(refresh,later); updateBanner.append(heading,message,actions);
      document.body.append(updateBanner);
    }
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController) offerUpdate();
      hadController = true;
    });
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const check = () => registration.update().catch(() => {});
        document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
        window.addEventListener('focus', check);
        // Browsers throttle timers in the background; focus/visibility checks cover return visits.
        setInterval(() => { if (!document.hidden) check(); }, 60 * 60 * 1000);
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) offerUpdate();
          });
        });
        if (registration.waiting && navigator.serviceWorker.controller) offerUpdate();
        check();
      } catch (error) { console.warn('PWA update check unavailable:', error); }
    });
  }

})();

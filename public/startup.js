// External script respects the site's Content-Security-Policy (no inline scripts).
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('holiday-startup');
  if (!splash) return;
  window.setTimeout(() => {
    splash.classList.add('is-done');
    window.setTimeout(() => splash.remove(), 350);
  }, 450);
});

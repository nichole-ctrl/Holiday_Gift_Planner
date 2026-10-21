# Install button icon — v10

Replaced Unicode ⭳ / HTML entity `&#11123;` with an inline SVG download-to-tray icon for consistent rendering on iPhone, Android and desktop.

Both `index.html` and `public/index.html` include the SVG and `.install-button-label` span. Both `pwa-register.js` copies update only the label text (`Add to Home Screen` on Apple mobile; `Install App` otherwise) without replacing the SVG. Matching CSS is in both `style.css` files. The script cache-busting version is now 10.

For Netlify, deploy the entire project (publish directory `public`), not only the root HTML. No configuration changes needed.

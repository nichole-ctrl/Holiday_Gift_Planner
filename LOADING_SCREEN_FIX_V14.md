# v14 startup screen fix

The v13 startup screen used inline JavaScript. The site's Content-Security-Policy (`script-src 'self' https://esm.sh`) blocks inline scripts, so the splash overlay stayed visible.

v14 moves that logic to `public/startup.js`, referenced by `public/index.html`, and adds a 2.5-second CSS failsafe. The security policy remains unchanged.

Deploy the entire project to Netlify (publish directory: `public`). If an installed iPhone PWA still shows a stale screen, fully close and reopen it. If necessary, remove and re-add the Home Screen app; account data is stored in Supabase and is not deleted by removing the shortcut.

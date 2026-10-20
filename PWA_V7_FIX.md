# PWA install button fix (v7)

The v6 button awaited `prompt.prompt()` before reading `userChoice`. Some browsers reject or stall the prompt, leaving no visible feedback. v7 calls prompt synchronously within the tap gesture and falls back to a visible instructional dialog when installation is unavailable or declined. The PWA script URL has a new version parameter and the decorative cache version was incremented.

Deploy the **entire project** through your existing Git-connected Netlify site or CLI (publish directory `public`, functions directory `netlify/functions`). Do not deploy only `public` because the account-deletion function must remain deployed.

Test on iPhone in Safari and on Windows in Edge or Chrome. The header install button is visible after signing in; it is intentionally hidden on the sign-in screen and when running as an installed standalone app. On iPhone it shows manual Safari instructions. On Windows it uses the native prompt when offered, otherwise shows manual instructions.

This package has been syntax checked, but physical-device installation and production deployment have not been verified.

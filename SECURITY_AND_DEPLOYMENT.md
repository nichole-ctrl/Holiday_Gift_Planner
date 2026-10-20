# Clean build v2 — security and deployment notes

This is a static Netlify project. Deploy the **public** folder (or deploy the project root with the provided netlify.toml). Do not upload the ZIP as a site asset.

## What changed
- Added validation for saved gift links: only valid http/https URLs without embedded credentials can be saved or rendered as clickable links.
- Added a URL pattern and explanatory text to the gift editor.
- Added Content-Security-Policy and Permissions-Policy response headers, with the existing dynamic Supabase dependency allowed.
- Removed duplicate Netlify header definitions from netlify.toml; public/_headers is the single source of response headers.
- Kept dashboard, budgets, stockings, account login, and Supabase data model unchanged.

## Required before deploying
1. In `public/config.js`, enter the **public Supabase project URL** and **publishable/anon key** from your existing Supabase project. Never put a service_role key or secret here.
2. Confirm the Supabase auth redirect URLs include your live Netlify domain.
3. Deploy the `public` folder to Netlify. Do not deploy the project root via manual drag-and-drop unless Netlify processes netlify.toml as a build.
4. Test signup/access-code flow, confirmation email, login, save/reload, and product links on your live site.

## Security limitations
- Static review and automated tests cannot establish that Microsoft Defender will stop flagging the file, nor certify the app malware-free.
- The Supabase library is still loaded from esm.sh at runtime. If Defender continues flagging, capture the exact detection details and submit the file to Microsoft for analysis; do not disable antivirus.
- The Content Security Policy permits HTTPS connections because the Supabase project URL is configured by the site owner. Restrict `connect-src` to your Supabase project domain after configuration for stronger protection.
- Any saved customer data should remain in your existing Supabase project; this package does not migrate or delete cloud records.

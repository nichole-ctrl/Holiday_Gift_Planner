# Holiday Gift Planner v12 — Free demo

Deploy the complete project to Netlify (build publish directory remains `public`). The demo is at `/demo/`, and the existing sign-in screen has a **Try the free demo** link.

Demo has 5 successful change saves per browser tab session; demo sample data and count are stored in sessionStorage, never Supabase. CSV/JSON exports and restores are disabled. Account creation and authentication are not part of the demo. The demo is a product preview, **not** a server-enforced free-tier license or abuse-resistant rate limit. Closing the tab and opening a new session resets it.

Demo includes fictional sample data and does not sync across devices. Do not advertise offline editing. To link from Etsy use `https://holidaygiftplanner.netlify.app/demo/`.

Important: Test on iPhone and desktop before publishing; JS syntax checks alone do not establish end-to-end behavior.

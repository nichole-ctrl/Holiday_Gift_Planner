# The Easy Holiday Gift Planner

## Current update: customer accounts and Etsy access code

Read **ACCESS_SETUP.md first**. New visitors now see Sign in / Create account before the planner. New account registration collects first name, email, password, and the shared Etsy access code. Existing accounts sign in without it.

The code is checked by a Supabase **Before User Created** Postgres hook, not a browser-only check. The hook is included but must be installed and enabled on your project. This package does not modify your live Supabase project or Netlify deployment.

## Files

- `public/`: only the files to deploy to Netlify. Copy your existing working config.js into this folder before uploading it.
- `supabase/access-code-hook.sql`: new registration hook. Install this in SQL Editor, then enable it in Authentication > Hooks.
- `supabase/schema.sql`: original planner data table/RLS setup. Do not rerun for an already configured project.
- `ACCESS_SETUP.md`: exact update steps and live test checklist.
- Root HTML/CSS/JS and assets: editable sources; copy changed browser files to public/ for deployment.
- Tests: run `node tests.cjs` and `node render-smoke.cjs`.
- `netlify.toml`: Git-connected deployment publishes public/ with no build step.

The standalone Preview HTML is a separate design preview. Account fields are shown for review, and Explore the demo opens the fictional device-only planner. Do not deploy that standalone preview as the customer app.

## Existing features

Christmas countdown, personalized welcome, remaining/forecast budget, present counts, category breakdown, recipient action lists, reminders, full gift log, search and filters, CSV exports, JSON backup/restore, stocking budgets and readiness/filling stages. Shipping costs are counted with gifts. Stocking budgets remain part of the overall budget rather than extra allowances. Browser files use cream, green and cranberry with watercolor lights and supplied PNG icons.

Supabase stores one versioned JSON planner per account, with owner-only RLS. Revision checks detect competing device changes rather than silently overwriting them. Data reloads on sign-in or return to the tab when it is safe to refresh. Use Account & backups for manual refresh and retry. The app is not a simultaneous collaborative editor.

## Configuration

Only your public Supabase project URL and publishable (or legacy anon) key belong in config.js. Never use a secret/service-role key or database password. Keep `previewMode` false (or omit it) in production. The downloadable config.js is an empty template because your working connection values were set outside this workspace.

The SDK loads from esm.sh when configured. Google Fonts are optional and have system fallbacks. No build tools or Netlify functions are required for the Postgres-hook approach.

## Verification

Local calculation, migration, backup-validation and render smoke checks pass. Auth screens are checked for signed-out route gating and signup-only access-code fields. This environment has not run the hook against your live database or repeated registration, confirmation, password reset and device-sync tests after the update; follow ACCESS_SETUP.md before selling.

No individual Etsy purchase verification is performed: the shared code can be passed on. Existing users remain valid if you rotate the code for future registrations. Registration-hook changes apply to new user creation throughout the selected Supabase project.

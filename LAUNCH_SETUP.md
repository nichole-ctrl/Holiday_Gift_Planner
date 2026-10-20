# Holiday Gift Planner v4 — launch setup

## Deploy with Netlify
**Important:** Deploy the entire project folder (repository or Netlify CLI), NOT just the `public` folder. The server-side account-deletion function is in `netlify/functions/delete-account.js` and will not deploy if you drag and drop `public` alone. Connect the project to a Git repository on Netlify, or deploy the full folder with the Netlify CLI (`netlify deploy --prod --dir=public --functions=netlify/functions`).

Set Netlify environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (the latter must be secret/server-side only). Keep `public/config.js` configured with the Supabase URL and publishable key, NEVER the service-role key. Redeploy after setting variables.

## Supabase prerequisites
Your `gift_studio_planners.user_id` foreign key MUST reference `auth.users(id) ON DELETE CASCADE`, as in `supabase/schema.sql`. Verify this in your actual deployed database; do not blindly re-run schema.sql because existing policies/triggers may conflict. Deleting the Auth user then cascades planner deletion.

## Test checklist
1. Test on a throwaway account, not a real customer.
2. Sign up, confirm email, sign in, create gifts and budgets, and verify cloud saving.
3. Open Account & backups and download a backup.
4. Click Delete My Account, cancel once, then confirm with `DELETE`.
5. Verify account login fails and planner row is gone in Supabase.
6. Verify Privacy Policy and Terms of Use links work on sign-in and inside the app.
7. Test mobile, check Microsoft Defender, and verify that no service-role key appears in browser code.

## Policy review
Policy text is a starting draft, not legal advice. Confirm actual Supabase settings, retention/backups, support processes, other analytics/cookies, applicable privacy laws, and your commercial terms before public launch.

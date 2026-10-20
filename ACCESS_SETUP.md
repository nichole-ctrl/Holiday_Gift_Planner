# Enable Etsy access-code registration

This update changes the LIVE planner to require sign-in before showing any planner page. Existing accounts continue signing in normally. Only new accounts need the shared Etsy access code you selected.

## 1. Install and enable the registration hook

1. In your existing Supabase project, open SQL Editor.
2. Run `supabase/access-code-hook.sql` from this package. Do not rerun the original schema.sql; your planner table already exists.
3. Open Authentication > Hooks and add/enable a **Before User Created** hook.
4. Choose **Postgres function**, schema `public`, function `hook_require_gift_planner_access`.
5. Save and confirm the hook is enabled. Running the SQL alone is not enough.

The hook rejects missing or incorrect access-code hashes at Supabase, including direct signup API calls that bypass the app. It does not change existing accounts, planner records, or RLS policies. Keep email confirmation enabled. This hook controls all NEW user creation in this Supabase project; use this only if the project is dedicated to this planner, or adapt it for other apps before enabling it.

The browser trims surrounding spaces and converts the access code to lowercase, then hashes it before submitting it as signup metadata; the plaintext code is not included in the distributed JavaScript, database function, or saved planner. The code/hash is shared access, not an individual purchase check. A buyer can still share access with someone else. Rotating the expected hash later affects new registrations only.

## 2. Deploy the browser files

**Keep the `config.js` from your currently working deployment.** This download cannot know the project URL/key you entered on your own computer.

1. Unzip this updated project.
2. Copy your existing configured `config.js` into the package's `public/` folder, replacing its empty template. If it has a `previewMode` setting, make sure it is `false` or omit it.
3. In Netlify, upload the **public folder**, with `index.html` directly inside it. It contains only browser files and assets.
4. Do not upload the standalone preview HTML, SQL files, or this setup guide as your production site.

For a Git-connected deploy, `netlify.toml` now publishes `public`. No build command is required. Source files remain at the project root for editing; refresh the matching public files after making future source edits.

Your existing Supabase Site URL and Redirect URLs remain the same. No new Netlify secret or service-role key is needed for this approach.

## 3. Verify before sharing the Etsy link

- Signed out/incognito: the URL shows Sign in / Create account, with no planner sidebar or gift log. Visiting #gifts directly still shows authentication.
- Existing account: sign in without an access code; saved gifts/budgets remain present.
- New email, missing code: signup form requires the field.
- New email, wrong code: Supabase rejects registration and no user is created.
- New email, correct code: confirm email, sign in, and see a fresh planner with the first name you entered.
- Sign out: returns to the sign-in page.
- Password reset: still works from the sign-in page.

To verify server enforcement independently of the form, submit a normal Supabase signup request without `options.data.access_code_hash`: it must fail while the hook is enabled. Use a disposable test email, not an existing account.

Local JavaScript/render/calculation checks are included. Live hook execution and account flows still require testing in your Supabase project. This package has not changed your live configuration or deployment.

Official reference: https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook

-- Install in Supabase SQL Editor; DO NOT publish this file on Netlify.
-- After running, enable this Postgres function in Authentication > Hooks >
-- Before User Created. Running SQL alone does not enable the hook.
-- Existing accounts can sign in without a code. New registrations must match.
begin;
create or replace function public.hook_require_gift_planner_access(event jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
begin
  if coalesce(event->'user'->'user_metadata'->>'access_code_hash', '')
     <> '91d17d0c5c4b998e664224f3089d467bd59515f76e32da9a91641b2117a95bda' then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 403,
      'message', 'Access code is missing or incorrect. Check your Etsy access PDF.'
    ));
  end if;
  return '{}'::jsonb;
end;
$$;
revoke execute on function public.hook_require_gift_planner_access(jsonb)
  from public, anon, authenticated;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.hook_require_gift_planner_access(jsonb)
  to supabase_auth_admin;
commit;

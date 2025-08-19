create or replace view public.appeal_view with (security_invoker = on) as
 SELECT appeals.text,
    appeals.transaction_data ->> 'LowProfileId'::text AS low_profile_id
   FROM appeals;
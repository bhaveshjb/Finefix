create or replace view "public"."appeal_view" as  SELECT appeals.text,
    (appeals.transaction_data ->> 'LowProfileId'::text) AS low_profile_id
   FROM appeals;
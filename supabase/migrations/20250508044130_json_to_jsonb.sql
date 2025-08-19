alter table "public"."appeals" alter column "form_data" set data type jsonb using "form_data"::jsonb;

alter table "public"."appeals" alter column "transaction_data" set data type jsonb using "transaction_data"::jsonb;
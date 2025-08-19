DROP POLICY IF EXISTS "Enable users to view their own data only" ON "public"."appeals";

CREATE POLICY "Enable users to view their own data only"
ON "public"."appeals"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email') = user_email
);
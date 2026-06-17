CREATE OR REPLACE FUNCTION public.add_admin_email_alias(new_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_email text;
BEGIN
  current_email := lower(coalesce(auth.jwt() ->> 'email', ''));

  IF current_email = '' THEN
    RAISE EXCEPTION 'User email is required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE lower(email) = current_email
  ) THEN
    RAISE EXCEPTION 'Only admins can add an admin email alias';
  END IF;

  INSERT INTO public.admin_users (email)
  VALUES (lower(btrim(new_email)))
  ON CONFLICT (email) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_admin_email_alias(text) TO authenticated;

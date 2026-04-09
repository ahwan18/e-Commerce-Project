-- Counter table for QR-based ordering sessions
CREATE TABLE IF NOT EXISTS counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  is_locked boolean NOT NULL DEFAULT false,
  current_session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add counter/session context to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS counter_id uuid REFERENCES counters(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS session_id text;

CREATE INDEX IF NOT EXISTS idx_orders_counter_id ON orders(counter_id);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_counters_is_locked ON counters(is_locked);

ALTER TABLE counters ENABLE ROW LEVEL SECURITY;

-- Public can read counters for validation at menu entry.
DROP POLICY IF EXISTS "Counters are viewable by everyone" ON counters;
CREATE POLICY "Counters are viewable by everyone"
  ON counters FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated admins can manage counters in admin panel.
DROP POLICY IF EXISTS "Counters can be inserted by authenticated admins" ON counters;
CREATE POLICY "Counters can be inserted by authenticated admins"
  ON counters FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Counters can be updated by authenticated admins" ON counters;
CREATE POLICY "Counters can be updated by authenticated admins"
  ON counters FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Counters can be deleted by authenticated admins" ON counters;
CREATE POLICY "Counters can be deleted by authenticated admins"
  ON counters FOR DELETE
  TO authenticated
  USING (true);

-- Atomically lock a counter for a session.
CREATE OR REPLACE FUNCTION acquire_counter_session(p_counter_id uuid, p_session_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_counter counters%ROWTYPE;
BEGIN
  SELECT * INTO v_counter
  FROM counters
  WHERE id = p_counter_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_counter');
  END IF;

  IF v_counter.is_active = false THEN
    RETURN jsonb_build_object('success', false, 'reason', 'inactive_counter');
  END IF;

  IF v_counter.is_locked = true AND coalesce(v_counter.current_session_id, '') <> p_session_id THEN
    RETURN jsonb_build_object('success', false, 'reason', 'counter_in_use', 'counter_name', v_counter.name);
  END IF;

  UPDATE counters
  SET is_locked = true,
      current_session_id = p_session_id
  WHERE id = p_counter_id;

  RETURN jsonb_build_object(
    'success', true,
    'counter_id', v_counter.id,
    'counter_name', v_counter.name
  );
END;
$$;

-- Release lock. If session is provided, enforce ownership.
CREATE OR REPLACE FUNCTION release_counter_session(p_counter_id uuid, p_session_id text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_counter counters%ROWTYPE;
BEGIN
  SELECT * INTO v_counter
  FROM counters
  WHERE id = p_counter_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF p_session_id IS NOT NULL AND coalesce(v_counter.current_session_id, '') <> p_session_id THEN
    RETURN false;
  END IF;

  UPDATE counters
  SET is_locked = false,
      current_session_id = NULL
  WHERE id = p_counter_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION acquire_counter_session(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION release_counter_session(uuid, text) TO anon, authenticated;

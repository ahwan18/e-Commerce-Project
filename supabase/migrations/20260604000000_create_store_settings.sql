-- Create store_settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Allow public read access to store_settings"
    ON public.store_settings
    FOR SELECT
    USING (true);

-- Allow authenticated users (admins) to update settings
CREATE POLICY "Allow authenticated users to update store_settings"
    ON public.store_settings
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert store_settings"
    ON public.store_settings
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Insert default UI mode setting
INSERT INTO public.store_settings (key, value, description)
VALUES ('ui_mode', '"mode1"'::jsonb, 'Customer UI Mode (mode1 = Counter/QR, mode2 = Standard E-commerce)')
ON CONFLICT (key) DO NOTHING;

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_store_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
CREATE TRIGGER update_store_settings_timestamp
BEFORE UPDATE ON public.store_settings
FOR EACH ROW
EXECUTE FUNCTION update_store_settings_updated_at();

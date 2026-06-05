import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mreaatnxbfalhocpyide.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZWFhdG54YmZhbGhvY3B5aWRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUyNzExNCwiZXhwIjoyMDkwMTAzMTE0fQ.EcN7SLmA8_h3VuT2gtsz0gwLmxeHBcrFNL_0b3DIoTc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Supabase CLI connection seems blocked by a proxy or missing Docker.");
}
run();

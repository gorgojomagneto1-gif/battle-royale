import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cjbjxkdqttcrivhbayou.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmp4a2RxdHRjcml2aGJheW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNDg5NDUsImV4cCI6MjA4MDcyNDk0NX0.HnpM5moOF-YOgnyvUlVFevzDQmgYOL5crC19KnBL7tA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

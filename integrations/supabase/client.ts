
import { createClient } from "@supabase/supabase-js";

// Credenciais fornecidas pelo usuário
const SUPABASE_URL = "https://ijyxpcugolzyrcxfzypt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqeXhwY3Vnb2x6eXJjeGZ6eXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMTY5NzgsImV4cCI6MjA2Njg5Mjk3OH0.YBieaj90hzh7gZYHpMbfzsETYIJohyWd5lOrLzn9Ue4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

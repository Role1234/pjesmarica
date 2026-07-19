// =========================
// SUPABASE KONFIGURACIJA
// =========================


const SUPABASE_URL = 
"https://kahrsndwcptpnilwmiqh.supabase.co";


const SUPABASE_KEY = 
"sb_publishable_nDgJ0ZBII3Zj97o05Bf6pQ_DYfKauBx";



// Kreiranje klijenta

const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Supabase Configuration - EventHub

const SUPABASE_URL = "https://cqynjvgsknybcbrstyne.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Qe4RZRqYSJFU_6V419_fvg_COpXXaVg";

// Database table names (constants)
const TABLES = {
    EVENTS: 'events',
    USERS: 'profiles',
    REGISTRATIONS: 'bookings',
    CATEGORIES: 'categories',
    NOTIFICATIONS: 'notifications'
};

window.TABLES = TABLES;

// Initialize Supabase client when library is ready
function initializeSupabase() {
    try {
        // Check if Supabase library is loaded
        if (!window.supabase || typeof window.supabase.createClient !== 'function') {
            console.log('Waiting for Supabase library...');
            setTimeout(initializeSupabase, 100);
            return;
        }

        // Store the library reference
        const supabaseLib = window.supabase;
        
        // Create Supabase client
        const supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Expose client globally
        window.supabase = supabaseClient;
        
        console.log('Supabase client initialized successfully');
        
        // Dispatch custom event to notify other scripts
        window.dispatchEvent(new CustomEvent('supabaseReady'));
        
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        setTimeout(initializeSupabase, 200);
    }
}

// Start initialization
initializeSupabase();

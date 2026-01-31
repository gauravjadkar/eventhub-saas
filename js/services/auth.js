// Authentication Service - EventHub

class AuthService {
    constructor() {
        this.currentUser = null;
        this.supabaseClient = null;
        this.initWhenReady();
    }

    async initWhenReady() {
        // Wait for Supabase to be ready
        await this.waitForSupabase();
        this.supabaseClient = window.supabase;
        await this.init();
    }

    async waitForSupabase() {
        return new Promise((resolve) => {
            const checkSupabase = () => {
                if (window.supabase && typeof window.supabase.auth !== 'undefined') {
                    resolve();
                    return;
                }
                setTimeout(checkSupabase, 100);
            };
            
            // Also listen for the custom event
            window.addEventListener('supabaseReady', () => {
                if (window.supabase && typeof window.supabase.auth !== 'undefined') {
                    resolve();
                }
            }, { once: true });
            
            checkSupabase();
        });
    }

    async init() {
        try {
            // Check if user is already logged in
            const { data: { user } } = await this.supabaseClient.auth.getUser();
            this.currentUser = user;
            this.updateUI();
        } catch (error) {
            console.error('Error initializing auth service:', error);
        }
    }

    // Sign up new user
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;

            utils.showAlert('Registration successful! Please check your email to verify your account.');
            return { success: true, data };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Sign in user
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.currentUser = data.user;
            this.updateUI();
            utils.showAlert('Welcome back!');
            return { success: true, data };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Sign out user
    async signOut() {
        try {
            const { error } = await this.supabaseClient.auth.signOut();
            if (error) throw error;

            this.currentUser = null;
            this.updateUI();
            utils.showAlert('Signed out successfully');
            return { success: true };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Reset password
    async resetPassword(email) {
        try {
            const { error } = await this.supabaseClient.auth.resetPasswordForEmail(email);
            if (error) throw error;

            utils.showAlert('Password reset email sent!');
            return { success: true };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Update user profile
    async updateProfile(updates) {
        try {
            const { data, error } = await this.supabaseClient.auth.updateUser({
                data: updates
            });

            if (error) throw error;

            this.currentUser = data.user;
            utils.showAlert('Profile updated successfully!');
            return { success: true, data };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update UI based on authentication state
    updateUI() {
        const authButtons = document.querySelectorAll('[data-auth]');
        const userElements = document.querySelectorAll('[data-user]');

        authButtons.forEach(button => {
            const authType = button.dataset.auth;
            if (authType === 'signed-in' && this.isAuthenticated()) {
                utils.showElement(button);
            } else if (authType === 'signed-out' && !this.isAuthenticated()) {
                utils.showElement(button);
            } else {
                utils.hideElement(button);
            }
        });

        userElements.forEach(element => {
            if (this.currentUser) {
                element.textContent = this.currentUser.email || 'User';
            }
        });
    }

    // Listen for auth state changes
    onAuthStateChange(callback) {
        if (!this.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }
        
        this.supabaseClient.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            this.updateUI();
            if (callback) callback(event, session);
        });
    }
}

// Initialize auth service
const authService = new AuthService();
window.authService = authService;
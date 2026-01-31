// Main Application - EventHub

class App {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    async start() {
        // Wait for Supabase to be initialized
        await this.waitForSupabase();
        
        // Initialize services
        await this.initializeServices();
        
        // Set up router
        this.setupRouter();
        
        // Load initial page
        this.loadInitialPage();
        
        console.log('EventHub application initialized');
    }

    async waitForSupabase() {
        // Wait for Supabase client to be available
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkSupabase = () => {
                if (window.supabase && typeof window.supabase.auth !== 'undefined') {
                    console.log('Supabase client ready');
                    resolve();
                    return;
                }
                
                attempts++;
                if (attempts >= maxAttempts) {
                    reject(new Error('Supabase client failed to initialize'));
                    return;
                }
                
                setTimeout(checkSupabase, 100);
            };
            
            // Also listen for the custom event
            window.addEventListener('supabaseReady', () => {
                if (window.supabase && typeof window.supabase.auth !== 'undefined') {
                    console.log('Supabase client ready via event');
                    resolve();
                }
            }, { once: true });
            
            checkSupabase();
        });
    }

    async initializeServices() {
        try {
            // Check if services are available
            if (typeof authService === 'undefined') {
                throw new Error('Auth service not available');
            }
            
            if (typeof eventsService === 'undefined') {
                throw new Error('Events service not available');
            }

            // Initialize auth service and listen for auth changes
            authService.onAuthStateChange((event, session) => {
                console.log('Auth state changed:', event);
                // You can add additional logic here for auth state changes
            });

            // Load categories for events
            await eventsService.getCategories();
            
        } catch (error) {
            console.error('Error initializing services:', error);
            utils.showAlert('Error initializing application', 'error');
        }
    }

    setupRouter() {
        // Simple client-side router
        window.router = {
            loadPage: (pageName) => {
                this.loadPage(pageName);
            }
        };

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const page = utils.getUrlParameter('page') || 'home';
            this.loadPage(page);
        });
    }

    loadInitialPage() {
        const page = utils.getUrlParameter('page') || 'home';
        this.loadPage(page);
    }

    async loadPage(pageName) {
        this.currentPage = pageName;
        
        // Show loading state
        const app = document.getElementById('app');
        utils.showLoading(app);

        try {
            switch (pageName) {
                case 'home':
                    await homePage.render();
                    break;
                    
                case 'events':
                    await this.loadEventsPage();
                    break;
                    
                case 'event-details':
                    await this.loadEventDetailsPage();
                    break;
                    
                case 'create-event':
                    await this.loadCreateEventPage();
                    break;
                    
                case 'my-events':
                    await this.loadMyEventsPage();
                    break;
                    
                case 'login':
                    await this.loadLoginPage();
                    break;
                    
                case 'register':
                    await this.loadRegisterPage();
                    break;
                    
                case 'profile':
                    await this.loadProfilePage();
                    break;
                    
                default:
                    await this.load404Page();
            }
        } catch (error) {
            console.error('Error loading page:', error);
            utils.showAlert('Error loading page', 'error');
        } finally {
            utils.hideLoading(app);
        }

        // Update navbar active state
        if (window.navbar) {
            navbar.updateActiveLink(pageName);
        }
    }

    async loadEventsPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="section">
                <div class="container">
                    <h1>All Events</h1>
                    <div class="events-filters mb-4">
                        <input type="text" id="searchInput" class="form-input" placeholder="Search events...">
                        <select id="categoryFilter" class="form-input">
                            <option value="">All Categories</option>
                        </select>
                    </div>
                    <div id="eventsGrid" class="grid grid-3">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Load events (placeholder - you'll need to implement this)
        console.log('Events page loaded');
    }

    async loadEventDetailsPage() {
        const eventId = utils.getUrlParameter('id');
        if (!eventId) {
            this.loadPage('events');
            return;
        }

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="section">
                <div class="container">
                    <div id="eventDetails">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Load event details (placeholder - you'll need to implement this)
        console.log('Event details page loaded for event:', eventId);
    }

    async loadCreateEventPage() {
        if (!authService.isAuthenticated()) {
            utils.showAlert('Please sign in to create events', 'error');
            this.loadPage('login');
            return;
        }

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="section">
                <div class="container">
                    <h1>Create New Event</h1>
                    <form id="createEventForm" class="card">
                        <div class="form-group">
                            <label class="form-label">Event Title</label>
                            <input type="text" id="eventTitle" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea id="eventDescription" class="form-input" rows="4"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Date & Time</label>
                            <input type="datetime-local" id="eventDate" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Location</label>
                            <input type="text" id="eventLocation" class="form-input" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Create Event</button>
                    </form>
                </div>
            </div>
        `;
        
        // Add form handler (placeholder - you'll need to implement this)
        console.log('Create event page loaded');
    }

    async loadMyEventsPage() {
        if (!authService.isAuthenticated()) {
            utils.showAlert('Please sign in to view your events', 'error');
            this.loadPage('login');
            return;
        }

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="section">
                <div class="container">
                    <h1>My Events</h1>
                    <div id="myEventsGrid" class="grid grid-3">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Load user events (placeholder - you'll need to implement this)
        console.log('My events page loaded');
    }

    async loadLoginPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="section">
                <div class="container">
                    <div class="card" style="max-width: 400px; margin: 0 auto;">
                        <h2>Sign In</h2>
                        <form id="loginForm">
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" id="loginEmail" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" id="loginPassword" class="form-input" required>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
                        </form>
                        <p class="text-center mt-3">
                            Don't have an account? <a href="#" data-page="register">Register here</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Add login form handler (placeholder - you'll need to implement this)
        console.log('Login page loaded');
    }

    async loadRegisterPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="section">
                <div class="container">
                    <div class="card" style="max-width: 400px; margin: 0 auto;">
                        <h2>Create Account</h2>
                        <form id="registerForm">
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" id="registerEmail" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" id="registerPassword" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Confirm Password</label>
                                <input type="password" id="confirmPassword" class="form-input" required>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>
                        </form>
                        <p class="text-center mt-3">
                            Already have an account? <a href="#" data-page="login">Sign in here</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Add register form handler (placeholder - you'll need to implement this)
        console.log('Register page loaded');
    }

    async loadProfilePage() {
        if (!authService.isAuthenticated()) {
            utils.showAlert('Please sign in to view your profile', 'error');
            this.loadPage('login');
            return;
        }

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="section">
                <div class="container">
                    <h1>Profile</h1>
                    <div class="card">
                        <p>Profile management coming soon...</p>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Profile page loaded');
    }

    async load404Page() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="section">
                <div class="container text-center">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="#" class="btn btn-primary" data-page="home">Go Home</a>
                </div>
            </div>
        `;
    }
}

// Initialize the application
new App();
// Home Page - EventHub

class HomePage {
    constructor() {
        this.events = [];
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="hero-section">
                <div class="container">
                    <div class="text-center">
                        <h1>Welcome to EventHub</h1>
                        <p class="lead">Discover and manage amazing events in your area</p>
                        <div class="hero-actions">
                            <a href="#" class="btn btn-primary" data-page="events">Browse Events</a>
                            <a href="#" class="btn btn-secondary" data-page="create-event" data-auth="signed-in">Create Event</a>
                            <a href="#" class="btn btn-secondary" data-page="register" data-auth="signed-out">Get Started</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="container">
                    <h2 class="text-center mb-4">Upcoming Events</h2>
                    <div id="featuredEvents" class="grid grid-3">
                        <div class="spinner"></div>
                    </div>
                    <div class="text-center mt-4">
                        <a href="#" class="btn btn-primary" data-page="events">View All Events</a>
                    </div>
                </div>
            </div>

            <div class="section bg-primary text-white">
                <div class="container text-center">
                    <h2>Why Choose EventHub?</h2>
                    <div class="grid grid-3 mt-4">
                        <div class="feature-card">
                            <h3>Easy Discovery</h3>
                            <p>Find events that match your interests with our smart filtering system</p>
                        </div>
                        <div class="feature-card">
                            <h3>Simple Registration</h3>
                            <p>Register for events with just a few clicks and manage your schedule</p>
                        </div>
                        <div class="feature-card">
                            <h3>Event Management</h3>
                            <p>Create and manage your own events with our intuitive tools</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load featured events
        await this.loadFeaturedEvents();
        
        // Update auth-dependent elements
        authService.updateUI();
    }

    async loadFeaturedEvents() {
        const featuredEventsContainer = document.getElementById('featuredEvents');
        
        try {
            const result = await eventsService.getAllEvents({ 
                upcoming: true 
            });

            if (result.success) {
                this.events = result.data.slice(0, 6); // Show only first 6 events
                this.renderFeaturedEvents();
            } else {
                featuredEventsContainer.innerHTML = `
                    <div class="text-center">
                        <p>Unable to load events at this time.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading featured events:', error);
            featuredEventsContainer.innerHTML = `
                <div class="text-center">
                    <p>Error loading events. Please try again later.</p>
                </div>
            `;
        }
    }

    renderFeaturedEvents() {
        const featuredEventsContainer = document.getElementById('featuredEvents');
        
        if (this.events.length === 0) {
            featuredEventsContainer.innerHTML = `
                <div class="text-center">
                    <p>No upcoming events found.</p>
                    <a href="#" class="btn btn-primary" data-page="create-event" data-auth="signed-in">Create the First Event</a>
                </div>
            `;
            return;
        }

        featuredEventsContainer.innerHTML = this.events.map(event => `
            <div class="event-card">
                ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}" class="event-card-image">` : ''}
                <div class="event-card-content">
                    <h3 class="event-card-title">${event.title}</h3>
                    <div class="event-card-meta">
                        <span>📅 ${utils.formatDate(event.event_date)}</span>
                        <span>📍 ${event.location}</span>
                        ${event.categories ? `<span>🏷️ ${event.categories.name}</span>` : ''}
                    </div>
                    <p>${event.description ? event.description.substring(0, 100) + '...' : 'No description available'}</p>
                    <a href="#" class="btn btn-primary" data-event-id="${event.id}" onclick="viewEvent(${event.id})">
                        View Details
                    </a>
                </div>
            </div>
        `).join('');
    }
}

// Global function to view event details
function viewEvent(eventId) {
    utils.setUrlParameter('page', 'event-details');
    utils.setUrlParameter('id', eventId);
    if (window.router) {
        window.router.loadPage('event-details');
    }
}

// Initialize home page
window.homePage = new HomePage();
// Events Service - EventHub

class EventsService {
    constructor() {
        this.events = [];
        this.categories = [];
        this.supabaseClient = null;
        this.initWhenReady();
    }

    async initWhenReady() {
        // Wait for Supabase to be ready
        await this.waitForSupabase();
        this.supabaseClient = window.supabase;
    }

    async waitForSupabase() {
        return new Promise((resolve) => {
            const checkSupabase = () => {
                if (window.supabase && typeof window.supabase.from !== 'undefined') {
                    resolve();
                    return;
                }
                setTimeout(checkSupabase, 100);
            };
            
            // Also listen for the custom event
            window.addEventListener('supabaseReady', () => {
                if (window.supabase && typeof window.supabase.from !== 'undefined') {
                    resolve();
                }
            }, { once: true });
            
            checkSupabase();
        });
    }

    // Fetch all events
    async getAllEvents(filters = {}) {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            let query = this.supabaseClient
                .from(TABLES.EVENTS)
                .select(`
                    *,
                    categories (
                        id,
                        name
                    ),
                    profiles (
                        id,
                        full_name
                    )
                `)
                .order('event_date', { ascending: true });

            // Apply filters
            if (filters.category) {
                query = query.eq('category_id', filters.category);
            }
            if (filters.search) {
                query = query.ilike('title', `%${filters.search}%`);
            }
            if (filters.upcoming) {
                query = query.gte('event_date', new Date().toISOString());
            }

            const { data, error } = await query;
            if (error) throw error;

            this.events = data || [];
            return { success: true, data: this.events };
        } catch (error) {
            console.error('Error fetching events:', error);
            return { success: false, error };
        }
    }

    // Get single event by ID
    async getEventById(id) {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            const { data, error } = await this.supabaseClient
                .from(TABLES.EVENTS)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching event:', error);
            return { success: false, error };
        }
    }

    // Create new event
    async createEvent(eventData) {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            const { data, error } = await this.supabaseClient
                .from(TABLES.EVENTS)
                .insert([{
                    title: eventData.title,
                    description: eventData.description,
                    event_date: eventData.event_date,
                    location: eventData.location,
                    max_capacity: eventData.max_capacity,
                    category_id: eventData.category_id,
                    image_url: eventData.image_url,
                    organizer_id: authService.getCurrentUser()?.id
                }])
                .select()
                .single();

            if (error) throw error;

            utils.showAlert('Event created successfully!');
            return { success: true, data };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Update event
    async updateEvent(id, updates) {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            const { data, error } = await this.supabaseClient
                .from(TABLES.EVENTS)
                .update(updates)
                .eq('id', id)
                .eq('organizer_id', authService.getCurrentUser()?.id) // Only allow organizer to update
                .select()
                .single();

            if (error) throw error;

            utils.showAlert('Event updated successfully!');
            return { success: true, data };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Delete event
    async deleteEvent(id) {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            const { error } = await this.supabaseClient
                .from(TABLES.EVENTS)
                .delete()
                .eq('id', id)
                .eq('organizer_id', authService.getCurrentUser()?.id); // Only allow organizer to delete

            if (error) throw error;

            utils.showAlert('Event deleted successfully!');
            return { success: true };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Register for event (book event)
    async registerForEvent(eventId) {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            const userId = authService.getCurrentUser()?.id;
            if (!userId) {
                utils.showAlert('Please sign in to register for events', 'error');
                return { success: false, error: 'Not authenticated' };
            }

            const { data, error } = await this.supabaseClient
                .from(TABLES.REGISTRATIONS)
                .insert([{
                    event_id: eventId,
                    user_id: userId,
                    status: 'confirmed'
                }])
                .select()
                .single();

            if (error) throw error;

            utils.showAlert('Successfully registered for event!');
            return { success: true, data };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Unregister from event (cancel booking)
    async unregisterFromEvent(eventId) {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            const userId = authService.getCurrentUser()?.id;
            if (!userId) return { success: false, error: 'Not authenticated' };

            const { error } = await this.supabaseClient
                .from(TABLES.REGISTRATIONS)
                .delete()
                .eq('event_id', eventId)
                .eq('user_id', userId);

            if (error) throw error;

            utils.showAlert('Successfully unregistered from event');
            return { success: true };
        } catch (error) {
            utils.showAlert(error.message, 'error');
            return { success: false, error };
        }
    }

    // Check if user is registered for event
    async isUserRegistered(eventId) {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            const userId = authService.getCurrentUser()?.id;
            if (!userId) return { success: true, data: false };

            const { data, error } = await this.supabaseClient
                .from(TABLES.REGISTRATIONS)
                .select('id')
                .eq('event_id', eventId)
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            return { success: true, data: !!data };
        } catch (error) {
            console.error('Error checking registration:', error);
            return { success: false, error };
        }
    }

    // Get user's registered events
    async getUserEvents() {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            const userId = authService.getCurrentUser()?.id;
            if (!userId) return { success: false, error: 'Not authenticated' };

            const { data, error } = await this.supabaseClient
                .from(TABLES.REGISTRATIONS)
                .select(`
                    *,
                    events (
                        *,
                        categories (
                            id,
                            name
                        )
                    )
                `)
                .eq('user_id', userId);

            if (error) throw error;

            return { success: true, data: data.map(booking => booking.events) };
        } catch (error) {
            console.error('Error fetching user events:', error);
            return { success: false, error };
        }
    }

    // Get event categories
    async getCategories() {
        try {
            if (!this.supabaseClient) {
                await this.initWhenReady();
            }

            const { data, error } = await this.supabaseClient
                .from(TABLES.CATEGORIES)
                .select('*')
                .order('name');

            if (error) throw error;

            this.categories = data || [];
            return { success: true, data: this.categories };
        } catch (error) {
            console.error('Error fetching categories:', error);
            return { success: false, error };
        }
    }
}

// Initialize events service
const eventsService = new EventsService();
window.eventsService = eventsService;
-- EventHub Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    max_attendees INTEGER,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Technology', 'Tech meetups, conferences, and workshops'),
('Business', 'Networking events, seminars, and conferences'),
('Arts & Culture', 'Art exhibitions, cultural events, and performances'),
('Sports & Fitness', 'Sports events, fitness classes, and outdoor activities'),
('Education', 'Workshops, courses, and educational seminars'),
('Social', 'Social gatherings, parties, and community events')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for events
CREATE POLICY "Events are viewable by everyone" ON events 
    FOR SELECT USING (true);

CREATE POLICY "Users can create events" ON events 
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" ON events 
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events" ON events 
    FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for registrations
CREATE POLICY "Users can view their own registrations" ON registrations 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registrations" ON registrations 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registrations" ON registrations 
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories 
    FOR SELECT USING (true);

-- Create some sample events (optional)
INSERT INTO events (title, description, date, location, category, max_attendees) VALUES
(
    'JavaScript Workshop', 
    'Learn modern JavaScript techniques and best practices in this hands-on workshop.',
    '2026-02-15 14:00:00+00',
    'Tech Hub, Downtown',
    'Technology',
    30
),
(
    'Business Networking Mixer', 
    'Connect with local entrepreneurs and business professionals.',
    '2026-02-20 18:30:00+00',
    'Business Center, Main Street',
    'Business',
    50
),
(
    'Art Gallery Opening', 
    'Discover amazing local artists at our monthly gallery opening.',
    '2026-02-25 19:00:00+00',
    'City Art Gallery',
    'Arts & Culture',
    100
)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
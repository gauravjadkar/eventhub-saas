# EventHub - Event Management Platform

A diploma-level prototype project for managing and discovering events. Built with vanilla HTML, CSS, JavaScript, and Supabase as the backend.

## 🚀 Features

- **Event Discovery**: Browse and search for events
- **User Authentication**: Sign up, sign in, and manage profiles
- **Event Management**: Create, edit, and delete events
- **Event Registration**: Register for events and manage your schedule
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (Database, Authentication, Real-time)
- **Styling**: Custom CSS with modern design principles

## 📁 Project Structure

```
EventHub/
├── index.html                 # Main HTML file
├── assets/
│   └── css/
│       ├── main.css          # Main styles and utilities
│       └── components.css    # Component-specific styles
├── js/
│   ├── config/
│   │   └── supabase.js       # Supabase configuration
│   ├── utils/
│   │   └── helpers.js        # Utility functions
│   ├── services/
│   │   ├── auth.js           # Authentication service
│   │   └── events.js         # Events service
│   ├── components/
│   │   └── navbar.js         # Navigation component
│   ├── pages/
│   │   └── home.js           # Home page component
│   └── app.js                # Main application logic
└── README.md
```

## 🔧 Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Update `js/config/supabase.js` with your credentials:

```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 2. Database Schema

Create the following tables in your Supabase database:
```sql
-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    max_capacity INTEGER,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name) VALUES
('Technology'),
('Business'),
('Arts & Culture'),
('Sports & Fitness'),
('Education'),
('Social')
ON CONFLICT (name) DO NOTHING;
```

### 3. Row Level Security (RLS)

-- Enable Row Level Security (RLS
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for events
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

CREATE POLICY "Users can create events" ON events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own events" ON events
    FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Users can delete their own events" ON events
    FOR DELETE USING (auth.uid() = organizer_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings" ON bookings
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sample events (optional)
INSERT INTO events (organizer_id, category_id, title, description, event_date, location, max_capacity) 
SELECT 
    auth.uid(),
    (SELECT id FROM categories WHERE name = 'Technology' LIMIT 1),
    'JavaScript Workshop',
    'Learn modern JavaScript techniques and best practices in this hands-on workshop.',
    '2026-02-15 14:00:00+00',
    'Tech Hub, Downtown',
    30
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;
```

### 4. Running the Project

1. Clone or download the project files
2. Open `index.html` in a web browser, or
3. Use a local server (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

## 🎯 Key Features Implementation

### Authentication
- User registration and login
- Password reset functionality
- Protected routes for authenticated users
- Automatic UI updates based on auth state

### Event Management
- Create, read, update, delete events
- Event categorization
- Image upload support
- Event search and filtering

### Event Registration
- Register/unregister for events
- View registered events
- Registration status tracking

### Responsive Design
- Mobile-first approach
- Clean, modern UI
- Accessible components
- Loading states and error handling

## 🔮 Future Enhancements

- Event comments and reviews
- Email notifications
- Calendar integration
- Social media sharing
- Advanced search filters
- Event analytics
- Payment integration
- Real-time updates

## 📝 Notes

This is a prototype project designed for educational purposes. The code structure emphasizes clarity and maintainability, making it perfect for learning modern web development concepts with vanilla JavaScript and Supabase.

## 🤝 Contributing

This is a diploma project, but suggestions and improvements are welcome for educational purposes.

## 📄 License

This project is for educational use only.

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

#### Events Table
```sql
CREATE TABLE events (
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
```

#### Registrations Table
```sql
CREATE TABLE registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);
```

#### Categories Table
```sql
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default categories
INSERT INTO categories (name, description) VALUES
('Technology', 'Tech meetups, conferences, and workshops'),
('Business', 'Networking events, seminars, and conferences'),
('Arts & Culture', 'Art exhibitions, cultural events, and performances'),
('Sports & Fitness', 'Sports events, fitness classes, and outdoor activities'),
('Education', 'Workshops, courses, and educational seminars'),
('Social', 'Social gatherings, parties, and community events');
```

### 3. Row Level Security (RLS)

Enable RLS and create policies for your tables:

```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() = created_by);

-- Registrations policies
CREATE POLICY "Users can view their own registrations" ON registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own registrations" ON registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own registrations" ON registrations FOR DELETE USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
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
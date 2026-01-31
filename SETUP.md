# EventHub Setup Guide

## 🚀 Quick Setup Instructions

### 1. Database Setup

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project: `https://cqynjvgsknybcbrstyne.supabase.co`

2. **Run the Database Schema**
   - Go to the **SQL Editor** in your Supabase dashboard
   - Copy and paste the entire contents of `database-schema.sql`
   - Click **Run** to execute the SQL

3. **Verify Tables Created**
   - Go to **Table Editor** in your dashboard
   - You should see these tables:
     - `events`
     - `registrations` 
     - `categories`

### 2. Test the Application

1. **Open the Application**
   - Open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

2. **Check Console**
   - Open browser Developer Tools (F12)
   - Look for these success messages:
     - "Supabase client initialized successfully"
     - "Supabase client ready"
     - "EventHub application initialized"

### 3. Expected Behavior

✅ **What Should Work Now:**
- Home page loads without errors
- Featured events section displays (may show "No upcoming events" if database is empty)
- Navigation works
- No console errors related to Supabase

❌ **If You Still See Errors:**
- Check that all tables were created in Supabase
- Verify your Supabase URL and API key are correct
- Make sure Row Level Security policies were applied

### 4. Next Steps

Once the basic setup works:

1. **Test User Registration**
   - Click "Register" and create a test account
   - Check your email for verification

2. **Create Test Events**
   - Sign in and try creating an event
   - Verify it appears on the home page

3. **Test Event Registration**
   - Register for events as different users
   - Check the "My Events" page

## 🔧 Troubleshooting

### Common Issues:

**"Column does not exist" errors:**
- Make sure you ran the complete `database-schema.sql`
- Check the Table Editor to verify column names

**"Permission denied" errors:**
- Verify RLS policies were created
- Check that you're signed in when creating/editing events

**Supabase client errors:**
- Verify your project URL and API key
- Make sure the Supabase library is loading (check Network tab)

### Database Schema Summary:

**Events Table:**
- `id`, `title`, `description`, `date`, `location`
- `image_url`, `category`, `max_attendees`
- `created_by`, `created_at`, `updated_at`

**Registrations Table:**
- `id`, `event_id`, `user_id`, `registered_at`

**Categories Table:**
- `id`, `name`, `description`, `created_at`

## 📝 Sample Data

The schema includes sample events and categories. You can:
- View sample events on the home page
- Use sample categories when creating events
- Add your own test data through the Supabase dashboard
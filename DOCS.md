# Huddle Up Time - Complete Documentation

> **A beautiful, real-time multi-user availability calendar for coordinating group schedules**

![Huddle Up Time](./public/huddleuptime_logo.png)

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## Overview

Huddle Up Time is a modern Vue 3 application that makes it easy for groups to coordinate availability. Built with Vuetify and Supabase, it provides real-time synchronization across devices with a beautiful, responsive interface.

🌐 **Live Demo:** https://huddleuptime.netlify.app

### Tech Stack

- **Frontend**: Vue 3 (Composition API)
- **UI Framework**: Vuetify 3 (Material Design)
- **Calendar**: V-Calendar
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Build Tool**: Vite

---

## Features

✨ **Beautiful UI** - Modern gradient hero section with prominent logo
👥 **Multi-User Support** - Track availability for 5 users (configurable)
🎨 **Color-Coded** - Each user has unique color theme
⚡ **Real-Time Sync** - Changes appear instantly across all devices
📱 **Responsive Design** - Works on desktop, tablet, and mobile
🌍 **Timezone Safe** - Dates display correctly everywhere
📅 **Dynamic Dates** - Automatically shows current month + 3 months ahead
⚙️ **Easy Configuration** - Single config file for all settings

---

## Quick Start

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Supabase Account** - [Sign up free](https://supabase.com)

### Step 1: Install Dependencies

```bash
cd huddleuptime
npm install
```

### Step 2: Set Up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run this SQL** in the Supabase SQL Editor:

```sql
CREATE TABLE user_availability (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    selected_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_name, selected_date)
);

CREATE INDEX idx_user_availability_user_name ON user_availability(user_name);
CREATE INDEX idx_user_availability_date ON user_availability(selected_date);

ALTER TABLE user_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON user_availability
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON user_availability
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON user_availability
    FOR DELETE USING (true);
```

3. **Get your credentials** from Project Settings → API

### Step 3: Configure Environment

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your Huddle Up Time calendar!

---

## Configuration

All configuration is in `config.js` at the project root.

### Configure Users

```javascript
users: [
  {
    name: 'Tamara & Rob',
    color: '#9C27B0',        // Purple
    displayColor: '#7B1FA2',
    textColor: '#FFFFFF'
  },
  {
    name: 'Rachel',
    color: '#4CAF50',        // Green
    displayColor: '#388E3C',
    textColor: '#FFFFFF'
  },
  // Add more users...
]
```

**Color Guidelines:**
- `color` - Used for calendar date highlights
- `displayColor` - Used for UI elements (buttons, chips)
- `textColor` - Text color on colored backgrounds

### Date Range

The calendar automatically shows **current month + next 3 months**. This is dynamic and updates automatically.

```javascript
dateRange: {
  getStartDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  },
  getEndDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 3, 0);
  }
}
```

### App Branding

```javascript
appName: 'Huddle Up Time Availability Calendar',
appShortName: 'Huddle Up Time',
logoPath: '/huddleuptime_logo.png',
```

Replace `public/huddleuptime_logo.png` with your own logo (recommended: square PNG, 512x512px).

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Add environment variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Redeploy** to apply changes:
```bash
vercel --prod
```

### Deploy to Netlify

**Current Deployment:** https://huddleuptime.netlify.app

1. **Install Netlify CLI**:
```bash
npm i -g netlify-cli
```

2. **Build**:
```bash
npm run build
```

3. **Deploy**:
```bash
netlify deploy --prod --dir=dist
```

4. **Add environment variables** in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Deploy to GitHub Pages

1. **Update `vite.config.js`**:
```javascript
export default defineConfig({
  base: '/huddle-up-time/',  // Your repo name
  // ...
})
```

2. **Build**:
```bash
npm run build
```

3. **Deploy** the `dist` folder to GitHub Pages

---

## Project Structure

```
huddleuptime/
├── config.js                # ⚙️ Main configuration
├── .env                     # 🔐 Supabase credentials
├── index.html               # Entry point
├── package.json             # Dependencies
├── vite.config.js           # Build config
├── public/
│   └── huddleuptime_logo.png   # App logo
└── src/
    ├── main.js              # App initialization
    ├── App.vue              # Main component
    ├── components/
    │   ├── Calendar.vue     # Calendar display
    │   ├── UserSelector.vue # User selection
    │   ├── OverlapDates.vue # Overlap display
    │   └── LoadingState.vue # Loading UI
    └── composables/
        ├── useSupabase.js   # Database operations
        ├── useUsers.js      # User management
        └── useDates.js      # Date utilities
```

### Key Files

**`config.js`** - All user settings, colors, and configuration
**`src/App.vue`** - Main app layout with hero section and logo
**`src/composables/useSupabase.js`** - All database operations
**`src/components/Calendar.vue`** - Calendar component using v-calendar

---

## Troubleshooting

### Nothing renders in browser

**Problem**: Blank page or errors in console

**Solution**: 
1. Check that `.env` file exists with valid Supabase credentials
2. Verify Supabase is running and accessible
3. Check browser console for specific errors
4. Try running in demo mode (placeholder credentials work)

### Calendar doesn't show dates

**Problem**: Calendar renders but no dates appear

**Solution**:
1. Check that the date range is valid in `config.js`
2. Verify database table exists in Supabase
3. Check RLS policies are enabled

### Real-time sync not working

**Problem**: Changes don't appear on other devices

**Solution**:
1. Verify Supabase Realtime is enabled for your table
2. Check that RLS policies allow reads
3. Look for connection errors in console

### Deployment issues

**Problem**: App works locally but not when deployed

**Solution**:
1. Ensure environment variables are set in your hosting platform
2. Check that the build completed successfully
3. Verify `base` path in `vite.config.js` if using GitHub Pages
4. Check browser console for 404 errors

### Logo not displaying

**Problem**: Logo doesn't appear in hero section

**Solution**:
1. Verify `huddleuptime_logo.png` exists in `public/` folder
2. Check `logoPath` in `config.js` is correct
3. Ensure image format is valid (PNG recommended)
4. Check browser console for 404 errors

---

## Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vue 3 Docs**: https://vuejs.org/
- **Vuetify Docs**: https://vuetifyjs.com/
- **V-Calendar**: https://vcalendar.io/

---

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Verify configuration in `config.js`
4. Check Supabase dashboard for database issues

---

**Built with ❤️ using Vue 3, Vuetify, and Supabase**

# Venue Data Setup Guide

## Overview
The venue page now fetches real data from the backend MongoDB database. To see venues displayed on the page, you need to populate the database with venue and ground data.

## Backend Database Structure

### Collections:
1. **Venues** - Parent locations (stadiums, sports complexes)
   - name, location, state, city, manager, approved

2. **Grounds** - Individual sports facilities within venues
   - name, description, imageUrl, sport, pricePerHour, venue (reference)

## Option 1: Quick Seed (Recommended for Testing)

The backend includes a seed endpoint that creates sample data:

### Steps:
1. **Start your backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Seed the database** by visiting this URL in your browser or using curl:
   ```
   http://localhost:5000/api/grounds/seed
   ```

   Or using curl:
   ```bash
   curl http://localhost:5000/api/grounds/seed
   ```

3. **Check the response** - You should see:
   ```json
   {
     "message": "Success! Added 3 grounds to your database.",
     "grounds": [...]
   }
   ```

4. **Refresh the venue page** at `http://localhost:5173/player/grounds`

## Option 2: Add Venues via Venue Manager Portal

For production data, venues should be added through the proper workflow:

1. **Register as a Venue Manager**
   - Go to the registration page
   - Select "Venue Manager" role
   - Complete registration

2. **Create a Venue**
   - Login as venue manager
   - Go to "My Venues" section
   - Click "Add Venue"
   - Fill in venue details (name, location, state, city)
   - Submit for admin approval

3. **Add Grounds to Venue**
   - Once venue is approved
   - Go to "Manage Grounds"
   - Add individual grounds/pitches/courts
   - Specify sport type, price per hour, description

4. **Admin Approval**
   - Admin approves the venue
   - Grounds become visible on the player grounds page

## Option 3: Manual MongoDB Insert

Connect to MongoDB and manually insert data:

```javascript
// Connect to your MongoDB database
use your_database_name

// Insert Venues
db.venues.insertMany([
  {
    name: "Chennai Sports Complex",
    location: "Anna Nagar",
    state: "Tamil Nadu",
    city: "Chennai",
    approved: true,
    manager: ObjectId("...") // optional
  },
  {
    name: "Mumbai Cricket Stadium",
    location: "Bandra",
    state: "Maharashtra", 
    city: "Mumbai",
    approved: true,
    manager: ObjectId("...") // optional
  }
])

// Get venue IDs and insert Grounds
db.grounds.insertMany([
  {
    venue: ObjectId("..."), // venue ID from above
    name: "Main Football Turf",
    description: "Professional 7-a-side football turf with floodlights",
    sport: "Football",
    pricePerHour: 1500,
    imageUrl: "https://images.unsplash.com/photo-1518605368461-1ee7c5cd1536?w=500&q=80"
  },
  {
    venue: ObjectId("..."), // venue ID from above
    name: "Cricket Practice Net",
    description: "Full-size cricket practice net with bowling machine",
    sport: "Cricket", 
    pricePerHour: 800,
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&q=80"
  }
])
```

## Verifying Data

After seeding, check your data:

1. **API Test** - Visit:
   ```
   http://localhost:5000/api/grounds/search?q=
   ```

2. **Frontend Display** - Check:
   ```
   http://localhost:5173/player/grounds
   ```

## Troubleshooting

### No venues showing up?
- Check if backend is running on port 5000
- Verify MongoDB connection
- Check browser console for API errors
- Try seeding the database first

### Images not loading?
- Grounds need `imageUrl` field populated
- Or use the auto-generated sport images (fallback)

### Search not working?
- Backend search API: `/api/grounds/search?q=keyword`
- Check browser Network tab for API responses
- Verify grounds have proper venue references populated

## API Endpoints

- **Search Grounds**: `GET /api/grounds/search?q=&state=&city=`
- **Get Ground Details**: `GET /api/grounds/:id`
- **Seed Data**: `GET /api/grounds/seed` (development only)

## Next Steps

After testing with seed data, you should:
1. Clear seed data: `db.grounds.deleteMany({})` and `db.venues.deleteMany({})`
2. Add real venues through the Venue Manager portal
3. Set up proper admin approval workflow

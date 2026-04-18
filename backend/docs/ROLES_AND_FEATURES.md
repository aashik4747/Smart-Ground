# Turf Town - Roles and Features Documentation

This document provides a comprehensive overview of all user roles, their permissions, accessible pages, API endpoints, and feature access in the Turf Town platform.

---

════════════════════════════════
ROLE: admin
════════════════════════════════
📋 Description: System administrator with full control over all aspects of the platform
🔐 Auth: Registers with ADMIN_SECRET_KEY environment variable, or can be created by existing admin
🏠 Pages:
- /admin/dashboard - Admin dashboard with statistics
- /admin/users - User management page
- /admin/venues - Venue management page
- /admin/grounds - Ground management page
- /admin/stalls - Stall management page
- /admin/bookings - Booking management page
- /admin/matches - Match management page
- /admin/payments - Payment management page
- /admin/analytics - Analytics dashboard

✅ CAN DO:
- View and manage all users (players, stall owners, admins)
- Update user roles and status (active, suspended, banned)
- Create, update, delete venues
- Approve venue requests
- Create, update, delete grounds
- View all bookings
- View and approve/reject match requests
- View all stalls
- View all payments
- View admin analytics and statistics
- Access all admin dashboard features

❌ CANNOT DO:
- Book grounds as a player (no player booking flow)
- Join matches as a player
- Create stalls (stall owners create stalls)
- Follow other users (social features for players)

🌟 Unique Features:
- Full system control and oversight
- User account management (ban/suspend)
- Venue approval workflow
- Match request moderation
- Access to comprehensive analytics
- Can create venues directly (auto-approved)
- Can manage all platform resources

📡 API Endpoints They Can Access:
- GET /api/admin/stats → Get dashboard statistics
- GET /api/admin/users → Get all users
- PUT /api/admin/users/:id → Update user
- DELETE /api/admin/users/:id → Delete user
- GET /api/admin/venues → Get all venues
- POST /api/admin/venues → Create venue (with validation)
- PUT /api/admin/venues/:id → Update venue
- DELETE /api/admin/venues/:id → Delete venue
- PUT /api/admin/venues/:id/approve → Approve venue
- GET /api/admin/grounds → Get all grounds
- POST /api/admin/grounds → Create ground
- PUT /api/admin/grounds/:id → Update ground
- DELETE /api/admin/grounds/:id → Delete ground
- GET /api/admin/venue-manager-stats → Get venue statistics
- GET /api/admin/bookings → Get all bookings
- GET /api/admin/matches → Get all matches
- PUT /api/admin/matches/:id/approve → Approve match
- PUT /api/admin/matches/:id/reject → Reject match
- GET /api/admin/stalls → Get all stalls
- GET /api/admin/payments → Get all payments

════════════════════════════════
ROLE: player
════════════════════════════════
📋 Description: Regular users who can book grounds, join matches, and interact with the community
🔐 Auth: Registers with email/password or Google OAuth, then selects "player" role via role selection modal
🏠 Pages:
- /player/home - Home page
- /player/grounds - Search and browse grounds
- /player/book-slot/:id - Book a ground slot
- /player/bookings - View my bookings
- /player/matches - Browse available matches
- /player/my-matches - View my matches
- /player/match/:id - View match details
- /player/match-chat/:id - Match chat interface
- /player/reviews - Reviews page
- /player/profile - Player profile
- /dashboard - Common dashboard
- /chat - Chat interface
- /notifications - Notifications
- /settings - Settings

✅ CAN DO:
- Search and browse grounds/venues
- Book ground slots
- Create match requests
- Join matches (if slots available)
- Leave matches
- Cancel own matches (if host)
- View own bookings
- View match details
- Participate in match chat
- Follow other players
- View discoverable players
- Update profile with turf ID, skill level, preferred sports
- View notifications
- Access common features (chat, settings)

❌ CANNOT DO:
- Create or manage venues
- Create or manage grounds
- Create or manage stalls
- Approve venues or matches
- Manage other users
- Access admin dashboard
- View all bookings (only own)
- View all matches (only public and own)

🌟 Unique Features:
- Gamification system (reliability score, MVP awards)
- Social features (follow/unfollow players)
- Turf ID system for unique player identity
- Skill level tracking (Beginner, Intermediate, Advanced)
- Match making and community features
- Private match creation
- Waitlist functionality for full matches

📡 API Endpoints They Can Access:
- POST /api/auth/login → Login
- POST /api/auth/register → Register
- POST /api/auth/verify-otp → Verify OTP
- POST /api/auth/google → Google OAuth
- POST /api/auth/logout → Logout
- PUT /api/auth/turfid → Set Turf ID
- POST /api/users/role → Set initial role
- GET /api/users/me → Get profile
- PUT /api/users/me → Update profile
- GET /api/users/discover → Get discoverable players
- POST /api/users/:id/follow → Follow user
- POST /api/users/:id/unfollow → Unfollow user
- GET /api/venues → Search venues
- GET /api/grounds/search → Search grounds
- GET /api/grounds/:id → Get ground details
- POST /api/bookings → Create booking
- GET /api/bookings/slots → Get booked slots
- GET /api/bookings/my-bookings → Get my bookings
- GET /api/matches → Get all matches
- GET /api/matches/my-matches → Get my matches
- GET /api/matches/:id → Get match details
- POST /api/matches → Create match
- POST /api/matches/:id/join → Join match
- POST /api/matches/:id/leave → Leave match
- DELETE /api/matches/:id → Cancel match

════════════════════════════════
ROLE: stallOwner
════════════════════════════════
📋 Description: Users who can rent stall spaces during matches or tournaments
🔐 Auth: Registers with email/password or Google OAuth, then selects "stallOwner" role via role selection modal
🏠 Pages:
- /stall/dashboard - Stall owner dashboard
- /stall/events - Browse events
- /stall/request - Request stall space
- /stall/my-stalls - View my stalls
- /stall/payments - View payments
- /stall/documents - Documents
- /dashboard - Common dashboard
- /chat - Chat interface
- /notifications - Notifications
- /settings - Settings

✅ CAN DO:
- Create stall requests for events
- View own stalls
- View stall payments
- Manage stall documents
- Browse events
- Update profile
- Access common features (chat, settings, notifications)

❌ CANNOT DO:
- Book grounds
- Create or manage matches
- Create or manage venues
- Create or manage grounds
- Access admin features
- View all bookings or matches

🌟 Unique Features:
- Stall space rental for events/tournaments
- Event browsing
- Stall request workflow
- Payment tracking for stall rentals
- Document management for stall permits

📡 API Endpoints They Can Access:
- POST /api/auth/login → Login
- POST /api/auth/register → Register
- POST /api/auth/verify-otp → Verify OTP
- POST /api/auth/google → Google OAuth
- POST /api/auth/logout → Logout
- PUT /api/auth/turfid → Set Turf ID
- POST /api/users/role → Set initial role
- GET /api/users/me → Get profile
- PUT /api/users/me → Update profile
- POST /api/stalls → Create stall request
- GET /api/stalls/admin/all → Get all stalls (if admin)
- GET /api/venues → Search venues (public access)
- GET /api/grounds/search → Search grounds (public access)

════════════════════════════════
ROLE: pending
════════════════════════════════
📋 Description: Initial state for new users who haven't selected their role yet
🔐 Auth: Registers with email/password or Google OAuth, receives OTP via email for verification
🏠 Pages:
- Role selection modal (shown after OTP verification)
- Login page (if OTP not verified)

✅ CAN DO:
- Verify account with OTP
- Select role (player or stallOwner)
- Update profile (basic)

❌ CANNOT DO:
- Book grounds
- Create matches
- Create stalls
- Access any role-specific features
- Access dashboard until role is selected

🌟 Unique Features:
- OTP-based account verification
- One-time role selection
- Email verification required before role assignment

📡 API Endpoints They Can Access:
- POST /api/auth/register → Register
- POST /api/auth/verify-otp → Verify OTP
- POST /api/auth/login → Login (if OTP verified)
- POST /api/auth/google → Google OAuth
- POST /api/users/role → Set initial role
- PUT /api/auth/turfid → Set Turf ID (after role selection)

---

## FEATURE MATRIX

| Feature | Admin | Player | StallOwner |
|---------|-------|--------|------------|
| View Venues | ✅ | ✅ | ✅ |
| Search Grounds | ✅ | ✅ | ✅ |
| Book a Ground | ✅ | ✅ | ❌ |
| Create Venue | ✅ | ❌ | ❌ |
| Manage Venues | ✅ | ❌ | ❌ |
| Approve Venues | ✅ | ❌ | ❌ |
| Create Ground | ✅ | ❌ | ❌ |
| Manage Grounds | ✅ | ❌ | ❌ |
| Create Match Request | ✅ | ✅ | ❌ |
| Join Match | ✅ | ✅ | ❌ |
| Leave Match | ✅ | ✅ | ❌ |
| Cancel Match | ✅ | ✅ | ❌ |
| Create Stall Request | ✅ | ❌ | ✅ |
| Manage Stalls | ✅ | ❌ | ✅ |
| View All Bookings | ✅ | ❌ | ❌ |
| View My Bookings | ✅ | ✅ | ❌ |
| View All Matches | ✅ | ❌ | ❌ |
| View My Matches | ✅ | ✅ | ❌ |
| View All Users | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Update User Status | ✅ | ❌ | ❌ |
| View All Stalls | ✅ | ❌ | ❌ |
| View My Stalls | ✅ | ❌ | ✅ |
| View All Payments | ✅ | ❌ | ❌ |
| View My Payments | ✅ | ❌ | ✅ |
| View Admin Dashboard | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ❌ | ❌ |
| Follow Users | ❌ | ✅ | ❌ |
| View Discoverable Players | ❌ | ✅ | ❌ |
| Update Profile | ✅ | ✅ | ✅ |
| Set Turf ID | ✅ | ✅ | ✅ |
| Match Chat | ✅ | ✅ | ❌ |
| Notifications | ✅ | ✅ | ✅ |
| Common Dashboard | ✅ | ✅ | ✅ |
| Chat | ✅ | ✅ | ✅ |
| Settings | ✅ | ✅ | ✅ |

---

## ROLE FLOW

1. **Registration Flow:**
   - User registers with email/password or Google OAuth
   - OTP sent to email for verification
   - User verifies OTP
   - Role selection modal appears
   - User selects "player" or "stallOwner"
   - Role is set and user redirected to appropriate dashboard

2. **Admin Registration:**
   - Admin registers with ADMIN_SECRET_KEY
   - OTP verification required
   - Role automatically set to "admin" (no selection needed)
   - Redirected to admin dashboard

3. **Role Change:**
   - Once role is set, it cannot be changed through normal flow
   - Admin can manually change user roles via admin panel

---

## SECURITY NOTES

- All protected routes require JWT authentication via httpOnly cookies
- OTPs are now hashed with bcrypt (10 rounds) before storage
- Request size limited to 10kb to prevent DoS attacks
- Socket.io CORS restricted to specific origins based on environment
- Debug endpoint only available in non-production environments
- Rate limiting applied to all API routes (200 requests per 15 minutes)
- Admin routes require both authentication and admin role verification

---

## API ENDPOINT SUMMARY

**Authentication Endpoints (All Roles):**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-otp
- POST /api/auth/google
- POST /api/auth/logout
- PUT /api/auth/turfid

**User Endpoints:**
- POST /api/users/role
- GET /api/users/me
- PUT /api/users/me
- GET /api/users/discover
- POST /api/users/:id/follow
- POST /api/users/:id/unfollow

**Venue Endpoints:**
- GET /api/venues
- GET /api/venues/admin/all (admin)
- POST /api/admin/venues (admin, with validation)
- PUT /api/admin/venues/:id (admin)
- DELETE /api/admin/venues/:id (admin)
- PUT /api/admin/venues/:id/approve (admin)

**Ground Endpoints:**
- GET /api/grounds/search
- GET /api/grounds/:id
- GET /api/grounds/seed (development)
- GET /api/admin/grounds (admin)
- POST /api/admin/grounds (admin)
- PUT /api/admin/grounds/:id (admin)
- DELETE /api/admin/grounds/:id (admin)

**Booking Endpoints:**
- POST /api/bookings
- GET /api/bookings/slots
- GET /api/bookings/my-bookings
- GET /api/admin/bookings (admin)

**Match Endpoints:**
- GET /api/matches
- GET /api/matches/my-matches
- GET /api/matches/:id
- POST /api/matches
- POST /api/matches/:id/join
- POST /api/matches/:id/leave
- DELETE /api/matches/:id
- GET /api/admin/matches (admin)
- PUT /api/admin/matches/:id/approve (admin)
- PUT /api/admin/matches/:id/reject (admin)

**Stall Endpoints:**
- POST /api/stalls
- GET /api/stalls/admin/all (admin)
- GET /api/admin/stalls (admin)

**Admin Endpoints:**
- GET /api/admin/stats
- GET /api/admin/users
- PUT /api/admin/users/:id
- DELETE /api/admin/users/:id
- GET /api/admin/venue-manager-stats

**Payment Endpoints:**
- POST /api/payments
- GET /api/admin/payments (admin)

---

*Last Updated: April 2026*
*Version: 1.0*

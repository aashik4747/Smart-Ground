import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

// Public Pages
const Home = lazy(() => import('./pages/Player/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const VerifyOTP = lazy(() => import('./pages/Auth/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/Auth/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/Admin/ManageUsers'));
const AdminVenues = lazy(() => import('./pages/Admin/AdminVenues'));
const AdminGrounds = lazy(() => import('./pages/Admin/AdminGrounds'));
const AdminStalls = lazy(() => import('./pages/Admin/AdminStalls'));
const AdminBookings = lazy(() => import('./pages/Admin/AdminBookings'));
const AdminMatches = lazy(() => import('./pages/Admin/AdminMatches'));
const AdminPayments = lazy(() => import('./pages/Admin/AdminPayments'));
const AdminAnalytics = lazy(() => import('./pages/Admin/AdminAnalytics'));

// Common Pages
const Dashboard = lazy(() => import('./pages/Common/Dashboard'));
const Chat = lazy(() => import('./pages/Common/Chat'));
const Notifications = lazy(() => import('./pages/Common/Notifications'));
const Settings = lazy(() => import('./pages/Common/Settings'));
const NotFound = lazy(() => import('./pages/Common/NotFound'));
const Unauthorized = lazy(() => import('./pages/Common/Unauthorized'));
// Add generic auth-based setting fallbacks later if needed

// Player Pages
const SearchGrounds = lazy(() => import('./pages/Player/SearchGrounds'));
const BookSlot = lazy(() => import('./pages/Player/BookSlot'));
const MyBookings = lazy(() => import('./pages/Player/MyBookings'));
const BrowseMatches = lazy(() => import('./pages/Player/BrowseMatches'));
const MyMatches = lazy(() => import('./pages/Player/MyMatches'));
const MatchDetails = lazy(() => import('./pages/Player/MatchDetails'));
const MatchChat = lazy(() => import('./pages/Player/MatchChat'));
const Reviews = lazy(() => import('./pages/Player/Reviews'));
const Profile = lazy(() => import('./pages/Player/Profile'));

// Venue Manager Pages (deprecated - moved to admin)
// const ManagerDashboard = lazy(() => import('./pages/VenueManager/ManagerDashboard'));
// const ManageVenues = lazy(() => import('./pages/VenueManager/ManageVenues'));
// const ManageGrounds = lazy(() => import('./pages/VenueManager/ManageGrounds'));
// const SlotManagement = lazy(() => import('./pages/VenueManager/SlotManagement'));
// const StallManagement = lazy(() => import('./pages/VenueManager/StallManagement'));
// const BookingRequests = lazy(() => import('./pages/VenueManager/BookingRequests'));
// const MatchList = lazy(() => import('./pages/VenueManager/MatchList'));
// const Revenue = lazy(() => import('./pages/VenueManager/Revenue'));

// Stall Owner Pages
const StallDashboard = lazy(() => import('./pages/StallOwner/StallDashboard'));
const BrowseEvents = lazy(() => import('./pages/StallOwner/BrowseEvents'));
const RequestStall = lazy(() => import('./pages/StallOwner/RequestStall'));
const MyStalls = lazy(() => import('./pages/StallOwner/MyStalls'));
const Payments = lazy(() => import('./pages/StallOwner/Payments'));
const Documents = lazy(() => import('./pages/StallOwner/Documents'));

// Manager Pages
const ManagerDashboard = lazy(() => import('./pages/Manager/ManagerDashboard'));

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow">
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/player/grounds" element={<Navigate to="/user/grounds" replace />} />
            <Route path="/player/matches" element={<Navigate to="/user/matches" replace />} />
            <Route path="/player/bookings" element={<Navigate to="/user/bookings" replace />} />
            <Route path="/player/profile" element={<Navigate to="/user/profile" replace />} />
            <Route path="/player/match/:id" element={<Navigate to={({ params }) => `/user/match/${params.id}`} replace />} />
            <Route path="/player/match-chat/:id" element={<Navigate to={({ params }) => `/user/match-chat/${params.id}`} replace />} />
            <Route path="/player/my-matches" element={<Navigate to="/user/my-matches" replace />} />
            <Route path="/player/book-venue/:id" element={<Navigate to={({ params }) => `/user/book-venue/${params.id}`} replace />} />

            {/* Protected Routes - Common */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* User Routes (formerly Player) */}
            <Route element={<ProtectedRoute roles={['user']} />}>
              <Route path="/user/home" element={<Home />} />
              <Route path="/user/grounds" element={<SearchGrounds />} />
              <Route path="/user/book-venue/:id" element={<BookSlot />} />
              <Route path="/user/bookings" element={<MyBookings />} />
              <Route path="/user/matches" element={<BrowseMatches />} />
              <Route path="/user/my-matches" element={<MyMatches />} />
              <Route path="/user/match/:id" element={<MatchDetails />} />
              <Route path="/user/match-chat/:id" element={<MatchChat />} />
              <Route path="/user/reviews" element={<Reviews />} />
              <Route path="/user/profile" element={<Profile />} />
            </Route>

            {/* Manager Routes (formerly Stall Owner) */}
            <Route element={<ProtectedRoute roles={['manager']} />}>
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/events" element={<BrowseEvents />} />
              <Route path="/manager/request" element={<RequestStall />} />
              <Route path="/manager/my-stalls" element={<MyStalls />} />
              <Route path="/manager/payments" element={<Payments />} />
              <Route path="/manager/documents" element={<Documents />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/venues" element={<AdminVenues />} />
              <Route path="/admin/grounds" element={<AdminGrounds />} />
              <Route path="/admin/stalls" element={<AdminStalls />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/matches" element={<AdminMatches />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default AppRoutes;

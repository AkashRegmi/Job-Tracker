import { createBrowserRouter, Navigate } from "react-router-dom";

// Auth pages
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import VerifyOTP from "../features/auth/pages/VerifyOTP";
import Home from "../features/marketing/pages/Home";
import AdminUsers from "../features/admin/pages/AdminUsers";
import JobApplications from "../features/job-applications/pages/JobApplications";
import JobApplicationDashboard from "../features/job-applications/pages/JobApplicationDashboard";

// Layout
import MainLayout from "../components/layout/MainLayout";

// Routes
import ProtectedRoute from "../routes/ProtectedRoute";
import GuestRoute from "../routes/GuestRoute";
import AdminRoute from "../routes/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  // Guest routes
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOTP />,
      },
    ],
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/applications/dashboard",
            element: <JobApplicationDashboard />,
          },
          {
            path: "/applications",
            element: <JobApplications />,
          },
          {
            path: "/admin/users",
            element: (
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            ),
          },
          { path: "/dashboard", element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },

  // Unknown routes
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;

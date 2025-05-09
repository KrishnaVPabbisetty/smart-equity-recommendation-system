// import {
//     BrowserRouter as Router,
//     Routes,
//     Route,
//     Navigate,
//   } from "react-router-dom";
  
//   import Login from "../pages/Login";
//   import Signup from "../pages/Signup";
//   import Dashboard from "../pages/Dashboard";
//   import AuthLayout from "../layouts/AuthLayout";
//   import MainLayout from "../layouts/MainLayout";
//   import Profile from "../pages/Profile";
//   import AdminPanel from "../pages/AdminPanel";
//   import AIAssistant from "../components/AIAssistant";

  
//   const isAuthenticated = () => {
//     return !!localStorage.getItem("token");
//   };
  
//   // 🛡 Protected Route Wrapper
//   const PrivateRoute = ({ children }) => {
//     return isAuthenticated() ? children : <Navigate to="/login" />;
//   };
  
//   const AppRoutes = () => {
//     return (
//       <Router>
//         <Routes>
//           {/* Public Routes (No Navbar) */}
//           <Route element={<AuthLayout />}>
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//           </Route>
  
//           {/* Protected App Routes */}
//           <Route element={<MainLayout />}>
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <Dashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//                 path="/profile"
//                 element={
//                 <PrivateRoute>
//                     <Profile />
//                 </PrivateRoute>
//                 }
//             />
//             <Route
//                 path="/admin"
//                 element={
//                 <PrivateRoute>
//                     <AdminPanel />
//                 </PrivateRoute>
//                 }
//             />
//             <Route path="/ai-assistant" element={<AIAssistant />} />
//             </Route>
  
//           {/* Catch All */}
//           <Route path="*" element={<Navigate to="/dashboard" />} />
//         </Routes>
//       </Router>
//     );
//   };
  
//   export default AppRoutes;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Profile from "../pages/Profile";
import AdminPanel from "../pages/AdminPanel";
import AIAssistant from "../components/AIAssistant";

// 🔐 Simple mock check for token-based authentication
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// 🛡 Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const location = useLocation(); // Get the current location
  
  if (!isAuthenticated()) {
    // Save the current location (page the user is trying to access)
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children; // If authenticated, render children (protected route)
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes (No Navbar) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Route>

        {/* Catch All Route (Redirect to Login Page if Route Not Found) */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FacilityDashboard from './pages/FacilityDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRoles={['Student', 'Faculty']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/facility" 
          element={
            <ProtectedRoute allowedRoles={['Facility Manager']}>
              <FacilityDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              {user?.role === 'Admin' && <Navigate to="/admin" replace />}
              {user?.role === 'Facility Manager' && <Navigate to="/facility" replace />}
              {(user?.role === 'Student' || user?.role === 'Faculty') && <Navigate to="/student" replace />}
              <Navigate to="/login" replace />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App; 
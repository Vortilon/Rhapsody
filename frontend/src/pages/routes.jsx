import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PDFListPage from './pages/PDFListPage';
import PDFViewerPage from './pages/PDFViewerPage';
import PDFUploadPage from './pages/PDFUploadPage';

export default function Router() {
  // Simple auth check - in a real app, you would check for a valid token
  const isAuthenticated = () => {
    return localStorage.getItem('jwt') !== null;
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/pdfs" />} />
        <Route path="pdfs" element={<PDFListPage />} />
        <Route path="pdfs/:id" element={<PDFViewerPage />} />
        <Route path="pdfs/upload" element={<PDFUploadPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

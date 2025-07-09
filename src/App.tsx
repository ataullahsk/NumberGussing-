import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LoansPage, LoanDetailPage } from './pages/LoansPage';
import { ApplyPage } from './pages/ApplyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ApplicationsPage } from './pages/admin/ApplicationsPage';
import { useStore } from './store/useStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
}

function App() {
  const { isAuthenticated } = useStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          } />
          
          <Route path="/loans" element={
            <>
              <Header />
              <LoansPage />
              <Footer />
            </>
          } />
          
          <Route path="/loans/:id" element={
            <>
              <Header />
              <LoanDetailPage />
              <Footer />
            </>
          } />
          
          <Route path="/apply" element={
            <>
              <Header />
              <ApplyPage />
              <Footer />
            </>
          } />
          
          <Route path="/about" element={
            <>
              <Header />
              <AboutPage />
              <Footer />
            </>
          } />
          
          <Route path="/contact" element={
            <>
              <Header />
              <ContactPage />
              <Footer />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="loan-types" element={<div>Loan Types Management (Coming Soon)</div>} />
            <Route path="upload" element={<div>File Upload (Coming Soon)</div>} />
            <Route path="organization" element={<div>Organization Settings (Coming Soon)</div>} />
            <Route path="users" element={<div>User Management (Coming Soon)</div>} />
          </Route>

          {/* Success Pages */}
          <Route path="/application-success" element={
            <>
              <Header />
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
                  <p className="text-gray-600 mb-8">We'll review your application and get back to you within 24-48 hours.</p>
                  <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Back to Home
                  </a>
                </div>
              </div>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
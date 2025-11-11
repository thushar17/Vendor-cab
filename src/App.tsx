import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SuperVendorDashboard from './pages/SuperVendorDashboard';
import SubVendorDashboard from './pages/SubVendorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      <Route 
        path="/" 
        element={
          user 
            ? (user.profile?.role === 'super_vendor' ? <Navigate to="/super-vendor" /> : <Navigate to="/dashboard" />)
            : <Navigate to="/login" />
        } 
      />

      <Route 
        path="/super-vendor/*" 
        element={
          <ProtectedRoute role="super_vendor">
            <Layout>
              <SuperVendorDashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute role="sub_vendor">
            <Layout>
              <SubVendorDashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            className: '',
            style: {
              border: '1px solid #2F2F2F',
              padding: '16px',
              color: '#FFFFFF',
              background: '#171717',
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

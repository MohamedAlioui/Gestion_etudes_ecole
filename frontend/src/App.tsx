import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { themeAtom } from './store/theme';
import { authAtom } from './store/auth';
import Lessons from './pages/Lessons'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Payments from './pages/Payments';
import Layout from './components/Layout';
import Seance from './pages/Seance';
import SupportClassComponent from './pages/SupportClass';
import Sessions from './pages/Sessions';  // Add this import if the component exists

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [auth] = useAtom(authAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }
  }, [auth, navigate]);

  return auth ? <>{children}</> : null;
};

function App() {
  const [theme] = useAtom(themeAtom);
  const [auth] = useAtom(authAtom);

  return (
    <div className={theme}>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={!auth ? <Login /> : <Navigate to="/" replace />} 
          />
          
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/support-lessons" element={<SupportClassComponent />} />
            <Route path="/seances" element={<Seance/>} />
            <Route path="/sessions" element={<Sessions/>} />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
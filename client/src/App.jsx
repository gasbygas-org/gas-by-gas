import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from './firebase.config';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const GasRequestForm = lazy(() => import('./components/GasRequestForm'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));


// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <m.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="w-8 h-8 text-blue-500" />
    </m.div>
  </div>
);

// Layout component to handle Navbar and Footer visibility
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {isHomePage && <Navbar />}
      {children}
      {isHomePage && <Footer />}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  };

  // Updated DashboardComponent
  const DashboardComponent = () => {
    // Add a check for userData loading
    if (!userData) {
        return null; // or a loading component
    }

    // Check role from userData
    const userRole = userData.role;
    console.log('Current user role:', userRole);

    if (userRole === 'user') {
        return <Dashboard />;
    } else if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    return <Navigate to="/login" />;
};


  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <m.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Home />
            </m.div>
          } 
        />
        {/* Updated Dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            <m.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <DashboardComponent />
            </m.div>
          } 
        />

        {/* Admin Dashboard route */}
        <Route 
          path="/admin/dashboard" 
          element={
            <m.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <AdminDashboard />
            </m.div>
          } 
        />

        <Route 
          path="/login" 
          element={
            <m.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Login />
            </m.div>
          } 
        />
        <Route 
          path="/register" 
          element={
              <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
              >
                  <Register />
              </m.div>
          } 
        />
        <Route 
          path="/request-gas" 
          element={
              <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
              >
                  <GasRequestForm />
              </m.div>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
        {/* Background pattern */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
        </div>

        {/* Main content */}
        <div className="relative">
          <Layout>
            <main className="min-h-screen">
              <Suspense fallback={<LoadingScreen />}>
                <AnimatedRoutes />
              </Suspense>
            </main>
          </Layout>
        </div>

        {/* Radial gradient for hover effects */}
        <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
      </div>
    </Router>
  );
};

export default App;

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
const NotFound = lazy(() => import('./pages/NotFound'));

// User pages
const UserDash = lazy(() => import('./pages/user/UserDashboard'));
const RequestGas = lazy(() => import('./pages/user/RequestGas'));
const GasRequests = lazy(() => import('./pages/user/GasRequests'));
const Notification = lazy(() => import('./pages/user/NotificationPage'));
const UserReports = lazy(() => import('./pages/user/Reports'));

// Admin pages
const AdminDash = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const OutletManagement = lazy(() => import('./pages/admin/OutletManagement'));
const StockManagement = lazy(() => import('./pages/admin/StockManagement'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));

// Dispatch admin pages
const DispatchDash = lazy(() => import('./pages/dispatchadmin/DispatchAdminDashboard'));
const DeliveryManagement = lazy(() => import('./pages/dispatchadmin/DeliveryManagement'));
const DispatchReports = lazy(() => import('./pages/dispatchadmin/Reports'));

// Outlet manager pages
const OutletDash = lazy(() => import('./pages/outletmanager/OutletManagerDashboard'));
const OutletRequestManagement = lazy(() => import('./pages/outletmanager/OutletRequestManagement'));
const CustomerRequestManagement = lazy(() => import('./pages/outletmanager/CustomerRequestManagement'));
const OutletStocks = lazy(() => import('./pages/outletmanager/Stocks'));
const OutletReports = lazy(() => import('./pages/outletmanager/Reports'));

// Business pages
const BusinessDash = lazy(() => import('./pages/business/BusinessDashboard'));
const BusinessRegistration = lazy(() => import('./pages/business/BusinessRegistration'));
const BusinessRequestGas = lazy(() => import('./pages/business/RequestGas'));
const BusinessGasRequests = lazy(() => import('./pages/business/GasRequests'));
const BusinessNotifications = lazy(() => import('./pages/business/Notifications'));
const BusinessReports = lazy(() => import('./pages/business/Reports'));

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

  const isLoggedIn = () => {
    // return userData !== null;

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      return true;
    }

    return false;
  };

  const hasRole = (requiredRole) => {
    // return userData && userData.role === requiredRole;

    const storedUser = localStorage.getItem('user');

    return storedUser && JSON.parse(storedUser).role === requiredRole;
  };

  const RoleRestrictedRoute = ({ requiredRole, element }) => {
    if (!isLoggedIn() || !hasRole(requiredRole)) {
      return <Navigate to="/not-found" />;
    }
    return element;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home route - always accessible */}
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

        {/* Login and Register routes - only accessible when not logged in */}
        <Route
          path="/login"
          element={
            isLoggedIn() ? (
              <Navigate to="/" />
            ) : (
              <m.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Login />
              </m.div>
            )
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn() ? (
              <Navigate to="/" />
            ) : (
              <m.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Register />
              </m.div>
            )
          }
        />

        {/* User routes */}
        <Route
          path="/user/dashboard"
          element={
            <RoleRestrictedRoute
              requiredRole="user"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <UserDash />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/user/request-gas"
          element={
            <RoleRestrictedRoute
              requiredRole="user"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <RequestGas />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/user/gas-requests"
          element={
            <RoleRestrictedRoute
              requiredRole="user"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <GasRequests />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/user/notifications"
          element={
            <RoleRestrictedRoute
              requiredRole="user"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Notification />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/user/reports"
          element={
            <RoleRestrictedRoute
              requiredRole="user"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <UserReports />
                </m.div>
              }
            />
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRestrictedRoute
              requiredRole="admin"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <AdminDash />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/admin/user-management"
          element={
            <RoleRestrictedRoute
              requiredRole="admin"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <UserManagement />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/admin/outlet-management"
          element={
            <RoleRestrictedRoute
              requiredRole="admin"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <OutletManagement />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/admin/stock-management"
          element={
            <RoleRestrictedRoute
              requiredRole="admin"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <StockManagement />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RoleRestrictedRoute
              requiredRole="admin"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <AdminReports />
                </m.div>
              }
            />
          }
        />

        {/* Dispatch admin routes */}
        <Route
          path="/dispatch/dashboard"
          element={
            <RoleRestrictedRoute
              requiredRole="dispatch_admin"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <DispatchDash />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/dispatch/delivery-management"
          element={
            <RoleRestrictedRoute
              requiredRole="dispatch_admin"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <DeliveryManagement />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/dispatch/reports"
          element={
            <RoleRestrictedRoute
              requiredRole="dispatch_admin"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <DispatchReports />
                </m.div>
              }
            />
          }
        />

        {/* Outlet manager routes */}
        <Route
          path="/outlet/dashboard"
          element={
            <RoleRestrictedRoute
              requiredRole="outlet_manager"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <OutletDash />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/outlet/outlet-requests"
          element={
            <RoleRestrictedRoute
              requiredRole="outlet_manager"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <OutletRequestManagement />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/outlet/customer-requests"
          element={
            <RoleRestrictedRoute
              requiredRole="outlet_manager"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <CustomerRequestManagement />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/outlet/stocks"
          element={
            <RoleRestrictedRoute
              requiredRole="outlet_manager"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <OutletStocks />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/outlet/reports"
          element={
            <RoleRestrictedRoute
              requiredRole="outlet_manager"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <OutletReports />
                </m.div>
              }
            />
          }
        />

        {/* Business routes */}
        <Route
          path="/business/dashboard"
          element={
            <RoleRestrictedRoute
              requiredRole="business"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <BusinessDash />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/business/registration"
          element={
            <RoleRestrictedRoute
              requiredRole="business"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <BusinessRegistration />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/business/request-gas"
          element={
            <RoleRestrictedRoute
              requiredRole="business"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <BusinessRequestGas />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/business/gas-requests"
          element={
            <RoleRestrictedRoute
              requiredRole="business"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <BusinessGasRequests />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/business/notifications"
          element={
            <RoleRestrictedRoute
              requiredRole="business"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <BusinessNotifications />
                </m.div>
              }
            />
          }
        />
        <Route
          path="/business/reports"
          element={
            <RoleRestrictedRoute
              requiredRole="business"
              element={
                <m.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <BusinessReports />
                </m.div>
              }
            />
          }
        />

        {/* Not Found route */}
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

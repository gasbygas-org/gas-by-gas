import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';

// Custom Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      errorInfo: null 
    };
  }
  
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error);
    this.setState({
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 shadow-xl max-w-md mx-4"
          >
            <h1 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-400 mb-6">We&apos;re sorry for the inconvenience. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <div className="mt-6 text-left">
                <details className="text-gray-400 text-sm">
                  <summary className="cursor-pointer text-blue-400 mb-2">Error Details</summary>
                  <pre className="overflow-auto p-4 rounded-lg bg-gray-800/50 text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </m.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Screen Component
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
    <m.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5] 
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut" 
      }}
      className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
    >
      GasByGas
    </m.div>
  </div>
);

// Performance Monitoring
const reportWebVitals = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { onCLS, onFID, onLCP, onFCP, onTTFB } = await import('web-vitals');
    
    onCLS(console.log);
    onFID(console.log);
    onLCP(console.log);
    onFCP(console.log);
    onTTFB(console.log);
  }
};

// Create root and render app
const renderApp = () => {
  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container);

  // Remove loading screen if it exists
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.remove(), 300);
  }

  const app = (
    <ErrorBoundary>
      <LazyMotion features={domAnimation} strict>
        <App />
      </LazyMotion>
    </ErrorBoundary>
  );

  // Wrap with StrictMode in development
  if (process.env.NODE_ENV === 'development') {
    root.render(
      <React.StrictMode>{app}</React.StrictMode>
    );
  } else {
    root.render(app);
  }
};

// Initialize app
const initializeApp = async () => {
  try {
    // Add any initialization logic here
    // For example: loading configuration, checking auth status, etc.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate initialization

    renderApp();
    reportWebVitals();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    // Show error screen
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Failed to load application</h1>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
};

// Start the application
initializeApp();

// Enable HMR in development
if (import.meta.hot) {
  import.meta.hot.accept();
}

// Remove loading screen if it exists
const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
  loadingScreen.style.opacity = '0';
  setTimeout(() => loadingScreen.remove(), 300);
}

// Performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  const reportWebVitals = async () => {
    const { onCLS, onFID, onLCP } = await import('web-vitals');
    
    onCLS(console.log);
    onFID(console.log);
    onLCP(console.log);
  };
  
  reportWebVitals();
}

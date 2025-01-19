import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, LogIn, Eye, EyeOff, ArrowLeft, 
  AlertCircle, Github, Facebook, Mail as Gmail 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const socialLogins = [
    { icon: <Gmail className="w-5 h-5" />, name: 'Gmail', color: 'hover:bg-red-500/10', hoverColor: 'group-hover:text-red-400' },
    { icon: <Facebook className="w-5 h-5" />, name: 'Facebook', color: 'hover:bg-blue-500/10', hoverColor: 'group-hover:text-blue-400' },
    { icon: <Github className="w-5 h-5" />, name: 'Github', color: 'hover:bg-gray-500/10', hoverColor: 'group-hover:text-gray-400' },
  ];

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-4 py-12 relative bg-gray-950"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
        <div className="absolute inset-0 backdrop-blur-xl backdrop-saturate-150" />
      </div>

      <m.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 group transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="bg-gray-900/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-800/50 shadow-2xl">
          <div className="text-center mb-8">
            <m.h2 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Welcome Back
            </m.h2>
            <m.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 mt-2"
            >
              Sign in to continue to GasByGas
            </m.p>
          </div>

          <AnimatePresence>
            {error && (
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </m.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Email Address
              </label>
              <div className="relative group">
                <Mail className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 
                  ${focusedInput === 'email' ? 'text-blue-400' : 'text-gray-400'}`} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    text-gray-200 placeholder-gray-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Password
              </label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200
                  ${focusedInput === 'password' ? 'text-blue-400' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    text-gray-200 placeholder-gray-500 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800/50 text-blue-500 
                    focus:ring-blue-500/50 transition-colors duration-200"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Forgot Password?
              </Link>
            </div>

            <m.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg 
                flex items-center justify-center gap-2 transition-all duration-300
                ${isLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/25'
                }`}
            >
              {isLoading ? (
                <m.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <LogIn className="w-5 h-5" />
                </m.div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </m.button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/40 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {socialLogins.map((social) => (
                <m.button
                  key={social.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 
                    ${social.color} transition-all duration-300 group`}
                  aria-label={`Sign in with ${social.name}`}
                >
                  <div className={`${social.hoverColor} transition-colors duration-300`}>
                    {social.icon}
                  </div>
                </m.button>
              ))}
            </div>
          </form>

          <p className="mt-8 text-center text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </m.div>
    </m.div>
  );
};

export default Login;

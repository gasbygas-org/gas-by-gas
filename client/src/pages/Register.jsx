import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, UserPlus, Eye, EyeOff, 
  AlertCircle, Phone, MapPin, ArrowRight, ArrowLeft, Shield} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../firebase.config';

const Register = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3) || !formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'consumer',
    address: '',
    agreeToTerms: false
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!formData.email.includes('@')) {
          setError('Please enter a valid email address');
          return false;
        }
        return true;
      case 2:
        if (!formData.password || !formData.confirmPassword) {
          setError('Please fill in all password fields');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep(1)) return;
      
      setIsLoading(true);
      try {
        // Check if email exists before proceeding
        const methods = await fetchSignInMethodsForEmail(auth, formData.email);
        
        if (methods.length > 0) {
          setError('An account with this email already exists. Please login instead.');
          setIsLoading(false);
          return;
        }
        
        // If email doesn't exist, proceed to next step
        setCurrentStep(prev => prev + 1);
        setError('');
      } catch (error) {
        if (error.code === 'auth/invalid-email') {
          setError('Please enter a valid email address');
        } else {
          setError('An error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // For other steps, just validate and proceed
      if (validateStep(currentStep)) {
        setCurrentStep(prev => prev + 1);
        setError('');
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative group">
                <User className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 
                  ${focusedInput === 'name' ? 'text-blue-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    text-gray-200 placeholder-gray-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 
                  ${focusedInput === 'email' ? 'text-blue-400' : 'text-gray-400'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    text-gray-200 placeholder-gray-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Phone Number</label>
              <div className="relative group">
                <Phone className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 
                  ${focusedInput === 'phone' ? 'text-blue-400' : 'text-gray-400'}`} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('phone')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    text-gray-200 placeholder-gray-500 transition-all duration-200"
                />
              </div>
            </div>
          </m.div>
        );

      case 2:
        return (
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
           <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200
                  ${focusedInput === 'password' ? 'text-blue-400' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    text-gray-200 placeholder-gray-500 transition-all duration-200"
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200
                  ${focusedInput === 'password' ? 'text-blue-400' : 'text-gray-400'}`} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('confirm password')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    text-gray-200 placeholder-gray-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Password must be at least 8 characters long
              </p>
              <p className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Include at least one number and special character
              </p>
            </div>
          </m.div>
        );
        case 3:
            return (
              <m.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">User Type</label>
                  <div className="relative group">
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput('userType')}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                        text-gray-200 transition-all duration-200"
                    >
                      <option value="consumer">Consumer</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
    
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Address</label>
                  <div className="relative group">
                    <MapPin className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200
                      ${focusedInput === 'userType' ? 'text-blue-400' : 'text-gray-400'}`} />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                        text-gray-200 transition-all duration-200"
                    />
                  </div>
                </div>
    
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800/50 text-blue-500 focus:ring-blue-500/50"
                  />
                  <label className="text-sm text-gray-400">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </m.div>
            );
          default:
            return null;
        }
      };
    
    return (
      <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-4 py-12 relative bg-gray-950"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
        <div className="absolute inset-0 backdrop-blur-xl backdrop-saturate-150" />
      </div>

        <m.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md relative"
        >
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        <div className="bg-gray-900/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-800/50 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
            <m.h2 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
                Create Account
            </m.h2>
            <p className="text-gray-400 mt-2">Step {currentStep} of 3</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
            <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <m.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
            </div>
            </div>

            {/* Error Message */}
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

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
                {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                <m.button
                    type="button"
                    onClick={handleBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-xl font-semibold text-gray-300 bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </m.button>
                )}
                
                <m.button
                type="button"
                onClick={currentStep === 3 ? handleSubmit : handleNext}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                {isLoading ? (
                    <m.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                    <UserPlus className="w-5 h-5" />
                    </m.div>
                ) : (
                    <>
                    {currentStep === 3 ? 'Create Account' : 'Next'}
                    {currentStep !== 3 && <ArrowRight className="w-5 h-5" />}
                    </>
                )}
                </m.button>
            </div>
            </form>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-gray-400">
            Already have an account?{' '}
            <Link
                to="/login"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
                Sign in
            </Link>
            </p>
        </div>
        </m.div>
    </m.div>
    );
};

export default Register;
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/config';
import LoadingSpinner from '../components/LoadingSpinner';
import { m } from 'framer-motion';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedAlert from '../components/AnimatedAlert';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        setStatus({ type: '', message: '' });
        setIsSubmitting(true);
        setError('');

        try {
            console.log('Starting login process...');
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            console.log('Firebase auth successful, getting token...');
            const idToken = await userCredential.user.getIdToken();
            console.log('Making API request...');
            const response = await API.post('/auth/login', {
                email: formData.email,
                password: formData.password,
                uid: userCredential.user.uid,
                token: idToken
            });

            if (!response.data) {
                throw new Error('No response data received');
            }

            if (response.status === 200) {
                console.log('Login successful, redirecting...');
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);

                setStatus({
                    type: 'success',
                    message: 'Login successful! Redirecting...'
                });

                // Add delay for loading animation
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Role-based navigation
                switch (response.data.user.role) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'user':
                        navigate('/user/dashboard');
                        break;
                    case 'outlet_manager':
                        navigate('/outlet/dashboard');
                        break;
                    case 'dispatch_admin':
                        navigate('/dispatch/dashboard');
                        break;
                    case 'business':
                        navigate('/business/dashboard');
                        break;
                    default:
                        navigate('/');
                }
            }
        } catch (error) {
            console.error('Login error details:', error);
            setError(error.response?.data?.message || 'Login failed');
            setStatus({
                type: 'error',
                message: error.message || 'Login failed'
            });
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Login
                    </h2>

                    <AnimatedAlert
                        type={status.type}
                        message={status.message}
                    />

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={`space-y-6 transition-opacity duration-200 ${isSubmitting ? 'opacity-50' : ''}`}>
                        <AnimatedInput
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={errors.email}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                              text-gray-200 placeholder-gray-500"
                            required
                        />

                        <AnimatedInput
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={errors.password}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                              text-gray-200 placeholder-gray-500"
                            required
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 
                                hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium 
                                transition-all duration-200 focus:outline-none focus:ring-2 
                                focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed
                                relative overflow-hidden group"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <LoadingSpinner />
                                    <span className="ml-2">Please wait...</span>
                                </div>
                            ) : (
                                'Login'
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </button>
                    </form>

                    {/* Navigation Links */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link
                                to="/register"
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 
                                transition-colors duration-150 border border-gray-700 rounded-lg 
                                hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 
                                focus:ring-gray-600/50"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>
            </m.div>
        </div>
    );
};

export default Login;

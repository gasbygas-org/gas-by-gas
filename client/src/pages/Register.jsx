import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/config';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedAlert from '../components/AnimatedAlert';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        nic: '',
        name: '',
        address: '',
        role: 'user' // default role
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setStatus({ type: '', message: '' });

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            console.log('1. Starting registration with data:', formData);
            
            // 3. Send all user data to backend
            const response = await API.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                nic: formData.nic,
                name: formData.name,
                address: formData.address,
                role: formData.role, // Pass the selected role here
            });

            console.log('4. Backend response:', response.data);

            if (response.status === 201) {
                setStatus({
                    type: 'success',
                    message: 'Register successful! Redirecting...'
                });

                await new Promise(resolve => setTimeout(resolve, 1000));
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response) {
                setError(error.response.data.message || 'Registration failed');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Create Account
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
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                text-gray-200 placeholder-gray-500"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                text-gray-200 placeholder-gray-500"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                text-gray-200 placeholder-gray-500"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                text-gray-200 placeholder-gray-500"
                            required
                        />

                        <input
                            type="text"
                            placeholder="NIC"
                            value={formData.nic}
                            onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                text-gray-200 placeholder-gray-500"
                            required
                        />

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                text-gray-200 placeholder-gray-500"
                            required
                        />

                        <textarea
                            placeholder="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                text-gray-200 placeholder-gray-500"
                            required
                        />

                        {/* Role Dropdown */}
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                text-gray-200"
                        >
                            <option value="user">User</option>
                            <option value="business">Business</option>
                        </select>

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
                                    <span className="ml-2">Creating Account...</span>
                                </div>
                            ) : (
                                'Create Account'
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </button>

                        {/* Navigation Links */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                                >
                                    Login
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

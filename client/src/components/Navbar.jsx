import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUserData(JSON.parse(user));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Role-based navigation links
    const getNavLinks = () => {
        const commonLinks = [
            // { name: 'Home', path: '/' }
        ];

        if (!userData) {
            return [
                ...commonLinks,
                { name: 'Login', path: '/login' },
                { name: 'Register', path: '/register' }
            ];
        }

        switch (userData.role) {
            case 'admin':
                return [
                    ...commonLinks,
                    { name: 'Dashboard', path: '/admin/dashboard' },
                    // { name: 'User Management', path: '/admin/user-management' },
                ];
            case 'outlet_manager':
                return [
                    ...commonLinks,
                    { name: 'Dashboard', path: '/outlet/dashboard' },
                    // { name: 'Gas Requests', path: '/outlet/requests' },
                ];
            case 'dispatch_admin':
                return [
                    ...commonLinks,
                    { name: 'Dashboard', path: '/dispatch/dashboard' },
                ];
            case 'user':
                return [
                    ...commonLinks,
                    { name: 'Dashboard', path: '/user/dashboard' },
                ];
            case 'business':
                return [
                    ...commonLinks,
                    { name: 'Dashboard', path: '/business/dashboard' },
                ];
            default:
                return commonLinks;
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
            ? 'backdrop-blur-md bg-gray-900/50 border-b border-gray-800'
            : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            GasByGas
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            {getNavLinks().map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {userData && (
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center text-md text-gray-300">
                                        <User className="inline-block w-4 h-4 mr-1" />
                                        {userData.name}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-md font-medium transition-colors"
                                    >
                                        <LogOut className="w-4 h-4 mr-1" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/50 backdrop-blur-md">
                            {getNavLinks().map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {userData && (
                                <>
                                    <div className="text-sm text-gray-300 px-3 py-2">
                                        <User className="inline-block w-4 h-4 mr-1" />
                                        {userData.name}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        <LogOut className="w-4 h-4 mr-1" />
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

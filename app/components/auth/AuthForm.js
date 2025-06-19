'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function AuthForm() {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login
                if (!formData.email || !formData.password) {
                    throw new Error('Please enter email and password');
                }
                login(formData.email, formData.password);
            } else {
                // Signup
                if (!formData.email || !formData.password || !formData.name) {
                    throw new Error('Please fill all fields');
                }
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                if (formData.password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    throw new Error('Please enter a valid email');
                }
                signup(formData.email, formData.password, formData.name);
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            email: '',
            password: '',
            name: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="text-center">
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {isLogin ? 'Sign in to access your dashboard' : 'Sign up to get started'}
                        </p>
                        {isLogin && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                <p className="text-xs text-blue-700">
                                    Demo Admin: admin@example.com / admin123
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 space-y-6">
                        {error && (
                            <div className="flex items-center p-4 bg-red-50 rounded-md">
                                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                <span className="text-sm text-red-800">{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="name"
                                            type="text"
                                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        autoComplete={isLogin ? "current-password" : "new-password"}
                                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                                        placeholder={isLogin ? "Enter your password" : "At least 6 characters"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }`}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                            </span>
                            <button
                                type="button"
                                onClick={switchMode}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
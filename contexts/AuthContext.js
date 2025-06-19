'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signup = (email, password, name) => {
        // Get existing users
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (existingUsers.find(u => u.email === email)) {
            throw new Error('User already exists with this email');
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email,
            password, // In production, this should be hashed
            name,
            isAdmin: email === 'admin@example.com',
            createdAt: new Date().toISOString()
        };

        // Save to users list
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // Log the user in
        const userSession = { id: newUser.id, email, name, isAdmin: newUser.isAdmin };
        setUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        return true;
    };

    const login = (email, password) => {
        // Get existing users
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

        // Find user
        const user = existingUsers.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Create session
        const userSession = {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
        };

        setUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    // Initialize with a default admin user if no users exist
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.length === 0) {
            const defaultAdmin = {
                id: 'admin',
                email: 'admin@example.com',
                password: 'admin123',
                name: 'Admin User',
                isAdmin: true,
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('users', JSON.stringify([defaultAdmin]));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
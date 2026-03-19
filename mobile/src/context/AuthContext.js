import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                const storedUser = await AsyncStorage.getItem('user');
                const storedRole = await AsyncStorage.getItem('role');
                if (storedToken) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setRole(storedRole);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                }
            } catch (e) {
                console.error('Failed to load auth state', e);
            } finally {
                setLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (email, password) => {
        const res = await axiosInstance.post('/api/auth/login', { email, password });
        const { token: t, user: u } = res.data;
        await AsyncStorage.setItem('token', t);
        await AsyncStorage.setItem('user', JSON.stringify(u));
        await AsyncStorage.setItem('role', u.role);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${t}`;
        setToken(t);
        setUser(u);
        setRole(u.role);
        return u;
    };

    const logout = async () => {
        await AsyncStorage.multiRemove(['token', 'user', 'role']);
        delete axiosInstance.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/security/auth/Api'; // Axios instance with interceptors

// Créez le contexte
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stocke l'utilisateur connecté
    const [loading, setLoading] = useState(true); // Gère l'état de chargement

    // Fonction pour récupérer les infos utilisateur depuis le backend
    const fetchUser = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log('[AuthContext] No token found, setting user to null.');
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            // const response = await api.get('/user/first-name');
            // console.log('[AuthContext] Fetched user data:', response.data);
            // setUser({ firstName: response.data });
            const response = await api.get('/user'); // Supposons que l'API retourne un objet utilisateur complet
            console.log('[AuthContext] Fetched user data:', response.data);
            setUser(response.data); 
        } catch (error) {
            console.error('[AuthContext] Error fetching user data:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour gérer la déconnexion
    const logout = async () => {
        try {
            console.log('[AuthContext] Logging out...');
            await api.post('/auth/logout');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
        } catch (error) {
            console.error('[AuthContext] Error during logout:', error);
        }
    };

    const getFirstName = () => user?.firstName;
    const isAdmin = () => user?.role === "ADMIN";
    const getId = () => user?.id;


    // Initialise l'état d'authentification au chargement
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            await fetchUser(); // Vérifie si un utilisateur est connecté
        };

        initializeAuth();
    }, []); // Exécuté une seule fois au montage du composant

    // Fournit le contexte Auth aux composants enfants
    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, isAdmin, getFirstName, getId }}>
            {!loading && children} {/* Empêche le rendu tant que loading est true */}
        </AuthContext.Provider>
    );
};

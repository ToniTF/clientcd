import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
    // Estado para almacenar la información del usuario actual
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para verificar si hay un usuario autenticado al cargar la aplicación
    useEffect(() => {
        // Intentar recuperar el usuario desde localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error al parsear usuario desde localStorage:', e);
                localStorage.removeItem('currentUser');
            }
        }
        setLoading(false);
    }, []);

    // Función para iniciar sesión
    const login = (userData) => {
        setCurrentUser(userData);
        // Guardar en localStorage para persistencia entre recargas
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    // Función para cerrar sesión
    const logout = () => {
        setCurrentUser(null);
        // Limpiar localStorage al cerrar sesión
        localStorage.removeItem('currentUser');
    };

    // Valor del contexto que estará disponible para los componentes
    const value = {
        currentUser,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
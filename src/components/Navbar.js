import React, { useState, useEffect } from 'react';
// Importa Link para la navegación y useNavigate para redirigir después del logout
import { Link, useNavigate } from 'react-router-dom';
// Importa la función de logout de nuestro servicio de API
import { logoutUser } from '../api/apiService';

// (Opcional) Si usas Context API, importarías el contexto aquí
// import { useAuth } from '../context/AuthContext';

function Navbar() {
    // Estado para saber si el usuario está autenticado (basado en la presencia del token)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // (Opcional) Si usas Context, obtendrías el estado de autenticación y la función logout del contexto
    // const { isAuthenticated, logout } = useAuth();

    // useEffect para verificar el estado de autenticación al cargar el Navbar
    // y cada vez que la URL cambie (para reflejar cambios después de login/logout)
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // !! convierte el valor (o null) a booleano
    }, [navigate]); // Depende de navigate para re-evaluar si la ruta cambia

    // Función para manejar el logout
    const handleLogout = () => {
        // Llama a la función logoutUser de apiService (que elimina el token de localStorage)
        logoutUser();

        // (Opcional) Si usas Context, llama a la función logout del contexto
        // logout();

        // Actualiza el estado local para reflejar que el usuario ya no está autenticado
        setIsAuthenticated(false);

        // Redirige al usuario a la página de inicio de sesión
        navigate('/login');
    };

    // Estilos básicos para la barra de navegación (puedes moverlos a un archivo CSS)
    const navStyle = {
        background: '#333',
        color: '#fff',
        padding: '10px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        margin: '0 10px',
    };

    const buttonStyle = {
        background: 'none',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        margin: '0 10px',
        padding: 0,
        fontSize: 'inherit', // Para que se vea como los links
    };

    return (
        <nav style={navStyle}>
            <div>
                {/* Enlace a la página principal */}
                <Link to="/" style={linkStyle}>Blog Home</Link>
            </div>
            <div>
                {/* Muestra enlaces condicionalmente basados en el estado de autenticación */}
                {isAuthenticated ? (
                    // Si el usuario está autenticado
                    <>
                        <Link to="/posts/new" style={linkStyle}>Crear Post</Link>
                        {/* Botón para cerrar sesión */}
                        <button onClick={handleLogout} style={buttonStyle}>
                            Logout
                        </button>
                        {/* Podrías mostrar el email del usuario aquí si lo guardaras */}
                    </>
                ) : (
                    // Si el usuario NO está autenticado
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/register" style={linkStyle}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
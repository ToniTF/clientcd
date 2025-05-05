import React, { useState, useContext } from 'react';
// Importa useNavigate para poder redirigir al usuario después del login
import { useNavigate, Link } from 'react-router-dom';
// Importa la función para hacer login desde nuestro servicio de API
import { loginUser } from '../api/apiService';
// Importa el contexto de autenticación
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
    // Estados para guardar el email y la contraseña introducidos por el usuario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Estado para mostrar mensajes de error
    const [error, setError] = useState(null);
    // Hook para la navegación programática
    const navigate = useNavigate();

    // Obtiene la función de login del contexto
    const { login } = useContext(AuthContext);

    // Función que se ejecuta cuando se envía el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
        setError(null); // Limpia cualquier error anterior

        try {
            console.log('Intentando iniciar sesión con:', { email, password });
            // Llama a la función loginUser de apiService con las credenciales
            const response = await loginUser({ email, password });
            console.log('Respuesta del login:', response.data);

            // Verifica que la respuesta contenga el token Y el objeto user con su ID
            if (response.data && response.data.token && response.data.user && response.data.user.id) {
                // Llama a la función login del AuthContext con el objeto user recibido
                // AuthContext se encargará de guardar este objeto en localStorage
                login(response.data.user);
                console.log('Usuario guardado en el contexto:', response.data.user);
                
                // Redirige al usuario a la página principal
                navigate('/');
            } else {
                // Si falta el token o el objeto user (o su id), es un error inesperado
                console.error('Respuesta de login incompleta o inválida:', response.data);
                setError('Error inesperado al iniciar sesión. Respuesta incompleta del servidor.');
            }

        } catch (err) {
            // Si la llamada a loginUser falla (ej. credenciales incorrectas, error de servidor)
            console.error("Fallo el inicio de sesión:", err.response?.data?.message || err.message);
            // Muestra un mensaje de error al usuario. Intenta obtener el mensaje del backend.
            setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            {/* Formulario de login */}
            <form onSubmit={handleSubmit}>
                {/* Muestra el mensaje de error si existe */}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                {/* Campo para el Email */}
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="login-email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        id="login-email"
                        value={email}
                        // Actualiza el estado 'email' cada vez que el usuario escribe
                        onChange={(e) => setEmail(e.target.value)}
                        required // Campo obligatorio
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Campo para la Contraseña */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="login-password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input
                        type="password"
                        id="login-password"
                        value={password}
                        // Actualiza el estado 'password' cada vez que el usuario escribe
                        onChange={(e) => setPassword(e.target.value)}
                        required // Campo obligatorio
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Botón para enviar el formulario */}
                <button type="submit" style={{ padding: '10px 15px' }}>
                    Login
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
        </div>
    );
}

export default LoginPage;
import React, { useState } from 'react';
// Importa useNavigate para redirigir y Link para enlazar
import { useNavigate, Link } from 'react-router-dom';
// Importa la función para registrar desde nuestro servicio de API
import { registerUser } from '../api/apiService';

function RegisterPage() {
    // Estados para email, contraseña, errores y mensaje de éxito
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    // Hook para navegación
    const navigate = useNavigate();

    // Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene recarga de página
        setError(null); // Limpia errores previos
        setSuccessMessage(null); // Limpia mensajes de éxito previos

        // Validación simple (podrías añadir más, como confirmar contraseña)
        if (!email || !password) {
            setError('Email y contraseña son requeridos.');
            return;
        }

        try {
            console.log('Intentando registrar con:', { email, password });
            // Llama a la función registerUser de apiService
            const response = await registerUser({ email, password });
            console.log('Registro exitoso:', response.data);

            // Muestra un mensaje de éxito
            setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');

            // Opcional: Redirigir automáticamente a la página de login después de un breve tiempo
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Redirige después de 2 segundos

            // Limpia los campos del formulario después del éxito
            setEmail('');
            setPassword('');

        } catch (err) {
            // Si la llamada a registerUser falla (ej. email ya existe, error de servidor)
            console.error("Fallo el registro:", err.response?.data?.message || err.message);
            // Muestra un mensaje de error al usuario
            setError(err.response?.data?.message || 'Error durante el registro. Inténtalo de nuevo.');
        }
    };

    return (
        <div>
            <h2>Registrarse</h2>
            {/* Formulario de registro */}
            <form onSubmit={handleSubmit}>
                {/* Muestra mensaje de error si existe */}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                {/* Muestra mensaje de éxito si existe */}
                {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

                {/* Campo para Email */}
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="register-email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        id="register-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Campo para Contraseña */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="register-password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input
                        type="password"
                        id="register-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        // Podrías añadir validaciones de fortaleza de contraseña aquí o en el backend
                        minLength={6} // Ejemplo: mínimo 6 caracteres
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                    {/* Podrías añadir un campo para confirmar contraseña */}
                </div>

                {/* Botón para enviar */}
                <button type="submit" style={{ padding: '10px 15px' }}>
                    Registrarse
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
        </div>
    );
}

export default RegisterPage;
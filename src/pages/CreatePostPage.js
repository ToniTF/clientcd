import React, { useState, useEffect } from 'react';
// Importa useNavigate para redirigir
import { useNavigate } from 'react-router-dom';
// Importa la función para crear posts desde nuestro servicio de API
import { createPost } from '../api/apiService';

function CreatePostPage() {
    // Estados para el título, contenido, errores, éxito y carga
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false); // Estado de carga para el envío
    // Hook para navegación
    const navigate = useNavigate();

    // --- Protección básica de ruta (lado del cliente) ---
    useEffect(() => {
        // Verifica si existe un token en localStorage al cargar la página
        const token = localStorage.getItem('token');
        if (!token) {
            // Si no hay token, redirige inmediatamente al login
            console.log("Usuario no autenticado. Redirigiendo a login...");
            navigate('/login');
        }
        // El array vacío asegura que esto se ejecute solo al montar
    }, [navigate]);

    // Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene recarga
        setError(null); // Limpia errores
        setSuccessMessage(null); // Limpia éxito

        // Validación simple
        if (!title || !content) {
            setError('Título y contenido son requeridos.');
            return;
        }

        setLoading(true); // Inicia estado de carga

        try {
            console.log('Intentando crear post con:', { title, content });
            // Llama a la función createPost de apiService
            // El token JWT se añade automáticamente por el interceptor de Axios
            const response = await createPost({ title, content });
            console.log('Post creado exitosamente:', response.data);

            // Muestra mensaje de éxito
            setSuccessMessage('¡Post creado exitosamente!');

            // Limpia el formulario
            setTitle('');
            setContent('');

            // Opcional: Redirigir a la página principal o a la página del nuevo post
            setTimeout(() => {
                // Podrías redirigir a `/posts/${response.data.postId}` si tu API devuelve el ID
                navigate('/');
            }, 1500); // Redirige después de 1.5 segundos

        } catch (err) {
            console.error("Fallo al crear el post:", err.response?.data?.message || err.message);
            // Maneja errores específicos, como no estar autorizado (401/403)
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('No estás autorizado para crear un post. Por favor, inicia sesión.');
                // Podrías redirigir a login aquí también
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(err.response?.data?.message || 'Error al crear el post.');
            }
        } finally {
            setLoading(false); // Termina estado de carga
        }
    };

    return (
        <div>
            <h2>Crear Nuevo Post</h2>
            {/* Formulario de creación */}
            <form onSubmit={handleSubmit}>
                {/* Muestra error si existe */}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                {/* Muestra éxito si existe */}
                {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

                {/* Campo para Título */}
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="post-title" style={{ display: 'block', marginBottom: '5px' }}>Título:</label>
                    <input
                        type="text"
                        id="post-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        disabled={loading} // Deshabilita mientras se envía
                    />
                </div>

                {/* Campo para Contenido */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="post-content" style={{ display: 'block', marginBottom: '5px' }}>Contenido:</label>
                    <textarea
                        id="post-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={10} // Ajusta el número de filas según necesites
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical' }}
                        disabled={loading} // Deshabilita mientras se envía
                    />
                </div>

                {/* Botón para enviar */}
                <button type="submit" style={{ padding: '10px 15px' }} disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Post'}
                </button>
            </form>
        </div>
    );
}

export default CreatePostPage;
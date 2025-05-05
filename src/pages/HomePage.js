import React, { useState, useEffect } from 'react';
// Importa Link para crear enlaces a otras rutas
import { Link } from 'react-router-dom';
// Importa la función para obtener todos los posts desde nuestro servicio de API
import { getAllPosts } from '../api/apiService';

function HomePage() {
    // Estado para almacenar la lista de posts
    const [posts, setPosts] = useState([]);
    // Estado para saber si estamos cargando los datos
    const [loading, setLoading] = useState(true);
    // Estado para almacenar cualquier error que ocurra al cargar
    const [error, setError] = useState(null);

    // useEffect se ejecuta después de que el componente se monta en el DOM
    useEffect(() => {
        // Definimos una función asíncrona para buscar los posts
        const fetchPosts = async () => {
            try {
                console.log("Intentando obtener posts...");
                setLoading(true); // Empezamos a cargar
                setError(null); // Limpiamos errores previos
                // Llamamos a la función de nuestro servicio de API
                const response = await getAllPosts();
                console.log("Posts recibidos:", response.data);
                // Actualizamos el estado con los posts recibidos
                setPosts(response.data);
            } catch (err) {
                // Si ocurre un error durante la llamada a la API
                console.error("Error al obtener los posts:", err);
                // Podríamos ser más específicos con el mensaje de error
                setError('No se pudieron cargar los posts. Inténtalo de nuevo más tarde.');
            } finally {
                // Se ejecuta siempre, tanto si hubo éxito como si hubo error
                setLoading(false); // Terminamos de cargar
            }
        };

        fetchPosts(); // Llamamos a la función para que se ejecute

    }, []); // El array vacío `[]` como segundo argumento significa que
            // este efecto se ejecutará solo una vez, cuando el componente se monte.

    // --- Renderizado Condicional ---

    // Si estamos cargando, mostramos un mensaje
    if (loading) {
        return <div>Cargando posts...</div>;
    }

    // Si hubo un error, mostramos el mensaje de error
    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    // Si no estamos cargando y no hay error, mostramos los posts
    return (
        <div>
            <h1>Posts Recientes</h1>
            {/* Botón/Enlace para ir a la página de creación de posts */}
            <div style={{ marginBottom: '20px' }}>
                {/* Más adelante, este enlace debería ser visible solo para usuarios logueados */}
                <Link to="/posts/new" className="btn btn-primary">
                    Crear Nuevo Post
                </Link>
            </div>

            {/* Verificamos si la lista de posts está vacía */}
            {posts.length === 0 ? (
                <p>Aún no hay posts publicados.</p>
            ) : (
                // Si hay posts, los listamos
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {posts.map((post) => (
                        // Usamos el id del post como key para cada elemento de la lista
                        <li key={post.id} style={{ borderBottom: '1px solid #eee', marginBottom: '15px', paddingBottom: '15px' }}>
                            {/* Enlazamos el título a la página de detalles del post */}
                            <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h2 style={{ marginTop: 0, marginBottom: '5px' }}>{post.title}</h2>
                            </Link>
                            {/* Mostramos una parte del contenido (opcional) */}
                            <p style={{ margin: 0 }}>
                                {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
                            </p>
                            {/* Podríamos mostrar la fecha o el autor si la API los devolviera */}
                            {/* <small>Publicado el: {new Date(post.createdAt).toLocaleDateString()}</small> */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HomePage;
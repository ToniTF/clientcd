import React, { useState, useEffect } from 'react';
// Importa useParams para acceder a los parámetros de la URL (el :id)
// Importa Link para volver a la página principal
import { useParams, Link } from 'react-router-dom';
// Importa la función para obtener un post por ID desde nuestro servicio de API
import { getPostById } from '../api/apiService';

function PostDetailPage() {
    // Estado para almacenar los datos del post específico
    const [post, setPost] = useState(null);
    // Estado para la carga
    const [loading, setLoading] = useState(true);
    // Estado para errores
    const [error, setError] = useState(null);

    // useParams() devuelve un objeto con los parámetros de la URL.
    // Como nuestra ruta es '/posts/:id', podemos desestructurar 'id'.
    const { id } = useParams();

    // useEffect se ejecuta cuando el componente se monta y cada vez que 'id' cambie.
    useEffect(() => {
        // Función asíncrona para buscar los detalles del post
        const fetchPostDetails = async () => {
            // Asegurarse de que tenemos un ID antes de intentar buscar
            if (!id) {
                setError('No se especificó un ID de post.');
                setLoading(false);
                return;
            }

            try {
                console.log(`Intentando obtener post con ID: ${id}`);
                setLoading(true);
                setError(null);
                // Llama a la función de apiService pasando el ID de la URL
                const response = await getPostById(id);
                console.log("Detalles del post recibidos:", response.data);
                // Actualiza el estado con los datos del post
                setPost(response.data);
            } catch (err) {
                console.error(`Error al obtener el post con ID ${id}:`, err);
                // Maneja el caso específico de 'Post no encontrado' (404)
                if (err.response && err.response.status === 404) {
                    setError('Post no encontrado.');
                } else {
                    setError('No se pudieron cargar los detalles del post.');
                }
                setPost(null); // Asegura que no se muestren datos antiguos si hay error
            } finally {
                setLoading(false); // Termina la carga
            }
        };

        fetchPostDetails(); // Llama a la función

    }, [id]); // El efecto se re-ejecutará si el 'id' en la URL cambia

    // --- Renderizado Condicional ---

    if (loading) {
        return <div>Cargando detalles del post...</div>;
    }

    if (error) {
        return (
            <div>
                <p style={{ color: 'red' }}>{error}</p>
                <Link to="/">Volver a la lista de posts</Link>
            </div>
        );
    }

    // Si no hay carga, no hay error, pero 'post' sigue siendo null (raro, pero posible)
    if (!post) {
        return (
            <div>
                <p>No se encontró información para este post.</p>
                <Link to="/">Volver a la lista de posts</Link>
            </div>
        );
    }

    // Si todo está bien, muestra los detalles del post
    return (
        <div>
            {/* Título del post */}
            <h1>{post.title}</h1>

            {/* Contenido del post */}
            {/* Usamos whiteSpace: 'pre-wrap' para respetar saltos de línea si los hubiera */}
            <p style={{ whiteSpace: 'pre-wrap', marginTop: '20px', marginBottom: '30px' }}>
                {post.content}
            </p>

            {/* Podríamos mostrar más detalles si la API los devuelve (fecha, autor) */}
            {/* <p><small>Publicado el: {new Date(post.createdAt).toLocaleString()}</small></p> */}
            {/* <p><small>Autor ID: {post.authorId}</small></p> */}

            {/* Enlace para volver a la página principal */}
            <Link to="/">Volver a la lista de posts</Link>

            {/* Más adelante podríamos añadir botones de Editar/Eliminar aquí,
                visibles solo si el usuario logueado es el autor del post */}
        </div>
    );
}

export default PostDetailPage;
import React, { useState, useEffect, useContext } from 'react';
// Importa useParams para acceder a los parámetros de la URL (el :id)
// Importa Link y useNavigate para la navegación
import { useParams, Link, useNavigate } from 'react-router-dom';
// Importa las funciones para obtener, editar y eliminar posts
import { getPostById, deletePost } from '../api/apiService';
// Importa el contexto de autenticación para verificar si el usuario está autorizado
import { AuthContext } from '../context/AuthContext';

function PostDetailPage() {
    // Estado para almacenar los datos del post específico
    const [post, setPost] = useState(null);
    // Estado para la carga
    const [loading, setLoading] = useState(true);
    // Estado para errores
    const [error, setError] = useState(null);
    // Estado para controlar acciones en proceso
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Acceder al contexto de autenticación para verificar el usuario actual
    const { currentUser } = useContext(AuthContext) || {};
    
    // Hook para la navegación programática
    const navigate = useNavigate();

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
                // Mostrar información detallada para depurar
                console.log("Estructura del autor:", response.data.author);
                console.log("Usuario actual:", currentUser);
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

    }, [id, currentUser]); // El efecto se re-ejecutará si el 'id' en la URL o el usuario actual cambia

    // Función para eliminar el post actual
    const handleDelete = async () => {
        // Confirmación antes de eliminar
        if (!window.confirm('¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer.')) {
            return;
        }
        
        try {
            setIsDeleting(true);
            await deletePost(id);
            // Redirigir a la página principal después de eliminar
            navigate('/');
        } catch (err) {
            console.error('Error al eliminar el post:', err);
            setError('No se pudo eliminar el post. Por favor, inténtalo de nuevo.');
            setIsDeleting(false);
        }
    };

    // Función para verificar si el usuario actual puede editar o eliminar el post
    const canEditOrDelete = () => {
        // Si no hay usuario logueado, no puede hacer nada
        if (!currentUser) return false;
        
        // Si el usuario es admin, siempre puede editar/eliminar
        if (currentUser.role === 'admin') {
            console.log("Es admin, puede editar/eliminar");
            return true;
        }
        
        // Asegurarse de que el ID del usuario actual está disponible
        const currentUserId = currentUser?.id;
        if (!currentUserId) {
            console.log("ID del usuario actual no disponible para comparación.");
            return false; // No se puede verificar autoría sin ID de usuario actual
        }

        // --- NUEVA LÓGICA --- 
        // Comparamos el ID del usuario actual con los IDs de autor directamente en el objeto post
        const isAuthorById = post.authorId && post.authorId === currentUserId;
        const isAuthorByUserId = post.authorUserId && post.authorUserId === currentUserId;
        
        console.log("Resultado de la comparación (estructura plana):", { isAuthorById, isAuthorByUserId });
        
        // Devuelve true si alguna de las comparaciones de ID es verdadera
        return isAuthorById || isAuthorByUserId;
    };

    // --- Renderizado Condicional ---

    if (loading) {
        return <div className="container mt-5 text-center">Cargando detalles del post...</div>;
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">{error}</div>
                <Link to="/" className="btn btn-primary">Volver a la lista de posts</Link>
            </div>
        );
    }

    // Si no hay carga, no hay error, pero 'post' sigue siendo null (raro, pero posible)
    if (!post) {
        return (
            <div className="container mt-5">
                <p>No se encontró información para este post.</p>
                <Link to="/" className="btn btn-primary">Volver a la lista de posts</Link>
            </div>
        );
    }

    // Si todo está bien, muestra los detalles del post
    return (
        <div className="container mt-5">
            {/* Información de depuración actualizada */}
            <div className="alert alert-info mb-3">
                <strong>Usuario actual:</strong> {currentUser ? `${currentUser.email} (ID: ${currentUser.id}, Rol: ${currentUser.role})` : 'No autenticado'}<br/>
                <strong>Autor del post (IDs):</strong> {post.authorId ? `ID: ${post.authorId}` : 'N/A'} / {post.authorUserId ? `UserID: ${post.authorUserId}` : 'N/A'}<br/>
                <strong>Autor del post (Email):</strong> {post.authorEmail || 'N/A'}<br/>
                <strong>¿Puede editar/eliminar?</strong> {canEditOrDelete() ? 'Sí' : 'No'}
            </div>
            
            {/* Título del post */}
            <h1 className="mb-4">{post.title}</h1>

            {/* Metadata del post (fecha, autor) - Usamos authorEmail si está disponible */}
            <div className="mb-4">
                {post.createdAt && (
                    <small className="text-muted me-3">
                        Publicado el: {new Date(post.createdAt).toLocaleString()}
                    </small>
                )}
                
                {/* Mostramos el email del autor si existe */}
                {post.authorEmail && (
                    <small className="text-muted">
                        Por: {post.authorEmail} 
                    </small>
                )}
            </div>

            {/* Contenido del post */}
            <div className="card mb-4">
                <div className="card-body">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex gap-2 mb-4">
                <Link to="/" className="btn btn-secondary">
                    Volver a la lista
                </Link>
                
                {/* Usamos la función mejorada para verificar los permisos */}
                {canEditOrDelete() && (
                    <>
                        <Link to={`/posts/edit/${id}`} className="btn btn-primary">
                            Editar
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default PostDetailPage;
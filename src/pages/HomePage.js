import React, { useState, useEffect, useContext } from 'react';
// Importa Link para la navegación
import { Link } from 'react-router-dom';
// Importa las funciones para obtener y eliminar posts
import { getAllPosts, deletePost } from '../api/apiService';
// Importa el contexto de autenticación para verificar si el usuario está autorizado
import { AuthContext } from '../context/AuthContext';

function HomePage() {
    // Estado para almacenar la lista de posts
    const [posts, setPosts] = useState([]);
    // Estado para saber si estamos cargando los datos
    const [loading, setLoading] = useState(true);
    // Estado para almacenar cualquier error que ocurra al cargar
    const [error, setError] = useState(null);
    // Estado para controlar qué post está siendo eliminado
    const [deletingPostId, setDeletingPostId] = useState(null);
    // Estado para depurar la autenticación
    const [authDebug, setAuthDebug] = useState(null);
    
    // Acceder al contexto de autenticación para verificar el usuario actual
    const { currentUser } = useContext(AuthContext) || {};
    
    // Añadir información de depuración sobre el usuario
    useEffect(() => {
        console.log("Estado de autenticación:", currentUser);
        setAuthDebug(currentUser ? 
            `Usuario autenticado: ${currentUser.username || currentUser.email} (${currentUser.role || 'sin rol'})` : 
            'No hay usuario autenticado');
    }, [currentUser]);

    // Función para cargar los posts
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

    // useEffect se ejecuta después de que el componente se monta en el DOM
    useEffect(() => {
        fetchPosts(); // Llamamos a la función para obtener los posts
    }, []); // El array vacío significa que este efecto se ejecutará solo una vez

    // Función para manejar la eliminación de un post
    const handleDeletePost = async (id) => {
        // Confirmación antes de eliminar
        if (!window.confirm('¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer.')) {
            return;
        }
        
        try {
            setDeletingPostId(id);
            await deletePost(id);
            // Actualizar la lista después de eliminar
            fetchPosts();
        } catch (err) {
            console.error('Error al eliminar el post:', err);
            setError('No se pudo eliminar el post. Por favor, inténtalo de nuevo.');
            setDeletingPostId(null);
        }
    };

    // Función para verificar si el usuario puede editar o eliminar un post
    const canEditOrDeletePost = (post) => {
        if (!currentUser) {
            return false;
        }
        
        // Si el usuario es administrador, puede editar/eliminar cualquier post
        if (currentUser.role === 'admin') {
            return true;
        }

        // Si no hay información del autor, el usuario normal no puede editar/eliminar
        if (!post.author || Object.keys(post.author).length === 0) {
            return false;
        }
        
        // Verificamos si el usuario actual es el autor
        const isAuthorById = post.author.id && currentUser.id && post.author.id === currentUser.id;
        const isAuthorByUserId = post.author.userId && currentUser.id && post.author.userId === currentUser.id;
        const isAuthorByEmail = post.author.email && currentUser.email && post.author.email === currentUser.email;
        
        // Consideramos el caso donde el email esté directamente en el post (menos común)
        const isCreatorByEmail = post.email && currentUser.email && post.email === currentUser.email;
        
        const canEdit = isAuthorById || isAuthorByUserId || isAuthorByEmail || isCreatorByEmail;
        
        return canEdit;
    };

    // --- Renderizado Condicional ---

    // Si estamos cargando, mostramos un mensaje
    if (loading) {
        return <div className="container mt-5 text-center">Cargando posts...</div>;
    }

    // Si hubo un error, mostramos el mensaje de error
    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">{error}</div>
            </div>
        );
    }

    // Si no estamos cargando y no hay error, mostramos los posts
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Posts Recientes</h1>
            
            {/* Información de depuración de autenticación */}
            <div className="mb-3">
                <div className={`alert ${currentUser ? 'alert-info' : 'alert-warning'}`}>
                    {authDebug}
                </div>
            </div>
            
            {/* Botón/Enlace para ir a la página de creación de posts */}
            <div className="mb-4">
                {currentUser && (
                    <Link to="/posts/new" className="btn btn-primary">
                        Crear Nuevo Post
                    </Link>
                )}
                {!currentUser && (
                    <div className="alert alert-warning">
                        Inicia sesión para crear, editar o eliminar posts
                    </div>
                )}
            </div>

            {/* Verificamos si la lista de posts está vacía */}
            {posts.length === 0 ? (
                <p>Aún no hay posts publicados.</p>
            ) : (
                // Si hay posts, los listamos
                <div className="row">
                    {posts.map((post) => (
                        <div key={post.id} className="col-md-12 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h2 className="card-title">{post.title}</h2>
                                    
                                    {/* Información del autor y fecha */}
                                    <div className="mb-2 text-muted">
                                        {post.author && post.author.username && (
                                            <small className="me-2">Por: {post.author.username}</small>
                                        )}
                                        
                                        {post.createdAt && (
                                            <small>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </small>
                                        )}
                                    </div>
                                    
                                    {/* Extracto del contenido */}
                                    <p className="card-text">
                                        {post.content.substring(0, 150)}
                                        {post.content.length > 150 ? '...' : ''}
                                    </p>
                                    
                                    {/* Botones de acción */}
                                    <div className="d-flex gap-2">
                                        <Link 
                                            to={`/posts/${post.id}`} 
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            Leer más
                                        </Link>
                                        
                                        {/* Mostrar botones de edición y eliminación si el usuario tiene permisos */}
                                        {canEditOrDeletePost(post) && (
                                            <>
                                                <Link 
                                                    to={`/posts/edit/${post.id}`} 
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                    disabled={deletingPostId === post.id}
                                                >
                                                    {deletingPostId === post.id ? 'Eliminando...' : 'Eliminar'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;
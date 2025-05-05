import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../api/apiService';
// Importamos el contexto de autenticación
import { AuthContext } from '../context/AuthContext';

function EditPostPage() {
    const { id } = useParams(); // Obtiene el ID del post desde la URL
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState('');

    // Obtenemos la información del usuario actual
    const { currentUser } = useContext(AuthContext);

    // Carga el post existente cuando el componente se monta
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const response = await getPostById(id);
                const postData = response.data;
                
                // Guardamos el post completo
                setPost(postData);
                
                // Inicializa el formulario con los datos del post existente
                setTitle(postData.title);
                setContent(postData.content);
                setIsLoading(false);
                
                // Información de depuración
                setDebugInfo(`Post cargado: ID=${postData.id}, Autor=${JSON.stringify(postData.author || 'No tiene autor')}`);
            } catch (error) {
                console.error('Error al cargar el post:', error);
                setError('No se pudo cargar el post. Por favor, intenta de nuevo más tarde.');
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación simple
        if (!title.trim() || !content.trim()) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null); // Limpiar errores previos
            
            // Conservamos toda la información existente del post y solo actualizamos título y contenido
            const updateData = {
                ...post,
                title,
                content
            };
            
            // Si el post no tiene autor y hay un usuario autenticado, asignamos al usuario actual como autor
            if ((!updateData.author || Object.keys(updateData.author).length === 0) && currentUser) {
                console.log("Asignando autor al post sin autor...");
                updateData.author = {
                    id: currentUser.id,
                    email: currentUser.email,
                    username: currentUser.username || currentUser.email
                };
            }
            
            // Log detallado de los datos que se enviarán
            console.log('Datos enviados a updatePost:', updateData);
            
            await updatePost(id, updateData);
            navigate(`/posts/${id}`); // Redirige al detalle del post actualizado
        } catch (error) {
            // Log detallado del error
            console.error('Error detallado al actualizar el post:', error.response || error);
            setError('No se pudo actualizar el post. Por favor, intenta de nuevo más tarde.');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="container mt-5 text-center"><p>Cargando...</p></div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Editar Post</h1>
            
            {/* Información de depuración */}
            {debugInfo && (
                <div className="alert alert-info mb-3">
                    <small>{debugInfo}</small>
                    <br/>
                    <small>Usuario actual: {currentUser ? `${currentUser.email} (${currentUser.role})` : 'No autenticado'}</small>
                </div>
            )}
            
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Contenido</label>
                    <textarea
                        className="form-control"
                        id="content"
                        rows="6"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                
                <div className="d-flex gap-2">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate(`/posts/${id}`)}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditPostPage;
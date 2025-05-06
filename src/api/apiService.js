import axios from 'axios';

// Determinamos la URL base de la API basada en el hostname actual
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;

    // 1. Usar la variable de entorno REACT_APP_API_URL si está definida
    // Esto permite la máxima flexibilidad para configurar la URL de la API.
    if (process.env.REACT_APP_API_URL) {
        console.log(`Usando API URL desde REACT_APP_API_URL: ${process.env.REACT_APP_API_URL}`);
        return process.env.REACT_APP_API_URL;
    }

    // 2. Para desarrollo local estándar (cuando el frontend corre en localhost)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        const localApiUrl = 'http://localhost:5000/api'; // URL de tu backend local
        console.log(`Desarrollo local detectado. Usando API URL local: ${localApiUrl}`);
        return localApiUrl;
    }
    
    // 3. Para cualquier otro caso (ej. aplicación desplegada), usar la URL de Render
    // Esta será la URL por defecto cuando la aplicación no esté en localhost y REACT_APP_API_URL no esté seteada.
    const renderApiUrl = 'https://api-clientcd.onrender.com';
    console.log(`Usando API URL de Render por defecto: ${renderApiUrl}`);
    return renderApiUrl;
};

const API_URL = getApiBaseUrl();
console.log('API_URL utilizada por apiService:', API_URL);

// Crea una instancia de Axios con la URL base
// Es útil para no tener que escribir la URL completa cada vez
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json', // Indica que enviaremos JSON
    },
    // Añadir tiempo de espera para las solicitudes
    timeout: 10000, // 10 segundos
});

// --- Interceptores ---
/*
 * Interceptor de Solicitud:
 * Se ejecuta ANTES de que cada solicitud sea enviada.
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Recupera el token guardado
        if (token) {
            // Si hay token, lo añade al header como 'Bearer TOKEN'
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log(`Realizando petición a: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('Error en la configuración de la solicitud:', error);
        return Promise.reject(error);
    }
);

/*
 * Interceptor de Respuesta:
 * Se ejecuta DESPUÉS de recibir una respuesta.
 */
apiClient.interceptors.response.use(
    (response) => {
        // Cualquier código de estado que esté dentro del rango 2xx hará que esta función se active
        return response;
    },
    (error) => {
        // Cualquier código de estado que esté fuera del rango 2xx hará que esta función se active
        if (error.response) {
            // La solicitud se realizó y el servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error de respuesta:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            
            // Si recibimos un 401 (No autorizado) y tenemos un token, eliminarlo y redirigir a login
            if (error.response.status === 401 && localStorage.getItem('token')) {
                console.warn('Sesión expirada o token inválido. Cerrando sesión...');
                localStorage.removeItem('token');
                // Si estamos en una aplicación React con Router, podríamos redirigir aquí
                // window.location = '/login';
            }
        } else if (error.request) {
            // La solicitud se realizó pero no se recibió respuesta
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            // Algo ocurrió en la configuración de la solicitud que desencadenó un error
            console.error('Error de configuración de la solicitud:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// --- Funciones de Autenticación ---

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Objeto con { email, password }
 * @returns {Promise} - Promesa de Axios con la respuesta del backend.
 */
export const registerUser = (userData) => {
    return apiClient.post('/auth/register', userData); // Llama a POST /api/auth/register
};

/**
 * Inicia sesión de un usuario.
 * @param {object} credentials - Objeto con { email, password }
 * @returns {Promise} - Promesa de Axios. Si es exitoso, la respuesta contendrá el token.
 */
export const loginUser = async (credentials) => {
    // Llama a POST /api/auth/login
    const response = await apiClient.post('/auth/login', credentials);
    // Si el login fue exitoso y el backend devolvió un token...
    if (response.data.token) {
        // ...guarda el token en el almacenamiento local del navegador.
        localStorage.setItem('token', response.data.token);
    }
    // Devuelve la respuesta completa. El componente que llama (LoginPage)
    // debe extraer response.data.user y pasarlo a AuthContext.login()
    return response;
};

/**
 * Cierra la sesión del usuario (lado del cliente).
 */
export const logoutUser = () => {
    // Elimina el token guardado.
    localStorage.removeItem('token');
    // También elimina el usuario guardado, aunque AuthContext.logout también lo hace.
    localStorage.removeItem('currentUser');
    // Nota: Si tuvieras una ruta /api/auth/logout en el backend para invalidar
    // el token del lado del servidor, la llamarías aquí también.
};

// --- Funciones de Posts ---

/**
 * Obtiene todos los posts.
 * @returns {Promise} - Promesa de Axios con la lista de posts.
 */
export const getAllPosts = () => {
    return apiClient.get('/posts'); // Llama a GET /api/posts
};

/**
 * Obtiene un post específico por su ID.
 * @param {string|number} id - El ID del post.
 * @returns {Promise} - Promesa de Axios con los datos del post.
 */
export const getPostById = (id) => {
    return apiClient.get(`/posts/${id}`); // Llama a GET /api/posts/:id
};

/**
 * Crea un nuevo post.
 * @param {object} postData - Objeto con { title, content }
 * @returns {Promise} - Promesa de Axios con la respuesta del backend.
 */
export const createPost = (postData) => {
    // Llama a POST /api/posts. El token JWT se añadirá automáticamente
    // a los headers gracias al interceptor que configuramos antes.
    return apiClient.post('/posts', postData);
};

/**
 * Actualiza un post existente.
 * @param {string|number} id - El ID del post a actualizar.
 * @param {object} postData - Objeto con los datos actualizados { title, content }
 * @returns {Promise} - Promesa de Axios con la respuesta del backend.
 */
export const updatePost = (id, postData) => {
    // Llama a PUT /api/posts/:id
    return apiClient.put(`/posts/${id}`, postData);
};

/**
 * Elimina un post específico por su ID.
 * @param {string|number} id - El ID del post a eliminar.
 * @returns {Promise} - Promesa de Axios con la respuesta del backend.
 */
export const deletePost = (id) => {
    // Llama a DELETE /api/posts/:id
    return apiClient.delete(`/posts/${id}`);
};

// Exportamos la instancia configurada por si se necesita en algún otro lugar,
// aunque generalmente usaremos las funciones exportadas (registerUser, loginUser, etc.)
export default apiClient;
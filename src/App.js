import React from 'react';
// Importa los componentes necesarios de react-router-dom
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Quita 'Link' si no lo usas directamente aquí

// Importa el componente Navbar
import Navbar from './components/Navbar'; // Asegúrate que esta línea esté presente y correcta

// Importa los componentes de página
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';

// (Opcional) Importa el proveedor de contexto si decides usarlo
// import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        // (Opcional) Envuelve toda la aplicación con el AuthProvider si lo usas
        // <AuthProvider>
            <Router> {/* Habilita el enrutamiento en la aplicación */}

                {/* Usa el componente Navbar importado aquí */}
                <Navbar />

                {/* Contenedor para el contenido de las páginas */}
                <div className="container" style={{ padding: '0 20px', marginTop: '20px' }}>
                    {/* Define las rutas de la aplicación */}
                    <Routes>
                        {/* Ruta para la página principal */}
                        <Route path="/" element={<HomePage />} />

                        {/* Ruta para la página de inicio de sesión */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Ruta para la página de registro */}
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Ruta para crear un nuevo post */}
                        <Route path="/posts/new" element={<CreatePostPage />} />

                        {/* Ruta para ver los detalles de un post específico */}
                        <Route path="/posts/:id" element={<PostDetailPage />} />

                        {/* Puedes añadir una ruta comodín para páginas no encontradas (404) */}
                        {/* <Route path="*" element={<div>Página no encontrada</div>} /> */}
                    </Routes>
                </div>
            </Router>
        // </AuthProvider>
    );
}

export default App;
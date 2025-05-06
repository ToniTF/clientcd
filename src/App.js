import React from 'react';
// Importa los componentes necesarios de react-router-dom
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importa el componente Navbar
import Navbar from './components/Navbar';

// Importa los componentes de página
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';

// Importa el proveedor de contexto
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router basename="/clientcd">
                <Navbar />

                <div className="container" style={{ padding: '0 20px', marginTop: '20px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/posts/new" element={<CreatePostPage />} />
                        <Route path="/posts/edit/:id" element={<EditPostPage />} />
                        <Route path="/posts/:id" element={<PostDetailPage />} />
                        {/* Puedes añadir una ruta comodín para páginas no encontradas (404) */}
                        {/* <Route path="*" element={<div>Página no encontrada</div>} /> */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
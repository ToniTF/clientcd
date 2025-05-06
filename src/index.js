import React from 'react';
import ReactDOM from 'react-dom/client';
// Los estilos de index.css se aplican globalmente, incluyendo el tema Matrix para la app.
// La animación de intro y sus estilos directos están en public/index.html.
import './index.css'; 
import App from './App';
import reportWebVitals from './reportWebVitals';

// Ya no se necesita la lógica de la animación aquí, ya que está en public/index.html
// para asegurar que se ejecute antes de que React cargue.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

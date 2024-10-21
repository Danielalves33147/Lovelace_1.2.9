import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { UserProvider } from './services/UserContext'; // Importe o UserProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider> {/* Envolva o App com o UserProvider */}
      <App />
    </UserProvider>
  </StrictMode>,
);

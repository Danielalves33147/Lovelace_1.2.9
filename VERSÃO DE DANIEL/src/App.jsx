import './index.css';
import { AppRoutes } from "./routes/AppRoutes";
import { UserProvider } from './services/UserContext.jsx'; // Certifique-se que o caminho esteja correto

export function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

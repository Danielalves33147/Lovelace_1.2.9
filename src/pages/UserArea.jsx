import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivityGallery from "../components/ActivityGallery"
import styles from "./UserArea.module.css"
import ActivitySection from "../components/Activitysection";

import { auth, db } from "../../services/firebaseConfig.js"; 
import { signOut } from "firebase/auth";

export default function UserArea() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar o menu

  const storedUser  = JSON.parse(sessionStorage.getItem('user'));
  useEffect(() => {
    try {
        
        if (storedUser ) {
            setUser (storedUser);
            console.log(storedUser)
        } else {
            navigate("/");
        }
    } catch (error) {
        console.error("Erro ao analisar o usuário do sessionStorage:", error);
        navigate("/");
    }
    }, [navigate]);

    const toggleMenu = () => {
      setMenuVisible(!menuVisible);
    };
  
    const handleLogout = async () => {
      try {
        // Deslogar do Firebase
        await signOut(auth);
  
        // Remover o usuário do sessionStorage
        sessionStorage.removeItem('user');
  
        // Definir o estado do usuário como vazio
        setUser({});
  
        // Log para verificar o estado atual de 'user'
        console.log("Logout realizado com sucesso. Estado atual do usuário:", storedUser);
  
        // Redirecionar para a página inicial
        navigate("/");
      } catch (error) {
        console.error("Erro ao deslogar:", error);
      }
    };
    

  // Função para alternar visibilidade da senha
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1><a href="/ua">Lovelace</a></h1>
        <div className={styles.userInfo}>
          {user ? (
            <>
              <p onClick={toggleMenu}>{user.name}</p>
              <div>
                <img 
                  onClick={toggleMenu} 
                  src={user.profileImage || '/defaultProfile.png'} 
                  alt="Avatar do usuário" 
                  className={styles.userImage} 
                />
                {menuVisible && (
                  <div className={styles.dropdownMenu}>
                    <ul>
                      <li onClick={() => navigate("/profile")}>Perfil</li>
                      <li onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>loading...</p>
          )}
        </div>
      </header>
      <ActivitySection/>
      <ActivityGallery/>
    </div>
  );
}
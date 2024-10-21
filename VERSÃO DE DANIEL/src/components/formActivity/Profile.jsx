import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false); // Para alternar entre visualização e edição
    const [name, setName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [isImageZoomed, setIsImageZoomed] = useState(false); // Estado para controlar o destaque da imagem
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setName(storedUser.name); // Preenche com dados atuais
            setProfileImage(storedUser.profileImage);
        } else {
            navigate("/Lovelace_1.2.4/");
        }
    }, [navigate]);

    function handleSaveChanges() {
        const updatedUser = {
            ...user,
            name: name,
            profileImage: profileImage
        };

        // Atualiza no json-server
        fetch(`http://localhost:4000/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
        .then(response => response.json())
        .then(data => {
            setUser(data);
            sessionStorage.setItem('user', JSON.stringify(data)); // Atualiza o usuário no sessionStorage
            setEditMode(false);
        })
        .catch(err => console.error("Erro ao salvar as alterações:", err));
    }

    // Alternar o zoom da imagem ao clicar
    const toggleImageZoom = () => {
        setIsImageZoomed(!isImageZoomed);
    };

    return (
        <div className={styles.container}>
            {user && (
                <div className={styles.card}>
                    <h1>Perfil do Usuário</h1>
                    <img 
                        src={user.profileImage ? user.profileImage : '/defaultProfile.png'} 
                        alt="Avatar do usuário" 
                        className={`${styles.profileImage} ${isImageZoomed ? styles.zoomed : ''}`}
                        onClick={toggleImageZoom} // Zoom ao clicar na imagem
                    />

                    {editMode ? (
                        <>
                            {/* Inputs para editar o nome de usuário e a imagem */}
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome de usuário"
                                className={styles.inputField}
                            />
                            <input 
                                type="text" 
                                value={profileImage}
                                onChange={(e) => setProfileImage(e.target.value)}
                                placeholder="URL da imagem de perfil"
                                className={styles.inputField}
                            />
                            <button 
                                className={styles.saveButton}
                                onClick={handleSaveChanges}
                            >
                                Salvar Alterações
                            </button>
                        </>
                    ) : (
                        <>
                            <p><strong>Nome de usuário:</strong> {name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>ID:</strong> {user.id}</p>
                            <button 
                                className={styles.editButton}
                                onClick={() => setEditMode(true)}
                            >
                                Editar Perfil
                            </button>
                            <button 
                                className={styles.logoutButton} onClick={() => {sessionStorage.clear(); navigate("/Lovelace_1.2.4/");}}>
                                Logout
                        </button>
                        </>
                    )}
                    <button 
                        className={styles.backButton}
                        onClick={() => navigate("/Lovelace_1.2.4/tool")}
                    >
                        Voltar para Área de Usuário
                    </button>
                </div>
            )}
        </div>
    );
}

export default Profile;

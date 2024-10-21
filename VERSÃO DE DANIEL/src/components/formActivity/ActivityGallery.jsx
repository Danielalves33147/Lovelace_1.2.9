import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import styles from './ActivityGallery.module.css';
import LinkButton from '../layout/LinkButton';

function ActivityGallery() {
    const [activities, setActivities] = useState([]);
    const [user, setUser] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        // Pegando os dados do usuário armazenados no sessionStorage
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser); 
        }

        // Pegando o ID do usuário logado
        const userId = storedUser ? storedUser.id : null;

        if (userId) {
            fetch(`http://localhost:4000/activities?userId=${userId}`)
                .then(resp => resp.json())
                .then(data => setActivities(data))
                .catch(err => console.log(err));
        }
    }, []);

    // Função para excluir uma atividade
    const deleteActivity = (activityId) => {
        if (window.confirm("Tem certeza que deseja excluir esta atividade?")) {
            fetch(`http://localhost:4000/activities/${activityId}`, {
                method: 'DELETE',
            })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Erro ao excluir a atividade.");
                }
                // Remover a atividade excluída da lista
                setActivities(activities.filter(activity => activity.id !== activityId));
                alert("Atividade excluída com sucesso!");
            })
            .catch((err) => console.error('Erro ao excluir atividade:', err));
        }
    };

    return (
        <>
            <header className={styles.loveLog}>
                <h1>Lovelace</h1>
                <LinkButton to='/Lovelace_1.2.4/tool' text='Voltar' />
                <LinkButton to='/Lovelace_1.2.4/cA' text='Criar Atividade'/>
                <div className={styles.userInfo}>
                    {user ? (
                        <>
                            <p>{user.name}</p>
                            <img 
                                src={user.profileImage || '/default-avatar.png'} 
                                alt="Avatar do usuário" 
                                className={styles.userImage} 
                            />
                        </>
                    ) : (
                        <p>Carregando informações do usuário...</p>
                    )}
                    <div>
                        <button 
                            className={styles.profileButton} 
                            onClick={() => navigate("/Lovelace_1.2.4/profile")}
                        > 
                            Perfil 
                        </button>
                    </div>
                </div>
            </header>
            <div className={styles.galleryContainer}>
                {activities.length > 0 ? (
                    activities.map(activity => (
                        <div key={activity.id} className={styles.activityCard}>
                            <h2>{activity.name}</h2>
                            <p>{activity.description}</p>
                            <div className={styles.links}>
                                <Link to={`/Lovelace_1.2.4/eA/${activity.id}`} className={styles.linkButton}>Editar</Link>
                                <Link to={`/Lovelace_1.2.4/rA/${activity.id}`} className={styles.linkButton}>Respostas</Link>
                                <button 
                                    className={styles.deleteButton} 
                                    onClick={() => deleteActivity(activity.id)}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Você ainda não criou nenhuma atividade.</p>
                )}
            </div>
        </>
    );
}

export default ActivityGallery;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ActivityResponses.module.css';

function ActivityResponses() {
    const { id } = useParams();  // ID da atividade
    const [activity, setActivity] = useState(null);
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        // Carregar a atividade e suas respostas
        fetch(`http://localhost:4000/activities/${id}`)
            .then(response => response.json())
            .then(data => setActivity(data))
            .catch(err => console.log(err));

        // Carregar as respostas submetidas
        fetch(`http://localhost:4000/responses?activityId=${id}`)
            .then(response => response.json())
            .then(data => setResponses(data))
            .catch(err => console.log(err));
    }, [id]);

    if (!activity) {
        return <div>Carregando atividade...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Respostas para: {activity.name}</h1>
            <p>{activity.description}</p>
            <div className={styles.responsesSection}>
                {responses.length > 0 ? (
                    responses.map((response, index) => (
                        <div key={response.id} className={styles.responseCard}>
                            <h3>Resposta {index + 1} por {response.user}:</h3>
                            <p className={styles.date}>Data: {new Date(response.date).toLocaleDateString()}</p>
                            {activity.questions.map((question, i) => (
                                <div key={question.id} className={styles.questionBlock}>
                                    <p className={styles.question}><strong>{i + 1}. {question.text}</strong></p>
                                    <p className={styles.answer}>Resposta: {response.answers[i]?.text || 'Sem resposta'}</p>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>Nenhuma resposta foi enviada ainda.</p>
                )}
            </div>
        </div>
    );
}

export default ActivityResponses;

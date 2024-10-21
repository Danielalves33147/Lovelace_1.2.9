import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AccessActivity.module.css';
import TextArea from '../../components/formActivity/TextArea';
import SubmitButton from '../../components/formActivity/SubmitButton';


function AccessActivity() {
    const { id } = useParams(); // ID da atividade
    const [activity, setActivity] = useState(null);
    const [responses, setResponses] = useState([]);
    const [name, setName] = useState(""); // Estado para armazenar o nome do usuário
    const [error, setError] = useState(null); // Para capturar erros
    const navigate = useNavigate();

    useEffect(() => {
        // Buscar detalhes da atividade
        fetch(`http://localhost:4000/activities/${id}`)
            .then(response => response.json())
            .then(data => {
                setActivity(data);
                setResponses(data.questions.map(question => ({
                    id: question.id,
                    text: ''
                })));
            })
            .catch((err) => {
                console.error('Erro ao carregar atividade:', err);
                setError('Erro ao carregar a atividade. Tente novamente mais tarde.');
            });
    }, [id]);

    const handleResponseChange = (questionId, value) => {
        const updatedResponses = responses.map(response => {
            if (response.id === questionId) {
                return { ...response, text: value };
            }
            return response;
        });
        setResponses(updatedResponses);
    };

    const submitResponses = (e) => {
        e.preventDefault();

        // Validar se o nome foi preenchido
        if (!name.trim()) {
            setError("Por favor, insira seu nome antes de enviar as respostas.");
            return;
        }

        // Criar objeto para submissão das respostas
        const submission = {
            activityId: id,
            answers: responses,
            user: name || "Anônimo", // Usar o nome fornecido ou 'Anônimo' como padrão
            date: new Date().toISOString(), // Timestamp da resposta
        };

        // Enviar respostas para o servidor
        fetch('http://localhost:4000/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submission),
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Erro ao enviar respostas.');
            }
            return resp.json();
        })
        .then(data => {
            console.log('Respostas enviadas:', data);
            alert('Respostas submetidas com sucesso!');
            setTimeout(() => {
                navigate("/Lovelace_1.2.4/tool");
            }, 2000);  // Tempo de espera de 3 segundos
        })
        .catch((err) => {
            console.error('Erro ao enviar respostas:', err);
            setError('Erro ao enviar suas respostas. Tente novamente.');
        });
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!activity) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h1>{activity.name}</h1>
                <p>{activity.description}</p>
            </div>
            <form onSubmit={submitResponses}>
                <div className={styles.input_name}>
                    <label htmlFor="name">Seu nome:</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Insira seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                {activity.questions.map((question) => (
                    <div key={question.id} className={styles.question}>
                        <pre className={styles.question_text}>{question.text}</pre>
                        <TextArea
                            className={styles.question_answer}
                            name="answer"
                            placeholder="Sua resposta"
                            value={responses.find(response => response.id === question.id)?.text || ''}
                            handleOnChange={(e) => handleResponseChange(question.id, e.target.value)}
                        />
                    </div>
                ))}
                <SubmitButton text="Enviar Respostas" />
            </form>
        </div>
    );
}

export default AccessActivity;
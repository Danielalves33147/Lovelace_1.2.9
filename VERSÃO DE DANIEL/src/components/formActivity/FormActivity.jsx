import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextArea from './TextArea';
import QuestionBox from '../questions/QuestionBox';
import SubmitButton from './SubmitButton';
import BackButton from '../layout/BackButton';
import styles from './FormActivity.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

// Gerar um código de acesso aleatório
function generateAccessCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function FormActivity({ activity = null, handleSubmit }) {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    const navigate = useNavigate();

    const [activities, setActivities] = useState({
        name: activity?.name || "",
        description: activity?.description || "",
        accessCode: activity?.accessCode || generateAccessCode(),
        questions: activity?.questions || []
    });

    const handleChange = (e) => {
        setActivities({
            ...activities,
            [e.target.name]: e.target.value
        });
    };

    const addQuestion = () => {
        setActivities({
            ...activities,
            questions: [...activities.questions, { id: Date.now(), proposal: '', text: '' }]
        });
    };

    const handleQuestionChange = (id, field, value) => {
        const updatedQuestions = activities.questions.map(question => {
            if (question.id === id) {
                return { ...question, [field]: value };
            }
            return question;
        });
        setActivities({ ...activities, questions: updatedQuestions });
    };

    const removeQuestion = (id) => {
        const questionsUpdated = activities.questions.filter(question => question.id !== id);
        setActivities({ ...activities, questions: questionsUpdated });
    };

    const submit = (e) => {
    e.preventDefault();

    // Recuperar o ID do usuário logado do localStorage
    const userId = user.id;

    // Adicionar o ID do usuário às atividades
    const updatedActivity = {
        ...activities,
        userId: userId // Associar o ID do usuário à atividade
    };

    // Verificar se é criação ou edição
    const method = activity ? 'PUT' : 'POST';
    const url = activity 
        ? `http://localhost:4000/activities/${activity.id}`
        : 'http://localhost:4000/activities';

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedActivity),
    })
    .then((resp) => resp.json())
    .then((createdActivity) => {
        const activityId = createdActivity.id || activity.id;
        navigate(`/Lovelace_1.2.4/a/${activityId}`);
    })
    .catch((error) => {
        console.error('Erro ao criar/editar a atividade:', error);
    });
};


    return (
        <form className={styles.form} onSubmit={submit}>
            <header className={styles.top}>
                <nav className={styles.intern_top}>
                    <BackButton />
                    <h1>{activity ? "Editar Sala" : "Criar Sala"}</h1>
                    <SubmitButton text={activity ? "Salvar" : "Criar"} />
                </nav>
            </header>
            <div className={styles.header}>
                <TextArea
                    name="name"
                    placeholder="Nome da sala"
                    value={activities.name}
                    handleOnChange={handleChange}
                    required="required"
                />
                <TextArea
                    name="description"
                    placeholder="Descrição"
                    value={activities.description}
                    handleOnChange={handleChange}
                    required="required"
                />
            </div>
            <div className={styles.container_question}>
                {activities.questions.length > 0 && activities.questions.map((question) => (
                    <QuestionBox
                        key={question.id}
                        id={question.id}
                        proposal={question.proposal}
                        text={question.text}
                        handleQuestionChange={handleQuestionChange}
                        handleRemove={removeQuestion}
                    />
                ))}
            </div>
            <button className={styles.plus} type="button" onClick={addQuestion}>
                <FontAwesomeIcon className={styles.plus_svg} icon={faCirclePlus} />
            </button>
        </form>
    );
}

export default FormActivity;

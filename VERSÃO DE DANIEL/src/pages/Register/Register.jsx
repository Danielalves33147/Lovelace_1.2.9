// src/pages/Register.js
import React, { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from "../../services/firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import { useUser } from '../../services/UserContext';  // Agora importando de services
import styles from './Register.module.css';

import { load, sucess_cad, fail } from "../../services/alert.js";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Usando o contexto para armazenar o nome
  const { userName, setUserName } = useUser();

  const [createUserWithEmailAndPassword, userCredential, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const navigate = useNavigate();

  function clearFields() {
    setEmail("");
    setPassword("");
    setUserName("");  // Limpa o campo de nome usando o contexto
  }

  useEffect(() => {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("name", userName);  // Armazena o nome no localStorage
  }, [email, password, userName]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const storedName = localStorage.getItem("name");
    if (storedEmail && storedPassword && storedName) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setUserName(storedName);  // Define o nome no contexto
    }
  }, []);

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: userName,
        email: email
      });

      sucess_cad();
      navigate('/Lovelace_1.2.4');
    } catch (error) {
      console.error("Erro ao registrar ou salvar no Firestore:", error);
      fail();
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Lovelace</h1>
        <span>Informações de Registro</span>
      </header>

      <form onSubmit={handleSignUp}>
        <div className={styles.inputContainer}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Digite seu nome"
            value={userName}  // Usando o contexto
            onChange={(e) => setUserName(e.target.value)}  // Atualiza o contexto
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="lovelace@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.button} type="submit">
          Cadastrar
        </button>
        <div className={styles.footer}>
          <p>Você já tem uma conta?</p>
          <Link to="/Lovelace_1.2.4">Faça login aqui</Link>
        </div>
      </form>
    </div>
  );
}

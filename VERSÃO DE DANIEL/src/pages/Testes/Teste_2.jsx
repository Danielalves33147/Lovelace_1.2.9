import React, { useState, useEffect } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from 'react-router-dom';
import arrowImg from "../../assets/arrow.svg";
import { auth } from "../../services/firebaseConfig.js";
import { load, sucess_cad, fail }  from "../../services/alert.js";
import styles from './teste_2.module.css'


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
    
  const navigate = useNavigate();

  // Function to clear input fields
  function clearFields() {
    setEmail("");
    setPassword("");
  }

  // Store input data in localStorage on any change
  useEffect(() => {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
  }, [email, password]);

  // Retrieve input data from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      load();
    }
    if (user) {
      sucess_cad();
    }else if(error){
      fail();
    }
  }, [loading, user, error]); // Update only on changes to these variables

  
  function handleSignIn(e) { //Envia os dados pro firebase
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Lovelace</h1>
        <span>Informações de Registro</span>
      </header>

      <form onSubmit={handleSignIn}>
        <div className={styles.inputContainer}>
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="lovelace@gmail.com"
            value={email} // Pre-fill with stored value (if available)
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
            value={password} // Pre-fill with stored value (if available)
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.button} onClick={handleSignIn}>
          Cadastrar <img src={arrowImg} alt="->" />
        </button>
        <div className={styles.footer}>
          <p>Você já tem uma conta?</p>
          <Link to="/Lovelace/">Faça login aqui</Link>
        </div>
      </form>
    </div>
  );
}
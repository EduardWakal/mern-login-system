import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

// Die Auth-Komponente beinhaltet sowohl Login als auch Registrierung
export const Auth = () => {
  return (
      <div className="auth">
        <Login />
        <Register />
      </div>
  );
};

// Login-Komponente
const Login = () => {
  // Nutzung von Cookies zum Speichern des Zugriffstokens
  const [_, setCookies] = useCookies(["access_token"]);

  // Verwendung von useState für Benutzername und Passwort
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Verwendung von useNavigate für die Navigation nach der Anmeldung
  const navigate = useNavigate();

  // Funktion zum Einreichen der Anmeldedaten
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Anfrage an den Server zum Einloggen
      const result = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      // Speichern des Zugriffstokens im Cookie und Weiterleitung zur Startseite
      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Formular für die Benutzeranmeldung
  return (
      <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
  );
};

// Registrierungs-Komponente
const Register = () => {
  // Nutzung von useState für Benutzername und Passwort
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Nutzung von Cookies und useNavigate, wie bei der Login-Komponente
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  // Funktion zum Einreichen der Registrierungsdaten
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Anfrage an den Server zur Registrierung
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      alert("Registration Completed! Now login.");
    } catch (error) {
      console.error(error);
    }
  };

  // Formular für die Benutzerregistrierung
  return (
      <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
  );
};

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/register", { username, password, email });
      navigate("/"); // Redirect to login page after successful registration
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Your To Do List Account</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
      <p style={styles.link}>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/")}
          style={styles.loginLink}
        >
          Login here
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
  },
  error: {
    color: "#f44336",
    marginBottom: "15px",
    fontSize: "14px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  input: {
    padding: "12px 15px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },
  inputFocus: {
    borderColor: "#007bff",
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)",
  },
  button: {
    padding: "12px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#218838",
  },
  link: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555",
  },
  loginLink: {
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

// Add focus effect on input fields
const inputFocusStyle = (inputElement) => {
  inputElement.addEventListener('focus', () => {
    inputElement.style.borderColor = "#007bff";
    inputElement.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)";
  });
  inputElement.addEventListener('blur', () => {
    inputElement.style.borderColor = "#ddd";
    inputElement.style.boxShadow = "none";
  });
};

export default RegisterPage;

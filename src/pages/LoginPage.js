import React, { useState } from "react";
import API from "../services/api"; 
import { useNavigate } from "react-router-dom"; 

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/login", { username, password });
      console.log("API response:", response); 
  
      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token); 
        console.log("Token saved:", response.data.data.token); 
        navigate("/checklists"); 
      } else {
        setError("Login failed. No token returned.");
      }
    } catch (err) {
      console.log("Error during login:", err); 
      setError("Login failed. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register"); 
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Login To Do List App</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="Enter your username"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={styles.registerPrompt}>
          Don't have an account?{" "}
          <button type="button" onClick={handleRegister} style={styles.registerButton}>
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "0 20px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "100px",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "450px",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "28px",
    color: "#333",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  inputFocus: {
    borderColor: "#007bff",
  },
  button: {
    width: "100%",
    padding: "12px 0",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
    cursor: "not-allowed",
  },
  error: {
    color: "#f44336",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "15px",
  },
  registerPrompt: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
  },
  registerButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
    padding: "0",
    fontSize: "14px",
  },
};

// Add focus effect on input fields
const inputFocusStyle = (inputElement) => {
  inputElement.addEventListener('focus', () => {
    inputElement.style.borderColor = "#007bff";
  });
  inputElement.addEventListener('blur', () => {
    inputElement.style.borderColor = "#ddd";
  });
};

export default LoginPage;

import React, { useState } from "react";
import API from "../services/api";  // Assuming you have an API service for making HTTP requests
import { useNavigate } from "react-router-dom"; // To handle redirection after login

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
      console.log("API response:", response);  // Log the full response
  
      // Check if response.data.data and response.data.data.token exist
      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token); // Save token to localStorage
        console.log("Token saved:", response.data.data.token);  // Confirm token is saved
        navigate("/checklists"); // Redirect to checklist page
      } else {
        setError("Login failed. No token returned.");
      }
    } catch (err) {
      console.log("Error during login:", err);  // Log any error
      setError("Login failed. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleRegister = () => {
    navigate("/register"); // Redirect to register page
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
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
        <button type="submit" style={styles.button} disabled={loading}>
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
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
    cursor: "not-allowed",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "10px",
  },
  registerPrompt: {
    textAlign: "center",
    marginTop: "15px",
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

export default LoginPage;

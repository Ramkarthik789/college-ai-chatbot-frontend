import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const loginResponse = await API.post("/login/", {
        email: email.trim(),
        password: password,
      });

      const token = loginResponse.data.access_token;

      if (!token) {
        setMessage("Login failed: token not received");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);

      const meResponse = await API.get("/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = meResponse.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);

      setMessage("Login successful");

      if (userData.role === "hod") {
        navigate("/hod-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error("FULL LOGIN ERROR:", error);
      console.error("ERROR RESPONSE:", error.response);
      console.error("ERROR REQUEST:", error.request);

      if (error.response) {
        console.error("BACKEND RESPONSE:", error.response.data);

        if (typeof error.response.data?.detail === "string") {
          setMessage(error.response.data.detail);
        } else {
          setMessage("Login failed. Please check your credentials.");
        }
      } else {
        setMessage("Unable to connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>College AI Chatbot Login</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  form: {
    width: "360px",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "10px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  message: {
    textAlign: "center",
    marginTop: "5px",
    color: "#d32f2f",
  },
};

export default LoginPage;
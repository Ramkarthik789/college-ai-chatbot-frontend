import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [cgpa, setCgpa] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [fees, setFees] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found. Please login again.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchUser = async () => {
      try {
        const res = await API.get("/me/", { headers });
        setUser(res.data);
      } catch (err) {
        console.error("ME ERROR:", err);
      }
    };

    const fetchCgpa = async () => {
      try {
        const res = await API.get("/my-cgpa", { headers });
        setCgpa(res.data);
      } catch (err) {
        console.error("CGPA ERROR:", err);
      }
    };

    const fetchAttendance = async () => {
      try {
        const res = await API.get("/my-attendance", { headers });
        setAttendance(res.data);
      } catch (err) {
        console.error("ATTENDANCE ERROR:", err);
      }
    };

    const fetchFees = async () => {
      try {
        const res = await API.get("/my-fees", { headers });
        setFees(res.data);
      } catch (err) {
        console.error("FEES ERROR:", err);
      }
    };

    fetchUser();
    fetchCgpa();
    fetchAttendance();
    fetchFees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎓 Student Dashboard</h1>

      {error && <p style={styles.error}>{error}</p>}

      {/* 🔥 Top Buttons */}
      <div style={styles.topBar}>
        <button style={styles.button} onClick={() => navigate("/chatbot")}>
          🤖 Open Chatbot
        </button>

        <button style={styles.logoutButton} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Student Info */}
      <div style={styles.card}>
        <h2>Student Info</h2>
        <p><b>Name:</b> {user?.name || "Not Available"}</p>
        <p><b>Email:</b> {user?.email || "Not Available"}</p>
        <p><b>Roll Number:</b> {user?.roll_number || "Not Available"}</p>
        <p><b>Branch:</b> {user?.branch || "Not Available"}</p>
      </div>

      {/* Academic */}
      <div style={styles.card}>
        <h2>Academic Details</h2>
        <p><b>CGPA:</b> {cgpa?.cgpa ?? "Not Available"}</p>
        <p><b>SGPA:</b> {cgpa?.sgpa ?? "Not Available"}</p>
        <p><b>Semester:</b> {cgpa?.semester ?? "Not Available"}</p>
      </div>

      {/* Attendance */}
      <div style={styles.card}>
        <h2>Attendance</h2>
        <p>
          <b>Attendance Percentage:</b>{" "}
          {attendance?.attendance_percentage ?? "Not Available"}%
        </p>
      </div>

      {/* Fees */}
      <div style={styles.card}>
        <h2>Fees</h2>
        <p><b>Total Fee:</b> ₹{fees?.total_fee ?? "Not Available"}</p>
        <p><b>Paid Fee:</b> ₹{fees?.paid_fee ?? "Not Available"}</p>
        <p><b>Pending Fee:</b> ₹{fees?.pending_fee ?? "Not Available"}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "20px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  error: {
    color: "red",
    marginBottom: "20px",
  },
};

export default StudentDashboard;
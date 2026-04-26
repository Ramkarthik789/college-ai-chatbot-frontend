import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function HodDashboard() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [topStudents, setTopStudents] = useState([]);
  const [lowAttendance, setLowAttendance] = useState([]);
  const [feeDefaulters, setFeeDefaulters] = useState([]);
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

    const fetchData = async () => {
      try {
        const userRes = await API.get("/me/", { headers });
        setUser(userRes.data);

        const summaryRes = await API.get("/dashboard/summary", { headers });
        setSummary(summaryRes.data);

        const topRes = await API.get("/dashboard/top-students?limit=5", { headers });
        setTopStudents(topRes.data.top_students || []);

        const lowRes = await API.get("/dashboard/low-attendance?threshold=75", { headers });
        setLowAttendance(lowRes.data.students || []);

        const feeRes = await API.get("/dashboard/fee-defaulters", { headers });
        setFeeDefaulters(feeRes.data.students || []);
      } catch (err) {
        console.error("HOD DASHBOARD ERROR:", err);
        setError("Failed to load HOD dashboard data");
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📋 HOD Dashboard</h1>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.topBar}>
        <button style={styles.button} onClick={() => navigate("/chatbot")}>
          🤖 Open Chatbot
        </button>

        <button style={styles.logoutButton} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div style={styles.card}>
        <h2>HOD Info</h2>
        <p><b>Name:</b> {user?.name || "Not Available"}</p>
        <p><b>Email:</b> {user?.email || "Not Available"}</p>
        <p><b>Role:</b> {user?.role || "Not Available"}</p>
      </div>

      <div style={styles.card}>
        <h2>Dashboard Summary</h2>
        <p><b>Total Students:</b> {summary?.total_students ?? "Not Available"}</p>
        <p><b>Total Faculty:</b> {summary?.total_faculty ?? "Not Available"}</p>
        <p><b>Low Attendance Count:</b> {summary?.low_attendance_count ?? "Not Available"}</p>
        <p><b>Fee Defaulters Count:</b> {summary?.fee_defaulters_count ?? "Not Available"}</p>
        <p>
          <b>Top Student:</b>{" "}
          {summary?.top_student
            ? `${summary.top_student.name} (${summary.top_student.cgpa})`
            : "Not Available"}
        </p>
      </div>

      <div style={styles.card}>
        <h2>🏆 Top Students</h2>
        {topStudents.length > 0 ? (
          topStudents.map((student) => (
            <div key={student.student_id} style={styles.item}>
              <p><b>Name:</b> {student.name}</p>
              <p><b>Roll Number:</b> {student.roll_number}</p>
              <p><b>CGPA:</b> {student.cgpa}</p>
              <p><b>Semester:</b> {student.semester}</p>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>

      <div style={styles.card}>
        <h2>⚠️ Low Attendance Students</h2>
        {lowAttendance.length > 0 ? (
          lowAttendance.map((student) => (
            <div key={student.student_id} style={styles.item}>
              <p><b>Name:</b> {student.name}</p>
              <p><b>Roll Number:</b> {student.roll_number}</p>
              <p><b>Attendance:</b> {student.attendance_percentage}%</p>
            </div>
          ))
        ) : (
          <p>No low attendance students</p>
        )}
      </div>

      <div style={styles.card}>
        <h2>💰 Fee Defaulters</h2>
        {feeDefaulters.length > 0 ? (
          feeDefaulters.map((student) => (
            <div key={student.student_id} style={styles.item}>
              <p><b>Name:</b> {student.name}</p>
              <p><b>Roll Number:</b> {student.roll_number}</p>
              <p><b>Pending Fee:</b> ₹{student.pending_fee}</p>
            </div>
          ))
        ) : (
          <p>No fee defaulters</p>
        )}
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
    textAlign: "center",
    marginBottom: "20px",
  },
  topBar: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  logoutButton: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  item: {
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
  },
};

export default HodDashboard;
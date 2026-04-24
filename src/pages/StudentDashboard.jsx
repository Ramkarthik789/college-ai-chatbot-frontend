import { useEffect, useState } from "react";
import API from "../services/api";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [cgpa, setCgpa] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [fees, setFees] = useState(null);
  const [error, setError] = useState("");

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
        console.log("ME RESPONSE:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error("ME ERROR:", err.response?.data || err.message);
      }
    };

    const fetchCgpa = async () => {
      try {
        const res = await API.get("/my-cgpa", { headers });
        console.log("CGPA RESPONSE:", res.data);
        setCgpa(res.data);
      } catch (err) {
        console.error("CGPA ERROR:", err.response?.data || err.message);
      }
    };

    const fetchAttendance = async () => {
      try {
        const res = await API.get("/my-attendance", { headers });
        console.log("ATTENDANCE RESPONSE:", res.data);
        setAttendance(res.data);
      } catch (err) {
        console.error("ATTENDANCE ERROR:", err.response?.data || err.message);
      }
    };

    const fetchFees = async () => {
      try {
        const res = await API.get("/my-fees", { headers });
        console.log("FEES RESPONSE:", res.data);
        setFees(res.data);
      } catch (err) {
        console.error("FEES ERROR:", err.response?.data || err.message);
      }
    };

    fetchUser();
    fetchCgpa();
    fetchAttendance();
    fetchFees();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎓 Student Dashboard</h1>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.card}>
        <h2>Student Info</h2>
        <p><b>Name:</b> {user?.name || "Not Available"}</p>
        <p><b>Email:</b> {user?.email || "Not Available"}</p>
        <p><b>Roll Number:</b> {user?.roll_number || "Not Available"}</p>
        <p><b>Branch:</b> {user?.branch || "Not Available"}</p>
      </div>

      <div style={styles.card}>
        <h2>Academic Details</h2>
        <p><b>CGPA:</b> {cgpa?.cgpa ?? "Not Available"}</p>
        <p><b>SGPA:</b> {cgpa?.sgpa ?? "Not Available"}</p>
        <p><b>Semester:</b> {cgpa?.semester ?? "Not Available"}</p>
      </div>

      <div style={styles.card}>
        <h2>Attendance</h2>
        <p><b>Attendance Percentage:</b> {attendance?.attendance_percentage ?? "Not Available"}%</p>
      </div>

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
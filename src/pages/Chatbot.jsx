import { useState } from "react";
import API from "../services/api";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const handleDownload = async (downloadUrl, fileName) => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "download.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOWNLOAD ERROR:", error);
      alert("Unable to download file");
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");

    const userMessage = { type: "user", text: message };
    setChat((prev) => [...prev, userMessage]);

    try {
      const res = await API.post(
        "/chatbot/query",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botReply = {
        type: "bot",
        text: res.data.reply || "No response",
        content: res.data.content || "",
        materials: res.data.materials || [],
        students: res.data.students || [],
        topper: res.data.topper || null,
      };

      setChat((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("CHATBOT ERROR:", err);
      setChat((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Error connecting to chatbot 😢",
          content: "",
          materials: [],
          students: [],
          topper: null,
        },
      ]);
    }

    setMessage("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🤖 College AI Chatbot</h1>

      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={msg.type === "user" ? styles.userMsg : styles.botMsg}
          >
            <p>{msg.text}</p>

            {msg.content && <pre style={styles.preBox}>{msg.content}</pre>}

            {msg.materials && msg.materials.length > 0 && (
              <div style={styles.infoBox}>
                <h4>Available Files:</h4>
                {msg.materials.map((item, i) => (
                  <div key={i} style={styles.itemBox}>
                    <p><b>Title:</b> {item.title}</p>
                    <p><b>Type:</b> {item.document_type}</p>
                    <p><b>File:</b> {item.file_name}</p>

                    <button
                      style={styles.downloadButton}
                      onClick={() =>
                        handleDownload(item.download_url, item.file_name)
                      }
                    >
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            )}

            {msg.students && msg.students.length > 0 && (
              <div style={styles.infoBox}>
                <h4>Student List:</h4>
                {msg.students.map((student, i) => (
                  <div key={i} style={styles.itemBox}>
                    <p><b>Name:</b> {student.name}</p>
                    <p><b>Roll Number:</b> {student.roll_number}</p>
                    <p><b>Branch:</b> {student.branch}</p>

                    {student.attendance_percentage !== undefined && (
                      <p><b>Attendance:</b> {student.attendance_percentage}%</p>
                    )}

                    {student.pending_fee !== undefined && (
                      <p><b>Pending Fee:</b> ₹{student.pending_fee}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {msg.topper && (
              <div style={styles.infoBox}>
                <h4>Topper Details:</h4>
                <p><b>Name:</b> {msg.topper.student_name}</p>
                <p><b>Roll Number:</b> {msg.topper.roll_number}</p>
                <p><b>Branch:</b> {msg.topper.branch}</p>
                <p><b>Subject:</b> {msg.topper.subject_name}</p>
                <p><b>Marks:</b> {msg.topper.external_marks}</p>
                <p><b>Grade:</b> {msg.topper.grade}</p>
                <p><b>Grade Points:</b> {msg.topper.grade_points}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  chatBox: {
    height: "520px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
  },
  userMsg: {
    textAlign: "right",
    marginBottom: "12px",
    padding: "10px",
    backgroundColor: "#dbeafe",
    borderRadius: "8px",
  },
  botMsg: {
    textAlign: "left",
    marginBottom: "12px",
    padding: "10px",
    backgroundColor: "#e5e7eb",
    borderRadius: "8px",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  preBox: {
    whiteSpace: "pre-wrap",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "8px",
  },
  infoBox: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
  },
  itemBox: {
    marginBottom: "12px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  downloadButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#16a34a",
    color: "white",
    cursor: "pointer",
  },
};

export default Chatbot;
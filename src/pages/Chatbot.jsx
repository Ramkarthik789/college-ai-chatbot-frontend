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
        { message: message },
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
      };

      setChat((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("CHATBOT ERROR:", err);
      setChat((prev) => [
        ...prev,
        { type: "bot", text: "Error connecting to chatbot 😢", content: "", materials: [] },
      ]);
    }

    setMessage("");
  };

  return (
    <div style={styles.container}>
      <h1>🤖 College AI Chatbot</h1>

      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={msg.type === "user" ? styles.userMsg : styles.botMsg}
          >
            <p>{msg.text}</p>

            {msg.content && (
              <pre style={styles.preBox}>
                {msg.content}
              </pre>
            )}

            {msg.materials && msg.materials.length > 0 && (
              <div style={styles.materialBox}>
                <h4>Available Files:</h4>
                {msg.materials.map((item, i) => (
                  <div key={i} style={styles.materialItem}>
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
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
  },
  chatBox: {
    height: "420px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
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
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  preBox: {
    whiteSpace: "pre-wrap",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "8px",
  },
  materialBox: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
  },
  materialItem: {
    marginBottom: "12px",
    paddingBottom: "10px",
    borderBottom: "1px solid #ddd",
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
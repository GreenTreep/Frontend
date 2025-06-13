import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Salut ! Je suis là pour t’aider, demande-moi ce que tu veux." },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    // Simuler la réponse automatique côté front
    const lowerMsg = userMessage.toLowerCase();
    let botReply = "🤖 Je suis en mode démo. Essaie de me demander une randonnée en IDF !";

    if (lowerMsg.includes("randonnée") || lowerMsg.includes("rando")) {
      botReply = `Voici quelques idées de randonnées en Île-de-France :
• Forêt de Fontainebleau 🌳
• Parc naturel du Vexin 🗺️
• Gorges de Franchard 🥾
• Promenade bleue le long de la Seine 🚶‍♀️`;
    } else if (lowerMsg.includes("bonjour") || lowerMsg.includes("salut")) {
      botReply = "👋 Salut ! Comment puis-je t’aider ?";
    } else if (lowerMsg.includes("merci")) {
      botReply = "🙏 Avec plaisir ! N’hésite pas si tu as d’autres questions.";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 600); // petite latence pour faire plus naturel
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chatContainer}>
        <div style={styles.messagesContainer}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "#4a90e2" : "#e5e5ea",
                color: msg.sender === "user" ? "white" : "black",
                whiteSpace: "pre-line",
              }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <textarea
            rows={1}
            style={styles.input}
            value={input}
            placeholder="Tape ta question..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.button} onClick={sendMessage}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  chatContainer: {
    width: "600px",
    height: "800px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fafafa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  messagesContainer: {
    flex: 1,
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    gap: "10px",
  },
  message: {
    maxWidth: "70%",
    padding: "12px 18px",
    borderRadius: "20px",
    fontSize: "15px",
    lineHeight: "1.5",
    wordWrap: "break-word",
  },
  inputContainer: {
    display: "flex",
    padding: "15px",
    borderTop: "1px solid #ccc",
    gap: "12px",
  },
  input: {
    flex: 1,
    resize: "none",
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4a90e2",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    padding: "12px 25px",
    cursor: "pointer",
  },
};

export default Chatbot;

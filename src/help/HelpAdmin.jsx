import React, { useState } from "react";

const HelpAdmin = () => {
  // État des discussions
  const [discussions, setDiscussions] = useState([
    { id: 1, user: "User1", lastMessage: "Bonjour, j'ai un problème" },
    { id: 2, user: "User2", lastMessage: "Comment utiliser cette fonctionnalité ?" },
    { id: 3, user: "User3", lastMessage: "Merci pour votre aide !" },
  ]);

  // État des messages par discussion
  const [messages, setMessages] = useState({
    1: [
      { sender: "User1", text: "Bonjour, j'ai un problème" },
      { sender: "Admin", text: "Bonjour, je vous écoute !" },
    ],
    2: [
      { sender: "User2", text: "Comment utiliser cette fonctionnalité ?" },
      { sender: "Admin", text: "Voici comment procéder..." },
    ],
    3: [
      { sender: "User3", text: "Merci pour votre aide !" },
      { sender: "Admin", text: "Avec plaisir 😊" },
    ],
  });

  // État pour suivre la discussion sélectionnée
  const [activeDiscussion, setActiveDiscussion] = useState(null);

  return (
    <div className="support-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Discussions</h2>
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className={`discussion-item ${
              activeDiscussion === discussion.id ? "active" : ""
            }`}
            onClick={() => setActiveDiscussion(discussion.id)}
          >
            <strong>{discussion.user}</strong>
            <p>{discussion.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="chat">
        {activeDiscussion ? (
          <>
            <h3>
              Discussion avec{" "}
              {discussions.find((d) => d.id === activeDiscussion)?.user}
            </h3>
            <div className="messages">
              {messages[activeDiscussion]?.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.sender === "Admin" ? "admin-message" : "user-message"
                  }`}
                >
                  <span>{msg.sender}:</span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Écrire un message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    const newMessage = {
                      sender: "Admin",
                      text: e.target.value,
                    };
                    setMessages((prev) => ({
                      ...prev,
                      [activeDiscussion]: [
                        ...(prev[activeDiscussion] || []),
                        newMessage,
                      ],
                    }));
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </>
        ) : (
          <p className="no-discussion">Sélectionnez une discussion pour commencer</p>
        )}
      </div>
    </div>
  );
};

export default HelpAdmin;

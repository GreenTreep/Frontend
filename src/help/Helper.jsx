import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/security/auth/AuthContext";
import api from "@/security/auth/Api";

const Helper = () => {
  const { getId, user } = useAuth(); // Récupère l'ID et les informations de l'utilisateur connecté
  const [messages, setMessages] = useState([]); // Liste des messages
  const [newMessage, setNewMessage] = useState(""); // Contenu du nouveau message
  const [lastMessageId, setLastMessageId] = useState(null); // ID du dernier message
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const messagesEndRef = useRef(null); // Référence pour le scroll automatique

  // Charger les messages au montage du composant
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || user.role !== "USER") return; // Vérifie que l'utilisateur est un USER

      const userId = getId();
      setLoading(true);
      try {
        const response = await api.get(`/messages/user/${userId}/admins`); // Récupère les messages avec les admins
        console.log("Messages fetched:", response.data);
        setMessages(response.data);
        scrollToBottom(); // Scrolle automatiquement en bas après le chargement
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [getId, user]);

  // Envoyer un message à tous les administrateurs
  const sendMessage = async () => {
    if (!newMessage.trim() || user.role !== "USER") return; // Seul le USER peut envoyer des messages

    const messagePayload = {
      content: newMessage, // Contenu du message
      sender: {
        id: getId(), // ID de l'utilisateur connecté
      },
    };

    try {
      const response = await api.post("/messages/from-user", messagePayload); // Envoie le message à tous les admins
      console.log("Response from server:", response.data);

      // Met à jour les messages localement sans rechargement
      const newMessages = Array.isArray(response.data) ? response.data : [response.data];
      setMessages((prevMessages) => [
        ...prevMessages,
        ...newMessages.map((msg) => ({
          ...msg,
          sender: msg.sender || { id: getId(), firstName: "You" }, // Affiche "You" si pas défini
        })),
      ]);
      setNewMessage(""); // Réinitialise le champ
      setLastMessageId(response.data.id); // Définit l'ID du dernier message
      scrollToBottom(); // Scrolle automatiquement après l'envoi
    } catch (error) {
      console.error("Error sending message to all admins:", error);
    }
  };

  // Fonction pour scroller automatiquement en bas
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Dialog>
      {/* Le bouton qui ouvre la boîte de dialogue */}
      <DialogTrigger asChild>
        <Button className="px-7 py-2">Help</Button>
      </DialogTrigger>

      {/* Contenu de la boîte de dialogue */}
      <DialogContent className="flex flex-col max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Discussion</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col flex-grow rounded-lg">
          <Card className="flex-grow p-4 overflow-y-auto max-h-[400px]">
            {loading ? (
              <p className="text-center text-gray-500">Loading messages...</p>
            ) : (
              <div className="flex flex-col gap-1">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender.id === getId() ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[720px] p-2 rounded-xl ${
                        message.sender.id === getId()
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white"
                      } ${
                        lastMessageId === message.id ? "animate-pop" : ""
                      }`} // Ajout de l'animation
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {/* Référence pour scroller en bas */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </Card>
          <div className="flex items-center gap-2 py-4 px-1">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex px-4 py-2 rounded-lg dark:text-white"
            />
            <Button className="w-[80px]" onClick={sendMessage}>
              Envoyer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Helper;
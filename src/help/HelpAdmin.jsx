import React, { useState, useEffect } from 'react';
import api from '@/security/auth/Api';
import DiscussionsList from '@/help/components/DiscussionsList';
import MessagesPanel from '@/help/components/MessagesPanel';
import MessageInput from '@/help/components/MessageInput';

const HelpAdmin = () => {
  const [discussions, setDiscussions] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [lastMessageId, setLastMessageId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/user');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchDiscussions = async () => {
      try {
        const response = await api.get('/support/discussions');
        const formattedDiscussions = formatDiscussions(response.data);
        setDiscussions(formattedDiscussions);
        if (formattedDiscussions.length > 0) {
          handleChatSelect(formattedDiscussions[0].chatId);
        }
      } catch (error) {
        console.error('[HelpAdmin] Error fetching discussions:', error);
      }
    };

    fetchCurrentUser();
    fetchDiscussions();
  }, []);

  const formatDiscussions = (data) => {
    return Object.entries(data)
      .map(([userKey, messages]) => {
        const sortedMessages = messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const lastMessage = sortedMessages[0];
        return {
          chatId: lastMessage.sender.role === 'USER' ? lastMessage.sender.id : lastMessage.receivers[0].id,
          userName: lastMessage.sender.role === 'USER'
            ? `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}`
            : `${lastMessage.receivers[0].firstName} ${lastMessage.receivers[0].lastName}`,
          lastMessage: lastMessage.content,
          lastMessageTime: new Date(lastMessage.timestamp).toISOString(),
        };
      })
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  };

  const handleChatSelect = async (chatId) => {
    setActiveChat(chatId);
    try {
      const response = await api.get(`/messages/user/${chatId}/admins`);
      setMessages(response.data);
    } catch (error) {
      console.error('[HelpAdmin] Error fetching messages:', error);
    }
    setLastMessageId(null);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !activeChat || !currentUser) return;

    try {
      const messageData = {
        content: newMessage,
        sender: { id: currentUser.id },
        receivers: [{ id: activeChat }],
      };

      const response = await api.post('/messages', messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...response.data },
      ]);
      setNewMessage('');
      setLastMessageId(response.data.id);

      const discussions = await api.get('/support/discussions');
      setDiscussions(formatDiscussions(discussions.data));
    } catch (error) {
      console.error('[HelpAdmin] Error sending message:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-72px)] overflow-hidden">
      <div className="grid grid-cols-[25%_75%] h-full m-0 p-0">
        <DiscussionsList
          discussions={discussions}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
        />
        <div className="border flex flex-col justify-end items-center h-full bg-[url('/public/image_1.png')] bg-[length:150%] bg-center overflow-y-auto">
          <MessagesPanel messages={messages} lastMessageId={lastMessageId} />
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default HelpAdmin;

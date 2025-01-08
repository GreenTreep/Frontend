import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MessageInput = ({ newMessage, setNewMessage, onSendMessage }) => {
  return (
    <div className="flex items-center justify-center mb-5 ml-4 w-full">
      <Input
        className="w-[60%] mr-3"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Tapez un message..."
      />
      <Button onClick={onSendMessage}>Envoyer</Button>
    </div>
  );
};

export default MessageInput;

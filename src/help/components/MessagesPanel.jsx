import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MessagesPanel = ({ messages, lastMessageId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className="flex flex-col gap-1 p-5 w-full overflow-y-auto">
      {messages.map((message) => {
        const isSentByAdmin = message.sender.role === 'ADMIN';
        return (
          <div
            key={message.id}
            className={`flex items-center cursor-pointer ${
              isSentByAdmin ? 'justify-end' : 'justify-start'
            }`}
          >
            {!isSentByAdmin && (
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[720px] p-2 rounded-xl ${
                isSentByAdmin
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
              } ${
                lastMessageId === message.id ? 'animate-pop' : ''
              } break-words whitespace-pre-wrap`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesPanel;

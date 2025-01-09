import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DiscussionsList = ({ discussions, activeChat, onChatSelect }) => {
  return (
    <div className="border flex flex-col divide-y overflow-y-auto h-full">
      {discussions.map((discussion) => (
        <div
          key={discussion.chatId}
          onClick={() => onChatSelect(discussion.chatId)}
          className={`border p-2 flex cursor-pointer ${
            activeChat === discussion.chatId ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
        >
          <div className="flex justify-center items-center">
            <Avatar className="mr-2">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{discussion.userName[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-4/5 flex flex-col justify-between relative">
            <h1 className="text-l font-bold flex items-center justify-between">
              {discussion.userName}
              <span className="text-sm text-gray-500 ml-2 absolute right-0">
                {new Date(discussion.lastMessageTime).toLocaleString()}
              </span>
            </h1>
            <p
              className="text-gray-700 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap"
              style={{ maxWidth: '100%' }}
            >
              {discussion.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscussionsList;

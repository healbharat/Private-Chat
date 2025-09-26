
import React from 'react';
import type { Message, User } from '../types';
import { USER_DETAILS } from '../constants';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUser }) => {
  const isCurrentUser = message.sender === currentUser;
  const senderDetails = USER_DETAILS[message.sender];

  const bubbleClasses = isCurrentUser
    ? 'bg-blue-600 text-white self-end rounded-l-2xl rounded-tr-2xl'
    : 'bg-gray-700 text-gray-200 self-start rounded-r-2xl rounded-tl-2xl';

  const containerClasses = isCurrentUser
    ? 'flex items-end justify-end'
    : 'flex items-end justify-start';

  return (
    <div className={containerClasses}>
      {!isCurrentUser && (
        <img src={senderDetails.avatar} alt={senderDetails.name} className="w-8 h-8 rounded-full mr-3 self-end mb-1 flex-shrink-0" />
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 shadow-md ${bubbleClasses}`}>
        <p className="text-sm break-words">{message.text}</p>
      </div>
    </div>
  );
};

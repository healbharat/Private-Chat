
import React, { useState, useEffect, useRef } from 'react';
import type { User, Message } from '../types';
import { USER_DETAILS } from '../constants';
import { MessageBubble } from './MessageBubble';

interface ChatScreenProps {
  currentUser: User;
  onLogout: () => void;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ currentUser, onLogout, messages, onSendMessage }) => {
  const otherUser = currentUser === 'user1' ? 'user2' : 'user1';
  const { name: otherUserName, avatar: otherUserAvatar } = USER_DETAILS[otherUser];
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-black">
      <header className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md">
        <div className="flex items-center">
          <img src={otherUserAvatar} alt={otherUserName} className="w-10 h-10 rounded-full mr-3" />
          <h1 className="text-xl font-bold">{otherUserName}</h1>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Logout
        </button>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUser={currentUser} />
        ))}
        <div ref={messagesEndRef} />
      </main>
      
      <footer className="p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
            aria-label="Message input"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex-shrink-0"
            disabled={!newMessage.trim()}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

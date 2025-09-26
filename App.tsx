import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { ChatScreen } from './components/ChatScreen';
import type { User, Message } from './types';

const MESSAGES_STORAGE_KEY = 'private-chat-messages';

const getStoredMessages = (): Message[] => {
  try {
    const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      // Parse messages and convert timestamp strings back to Date objects
      const parsed = JSON.parse(storedMessages) as any[];
      return parsed.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }));
    }
  } catch (error) {
    console.error("Failed to parse messages from localStorage", error);
    // If parsing fails, clear the corrupted data
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
  }
  return [];
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>(getStoredMessages);

  // Effect to listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === MESSAGES_STORAGE_KEY) {
        setMessages(getStoredMessages());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: currentUser,
      timestamp: new Date(),
    };
    
    // Read the latest messages directly from storage to prevent race conditions
    const updatedMessages = [...getStoredMessages(), newMessage];
    
    // Update state for the current tab
    setMessages(updatedMessages);
    
    // Update localStorage, which will trigger the 'storage' event for other tabs
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
  };

  return (
    <div className="font-sans antialiased text-white">
      {currentUser ? (
        <ChatScreen 
          currentUser={currentUser} 
          onLogout={handleLogout}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;

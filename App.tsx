import React, { useState, useEffect } from 'react';
import { ref, onValue, push, off, remove } from 'firebase/database';
import { database } from './services/firebaseService';
import { LoginScreen } from './components/LoginScreen';
import { ChatScreen } from './components/ChatScreen';
import type { User, Message } from './types';
import { firebaseConfig } from './firebase-config';

const MESSAGES_DB_KEY = 'messages';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = ref(database, MESSAGES_DB_KEY);

  // Check if Firebase config has been updated
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-red-500 text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Action Required: Configure Firebase</h1>
          <p className="text-gray-300 mb-6">
            This real-time chat application requires a Firebase backend to function. Please follow these steps to set it up.
          </p>
          <ol className="text-left text-gray-400 list-decimal list-inside space-y-3 mb-8">
            <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Firebase Console</a> and create a new project.</li>
            <li>In your project, click the Web icon (<code>&lt;/&gt;</code>) to add a Web App and get your configuration credentials.</li>
            <li>From the menu, go to <strong>Build &gt; Realtime Database</strong>, create a database, and start it in <strong>test mode</strong>.</li>
            <li>Open the <code className="bg-gray-700 rounded px-1.5 py-1 text-sm text-yellow-300">firebase-config.ts</code> file in this project's code.</li>
            <li>Copy your unique <code className="bg-gray-700 rounded px-1.5 py-1 text-sm text-yellow-300">firebaseConfig</code> object from the Firebase console and paste it into that file.</li>
          </ol>
          <p className="text-gray-500 text-sm">Once the file is saved, the app will be ready to use.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Listener for real-time updates from Firebase
    const handleNewMessages = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const messagesList: Message[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          timestamp: new Date(data[key].timestamp) // Convert timestamp string back to Date
        }));
        // Sort messages by timestamp to ensure correct order
        messagesList.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    };

    onValue(messagesRef, handleNewMessages);

    // Cleanup listener on component unmount
    return () => {
      off(messagesRef, 'value', handleNewMessages);
    };
  }, [messagesRef]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout? This will permanently delete the chat history for everyone.")) {
      // Remove the entire 'messages' node from Firebase
      remove(messagesRef)
        .catch((error) => {
          console.error("Error deleting messages:", error);
          // Still log out the user even if delete fails
        })
        .finally(() => {
          setCurrentUser(null);
        });
    }
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;

    const newMessage = {
      text,
      sender: currentUser,
      timestamp: new Date().toISOString(), // Use ISO string for Firebase compatibility
    };
    
    // Push the new message to Firebase Realtime Database
    push(messagesRef, newMessage);
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

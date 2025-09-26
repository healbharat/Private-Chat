import React, { useState, FormEvent } from 'react';
import type { User } from '../types';
import { USER_CREDENTIALS } from '../constants';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === USER_CREDENTIALS.user1.email && password === USER_CREDENTIALS.user1.pass) {
      onLogin('user1');
      return;
    }
    if (email === USER_CREDENTIALS.user2.email && password === USER_CREDENTIALS.user2.pass) {
      onLogin('user2');
      return;
    }
    setError('Invalid email or password.');
  };

  const setDemoUser = (user: User) => {
    setEmail(USER_CREDENTIALS[user].email);
    setPassword(USER_CREDENTIALS[user].pass);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-4xl font-bold text-center text-white mb-2">Private Chat</h1>
        <p className="text-center text-gray-400 mb-8">A private chat for Alex & Jordan.</p>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="alex@gemini.com"
              required
              aria-label="Email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password123"
              required
              aria-label="Password"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4" role="alert">{error}</p>}
          <div className="flex items-center justify-between mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-300"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center text-gray-500 my-4">or switch user</div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setDemoUser('user1')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-full sm:w-auto"
          >
            Login as Alex
          </button>
          <button
            onClick={() => setDemoUser('user2')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-full sm:w-auto"
          >
            Login as Jordan
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Card from "../../components/card"; 
import { SessionCreateData } from '../api/sessions/sessiontypes'
import { createSession } from '../api/sessions'

export default function SessionMenuPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [sessionData, setSessionData] = useState({ name: '', description: '', session_type: '' });
  const [selectedChoice, setSelectedChoice] = useState<'casual' | 'ranked' | null>(null);

  const handleChoice = (choice: 'casual' | 'ranked') => {
    const sessionType = choice === 'casual' ? 'ladder' : '1-day-pass';
    setSessionData({ ...sessionData, session_type: sessionType });
    setSelectedChoice(choice);
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Call your API to create a session
      const response = await createSession(sessionData);

      // Navigate to the next page with session ID
      router.push(`/application?sessionId=${response.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-4 text-xl font-bold">Choose Session Type</h1>
      <div className="flex space-x-4">
        <Card
          className={`text-center cursor-pointer p-12 ${selectedChoice === 'casual' ? 'bg-slate-400' : ''}`}
          onClick={() => handleChoice('casual')}
        >
          Casual
        </Card>
        <Card
          className={`text-center cursor-pointer p-12 ${selectedChoice === 'ranked' ? 'bg-slate-400' : ''}`}
          onClick={() => handleChoice('ranked')}
        >
          Ranked
        </Card>
      </div>
      {showForm && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Session Name"
            value={sessionData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={sessionData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            rows={3}
          />
          <button 
            onClick={handleSubmit} 
            className="w-full p-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

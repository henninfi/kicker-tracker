// components/NewSessionCard.tsx

import React from 'react';
import Card from './card'; // Ensure your Card component is properly structured
import Link from 'next/link';

const NewSessionCard: React.FC = () => {
  return (
    <Link href="/my_sessions/create"> 
        <Card className="flex flex-col items-start h-32 space-y-2 p-4 bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <h3 className="text-lg font-semibold text-white  mt-2 ml-2">New Session</h3>
            <p className="text-xs text-white mt-2 ml-2">Create a new session</p>
        </Card>
    </Link>
  );
};

export default NewSessionCard;

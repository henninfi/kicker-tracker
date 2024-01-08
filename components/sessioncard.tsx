// components/SessionCard.tsx

import React from 'react';
import Card from './card'; // Ensure your Card component is properly structured
import { SessionOut } from '../pages/api/sessions/sessiontypes'
import Link from 'next/link';


  

interface SessionCardProps {
  session: SessionOut;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const formattedEndDate = session.end_date ? new Date(session.end_date).toLocaleDateString() : 'N/A';

  return (
    <Link href={`/application?sessionId=${session.id}`}>    
        <Card className="flex flex-col items-start h-32 space-y-2 p-4 bg-white border-2 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 transition-shadow duration-300 border-gray-300 shadow-gray-200">
            <h3 className="text-lg font-semibold mt-2 ml-2">{session.name}</h3>
            <h4 className="text-xs mt-2 ml-2">{session.description}</h4>
            {/* <p className="text-sm text-right">End Date: {formattedEndDate}</p> */}
        </Card>
    </Link>
  );
};

export default SessionCard;

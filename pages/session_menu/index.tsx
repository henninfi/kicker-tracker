// components/SessionMenu.tsx

import Card from "../../components/card"; // Assuming you have a Card component
import { useRouter } from 'next/router';
import { FaQuestionCircle } from 'react-icons/fa'; // Example using react-icons
import { SessionCreateData } from '../api/sessions/sessiontypes'
import { createSession } from '../api/sessions'

export default function SessionMenuPage() {
    const router = useRouter();
    const { query } = router;

    const handleChoice = async (choice: 'casual' | 'ranked') => {


        try {
            // Convert the choice to the session type required by your API
            // For example, if your API expects 'ladder' or '1-day-pass', map the choice to these values
            const sessionType = choice === 'casual' ? 'ladder' : '1-day-pass';
            const sessionData: SessionCreateData = { session_type: sessionType };

            // Call createSession and wait for the response
            const response = await createSession(sessionData);

            // Navigate to the main page with the session ID as a query parameter
            router.push(`/ny_versjon?sessionId=${response.id}`);
        } catch (error) {
            console.error('Failed to create session:', error);
            // Handle the error appropriately
            // For example, you might want to show an error message to the user
        }
        };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-4 text-xl font-bold">Choose Session Type</h1>
      <div className="flex space-x-4">
        <Card
          className="text-center cursor-pointer p-12"
          onClick={() => handleChoice('casual')}
        //   helperIcon={<FaQuestionCircle />}
        >
          Casual
        </Card>
        <Card
          className="text-center cursor-pointer p-12"
          onClick={() => handleChoice('ranked')}
        //   helperIcon={<FaQuestionCircle />}
        >
          Ranked
        </Card>
      </div>
    </div>
  );
}

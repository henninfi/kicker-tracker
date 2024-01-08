// pages/CreatePlayerPage.tsx

import PlayerForm from '../../components/player-form'; // Adjust the import path as necessary
import { useRouter } from 'next/router';
import { withRequiredAuthInfo } from "@propelauth/react";

function CreatePlayerPage() {
  const router = useRouter();
//   const sessionId = router.query.sessionId as string;

  // Function to handle the closing of the player form (e.g., navigate to a different page)
  const handleClose = () => {
    router.push(`/my_sessions`); // Navigate to the session page or another page as required
  };


  return (
    <div className="w-full max-w-3xl m-auto">
      <h1 className="mb-4 text-xl font-bold">Update Player</h1>
      <PlayerForm onClose={handleClose} />
    </div>
  );
}

export default withRequiredAuthInfo(CreatePlayerPage)
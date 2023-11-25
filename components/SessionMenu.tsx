// components/SessionMenu.tsx

import Card from './card'; // Assuming you have a Card component

interface SessionMenuProps {
  onChoice: (choice: 'casual' | 'ranked') => void;
}

export default function SessionMenu({ onChoice }: SessionMenuProps) {
  return (
    <div className="flex justify-center space-x-4">
      <Card
        className="text-center cursor-pointer p-4"
        onClick={() => onChoice('casual')}
      >
        Casual
      </Card>
      <Card
        className="text-center cursor-pointer p-4"
        onClick={() => onChoice('ranked')}
      >
        Ranked
      </Card>
    </div>
  );
}

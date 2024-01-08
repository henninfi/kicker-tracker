
import React from 'react';

// Define the type for the component's props
type ShareLinkButtonProps = {
  onClose: () => void;  // Specify that onClose is a function that returns nothing (void)
};

// Define the component with TypeScript type annotations
const ShareLinkButton: React.FC<ShareLinkButtonProps> = ({ onClose }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert("Invitation-URL Copied."))
            .catch(err => console.error("Failed to copy URL: ", err)); // Handle any errors
    };

    return (
        <div className="relative basis-1/2 text-center space-y-2 bg-slate-700 rounded-2xl p-4 text-slate-100 transition-colors duration-150">
            {/* Close Button */}
            <button 
                onClick={onClose}  // Use the onClose function when the button is clicked
                className="absolute top-2 right-4 w-8 text-white bg-transparent hover:bg-slate-600 rounded-full text-lg p-1 focus:outline-none"
                aria-label="Close"
            >
                x
            </button>

            <h1>
                <u><b>Invite Friends</b></u>
            </h1>
            <p className="text-s text-white">
                <b>1. Get shareable link:</b> Click "Get Invite-link" below.
            </p>

            <p className="text-s text-white">
                <b>2. Share Away:</b> Share with your friends.
            </p>

            <button 
                onClick={copyToClipboard} 
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring">
                Get Invite-link
            </button>
        </div>
    );
}

export default ShareLinkButton;
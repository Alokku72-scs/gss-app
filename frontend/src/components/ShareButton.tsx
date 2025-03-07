import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import SharePopup from './SharePopup';

interface ShareButtonProps {}

const ShareButton: React.FC<ShareButtonProps> = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="flex items-center mx-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      >
        <Share2 size={20} className="mr-2" />
        Share Quiz Link
      </button>

      {showPopup && (
        <SharePopup
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default ShareButton;
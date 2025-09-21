import React, { useState } from 'react';
import PoliceAssistantOverlay from './PoliceAssistantOverlay';

const PoliceImage: React.FC = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handlePoliceClick = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <>
      {/* Police Image - Bottom Right */}
      <div className="fixed bottom-0 right-0 z-20">
        <img 
          src="/police.png" 
          alt="Police Officer" 
          className="w-32 h-auto md:w-48 lg:w-56 opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-105 drop-shadow-lg"
          onClick={handlePoliceClick}
          title="Click to open AI Police Assistant"
        />
      </div>

      {/* Police Assistant Overlay */}
      <PoliceAssistantOverlay 
        isOpen={isOverlayOpen} 
        onClose={handleCloseOverlay} 
      />
    </>
  );
};

export default PoliceImage;
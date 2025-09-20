import React, { useState } from 'react';
import { ChatbotAvatar } from './ChatbotAvatar';

/**
 * Simple test component to verify ChatbotAvatar works
 * This is a minimal version to test basic functionality
 */
export const SimpleAvatarTest: React.FC = () => {
  const [speaking, setSpeaking] = useState(false);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>
        ChatbotAvatar Test
      </h1>
      
      <div style={{ 
        width: '300px', 
        height: '300px',
        border: '2px solid #ccc',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <ChatbotAvatar
          speaking={speaking}
          mood="neutral"
          size="medium"
        />
      </div>
      
      <button
        onClick={() => setSpeaking(!speaking)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: speaking ? '#ff4444' : '#44ff44',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {speaking ? 'Stop Speaking' : 'Start Speaking'}
      </button>
      
      <p style={{ marginTop: '20px', color: '#666' }}>
        If you can see the 3D avatar above, the component is working!
      </p>
    </div>
  );
};

export default SimpleAvatarTest;

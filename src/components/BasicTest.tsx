import React from 'react';

/**
 * Basic test component to verify React is working
 */
export const BasicTest: React.FC = () => {
  return (
    <div style={{ 
      padding: '50px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'green' }}>✅ React is working!</h1>
      <p>If you can see this, the basic setup is working.</p>
      <p>Now try: <a href="/avatar-test">http://localhost:5174/avatar-test</a></p>
    </div>
  );
};

export default BasicTest;

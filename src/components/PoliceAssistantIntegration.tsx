import React from 'react';
import { useLocation } from 'react-router-dom';
import { AvatarProvider } from '../contexts/AvatarContext';
import InteractivePoliceAssistant from './InteractivePoliceAssistant';

interface PoliceAssistantIntegrationProps {
  children?: React.ReactNode;
}

export const PoliceAssistantIntegration: React.FC<PoliceAssistantIntegrationProps> = ({ 
  children 
}) => {
  const location = useLocation();
  
  // Don't show assistant on landing page, login, or signup pages
  const excludedPaths = ['/', '/login', '/signup'];
  const shouldShowAssistant = !excludedPaths.includes(location.pathname);

  return (
    <AvatarProvider>
      {children}
      {shouldShowAssistant && <InteractivePoliceAssistant />}
    </AvatarProvider>
  );
};

export default PoliceAssistantIntegration;
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { AvatarModel } from './AvatarModel';

interface ChatbotAvatarProps {
  /** Whether the avatar is currently speaking (animates mouth) */
  speaking: boolean;
  /** Current mood of the avatar affecting facial expression and head tilt */
  mood: 'neutral' | 'happy' | 'thinking';
  /** Size of the avatar - scales responsively within flex containers */
  size?: 'small' | 'medium' | 'large';
  /** Custom className for additional styling */
  className?: string;
  /** Enable/disable orbit controls for debugging */
  enableControls?: boolean;
}

/**
 * 3D Animated Chatbot Avatar Component
 * 
 * This component renders a friendly humanoid avatar with idle animations and
 * real-time speaking animations. It's designed to be responsive and scalable.
 * 
 * Integration points for real-time chatbot events:
 * - speaking prop: Set to true when chatbot starts speaking, false when stops
 * - mood prop: Update based on conversation context or user sentiment
 * 
 * Example usage:
 * ```tsx
 * <ChatbotAvatar 
 *   speaking={isBotSpeaking} 
 *   mood={currentMood}
 *   size="medium"
 * />
 * ```
 */
export const ChatbotAvatar: React.FC<ChatbotAvatarProps> = ({
  speaking,
  mood,
  size = 'medium',
  className = '',
  enableControls = false
}) => {
  // Responsive sizing based on container
  const scale = useMemo(() => {
    switch (size) {
      case 'small':
        return 0.8;
      case 'large':
        return 1.2;
      default:
        return 1;
    }
  }, [size]);

  // Container dimensions for responsive scaling
  const containerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    minHeight: '200px',
    minWidth: '200px',
    maxHeight: '400px',
    maxWidth: '400px',
  }), []);

  return (
    <div 
      className={`chatbot-avatar-container ${className}`}
      style={containerStyle}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 2], 
          fov: 50 
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {/* Lighting setup for friendly appearance */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8}
          castShadow
        />
        <pointLight position={[-5, -5, -5]} intensity={0.3} />

        {/* Environment for realistic reflections */}
        <Environment preset="sunset" />

        {/* Contact shadows for grounding effect */}
        <ContactShadows 
          position={[0, -0.5, 0]} 
          opacity={0.25} 
          scale={2} 
          blur={1.5} 
          far={0.5} 
        />

        {/* Avatar Model with animations */}
        <Suspense fallback={null}>
          <AvatarModel 
            speaking={speaking}
            mood={mood}
            scale={scale}
          />
        </Suspense>

        {/* Optional orbit controls for debugging */}
        {enableControls && (
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        )}
      </Canvas>
    </div>
  );
};

export default ChatbotAvatar;

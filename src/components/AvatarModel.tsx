import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface AvatarModelProps {
  speaking: boolean;
  mood: 'neutral' | 'happy' | 'thinking';
  scale?: number;
}

/**
 * Modular avatar model component that can be easily replaced with a GLTF model later.
 * This component renders a simple humanoid avatar using basic Three.js geometries.
 * 
 * To replace with a GLTF model:
 * 1. Import useGLTF from @react-three/drei
 * 2. Replace the geometry with <primitive object={gltf.scene} />
 * 3. Apply the same animations and materials to the GLTF model
 */
export const AvatarModel: React.FC<AvatarModelProps> = ({ 
  speaking, 
  mood, 
  scale = 1 
}) => {
  const headRef = useRef<Mesh>(null);
  const mouthRef = useRef<Mesh>(null);
  const leftEyeRef = useRef<Mesh>(null);
  const rightEyeRef = useRef<Mesh>(null);
  const bodyRef = useRef<Mesh>(null);

  // Breathing animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Breathing animation for body
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02;
    }
    
    // Blinking animation
    if (leftEyeRef.current && rightEyeRef.current) {
      const blink = Math.sin(time * 3) > 0.9 ? 0.1 : 1;
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;
    }
    
    // Speaking animation for mouth
    if (mouthRef.current && speaking) {
      mouthRef.current.scale.y = 0.3 + Math.sin(time * 8) * 0.2;
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = 0.3;
    }
  });

  // Mood-based head tilt and expression
  const headRotation = useMemo(() => {
    switch (mood) {
      case 'happy':
        return [0, 0, 0.1]; // Slight tilt up
      case 'thinking':
        return [0, 0, -0.1]; // Slight tilt down
      default:
        return [0, 0, 0];
    }
  }, [mood]);

  // Mood-based eye expression
  const eyeScale = useMemo(() => {
    switch (mood) {
      case 'happy':
        return [1, 0.7, 1]; // Squinted eyes
      case 'thinking':
        return [0.8, 1, 1]; // Narrower eyes
      default:
        return [1, 1, 1];
    }
  }, [mood]);

  return (
    <group scale={scale}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.5, 0]} rotation={headRotation}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.1, 0.55, 0.25]} scale={eyeScale}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.1, 0.55, 0.25]} scale={eyeScale}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 0.45, 0.25]} scale={[0.1, 0.3, 0.05]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.6, 16]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.3, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      <mesh position={[0.3, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, -0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.1, -0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
};

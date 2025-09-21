import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AvatarState {
  isListening: boolean;
  isTalking: boolean;
  emotion: 'neutral' | 'happy' | 'surprised' | 'sad' | 'angry';
  message: string;
  volume: number;
}

interface AvatarContextType {
  avatarState: AvatarState;
  speak: (message: string) => void;
  startListening: () => void;
  stopListening: () => void;
  setEmotion: (emotion: AvatarState['emotion']) => void;
  updateVolume: (volume: number) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

interface AvatarProviderProps {
  children: ReactNode;
}

export const AvatarProvider: React.FC<AvatarProviderProps> = ({ children }) => {
  const [avatarState, setAvatarState] = useState<AvatarState>({
    isListening: false,
    isTalking: false,
    emotion: 'neutral',
    message: '',
    volume: 0
  });

  const speak = useCallback((message: string) => {
    setAvatarState(prev => ({
      ...prev,
      message,
      isTalking: true,
      emotion: 'happy'
    }));

    // Simulate speech duration
    setTimeout(() => {
      setAvatarState(prev => ({
        ...prev,
        isTalking: false,
        emotion: 'neutral',
        message: ''
      }));
    }, message.length * 50); // Rough estimate of speech duration
  }, []);

  const startListening = useCallback(() => {
    setAvatarState(prev => ({
      ...prev,
      isListening: true,
      emotion: 'surprised'
    }));
  }, []);

  const stopListening = useCallback(() => {
    setAvatarState(prev => ({
      ...prev,
      isListening: false,
      emotion: 'neutral'
    }));
  }, []);

  const setEmotion = useCallback((emotion: AvatarState['emotion']) => {
    setAvatarState(prev => ({
      ...prev,
      emotion
    }));
  }, []);

  const updateVolume = useCallback((volume: number) => {
    setAvatarState(prev => ({
      ...prev,
      volume
    }));
  }, []);

  return (
    <AvatarContext.Provider value={{
      avatarState,
      speak,
      startListening,
      stopListening,
      setEmotion,
      updateVolume
    }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = (): AvatarContextType => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};
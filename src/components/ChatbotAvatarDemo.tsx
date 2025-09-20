import React, { useState, useEffect } from 'react';
import { ChatbotAvatar } from './ChatbotAvatar';

/**
 * Demo component showcasing the ChatbotAvatar functionality
 * This demonstrates how to integrate the avatar with real-time chatbot events
 */
export const ChatbotAvatarDemo: React.FC = () => {
  const [speaking, setSpeaking] = useState(false);
  const [mood, setMood] = useState<'neutral' | 'happy' | 'thinking'>('neutral');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Simulate speaking animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeaking(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate mood changes
  useEffect(() => {
    const moods: Array<'neutral' | 'happy' | 'thinking'> = ['neutral', 'happy', 'thinking'];
    let currentIndex = 0;

    const moodInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % moods.length;
      setMood(moods[currentIndex]);
    }, 5000);

    return () => clearInterval(moodInterval);
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Chatbot Avatar Demo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Display */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">3D Avatar</h2>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="h-96 w-full">
                <ChatbotAvatar
                  speaking={speaking}
                  mood={mood}
                  size={size}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Controls</h2>
            
            {/* Speaking Toggle */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-medium mb-3">Speaking Animation</h3>
              <button
                onClick={() => setSpeaking(!speaking)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  speaking 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {speaking ? 'Stop Speaking' : 'Start Speaking'}
              </button>
            </div>

            {/* Mood Selection */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-medium mb-3">Mood</h3>
              <div className="space-y-2">
                {(['neutral', 'happy', 'thinking'] as const).map((moodOption) => (
                  <button
                    key={moodOption}
                    onClick={() => setMood(moodOption)}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      mood === moodOption
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-medium mb-3">Size</h3>
              <div className="space-y-2">
                {(['small', 'medium', 'large'] as const).map((sizeOption) => (
                  <button
                    key={sizeOption}
                    onClick={() => setSize(sizeOption)}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      size === sizeOption
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Display */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-medium mb-3">Current Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Speaking:</span>
                  <span className={`font-medium ${speaking ? 'text-red-500' : 'text-gray-500'}`}>
                    {speaking ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mood:</span>
                  <span className="font-medium text-blue-500 capitalize">{mood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium text-green-500 capitalize">{size}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Guide */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            Integration Guide
          </h3>
          <div className="text-blue-700 space-y-2">
            <p>
              <strong>Real-time Speaking:</strong> Connect the <code>speaking</code> prop to your chatbot's 
              speech synthesis events (onStart/onEnd callbacks).
            </p>
            <p>
              <strong>Mood Updates:</strong> Update the <code>mood</code> prop based on conversation context, 
              user sentiment analysis, or specific conversation states.
            </p>
            <p>
              <strong>Responsive Sizing:</strong> The avatar automatically scales within flex containers. 
              Use the <code>size</code> prop for different contexts (chat window, full screen, etc.).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAvatarDemo;

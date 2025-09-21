import React, { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Mic, MicOff, Minimize2, Maximize2, Send } from 'lucide-react';
import policeVideo from './police.mp4';

interface PoliceAssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const PoliceAssistantOverlay: React.FC<PoliceAssistantOverlayProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'voice' | 'chat'>('voice');
  const [isFullSize, setIsFullSize] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number>();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Initialize Web Audio API for voice visualization
  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);
      
      startVoiceVisualization();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const startVoiceVisualization = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateVisualization = () => {
      if (analyserRef.current && isListening) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
      }
      
      animationRef.current = requestAnimationFrame(updateVisualization);
    };
    
    updateVisualization();
  };

  const handleVoiceToggle = async () => {
    if (isListening) {
      setIsListening(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      setIsListening(true);
      if (!audioContextRef.current) {
        await initializeAudio();
      } else {
        startVoiceVisualization();
      }
    }
  };

  // Video control functions
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Simulate bot speaking (this would be triggered by actual TTS)
  const simulateBotResponse = (responseText: string) => {
    setIsBotSpeaking(true);
    playVideo();
    
    // Calculate video duration based on text length (roughly 150 words per minute)
    const words = responseText.split(' ').length;
    const duration = (words / 150) * 60 * 1000; // Convert to milliseconds
    
    setTimeout(() => {
      setIsBotSpeaking(false);
      pauseVideo();
      resetVideo();
    }, Math.max(duration, 2000)); // Minimum 2 seconds
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        text: inputMessage,
        isUser: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const response = {
          text: "Hello! I'm your AI Police Assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, response]);
        
        // If in voice mode, play video for bot response
        if (mode === 'voice') {
          simulateBotResponse(response.text);
        }
      }, 1000);
      
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      // Stop video on cleanup
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  // Add welcome message when opening in chat mode
  useEffect(() => {
    if (isOpen && mode === 'chat' && messages.length === 0) {
      setMessages([{
        text: "Hello! I'm your AI Police Assistant. I can help you with filing complaints, getting information about police services, or answering any questions you might have. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, mode, messages.length]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 cursor-pointer"
      style={{ backdropFilter: 'blur(12px)' }}
      onClick={handleBackdropClick}
    >
      {/* Overlay Container */}
      <div 
        ref={overlayRef}
        className={`relative bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 cursor-default ${
          isFullSize 
            ? 'w-full h-full max-w-6xl max-h-[90vh] m-4' 
            : 'w-96 h-96'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-400/20 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">🚔</span>
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold text-lg">AI Police Assistant</h3>
              <p className="text-gray-600 text-sm">
                {mode === 'voice' ? 'Voice Mode' : 'Chat Mode'} • Online
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Mode Toggle */}
            <div className="flex bg-gray-200/50 rounded-lg p-1">
              <button
                onClick={() => setMode('voice')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'voice' 
                    ? 'bg-orange-400 text-white shadow-sm' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMode('chat')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'chat' 
                    ? 'bg-yellow-400 text-white shadow-sm' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
            
            {/* Size Toggle */}
            <button
              onClick={() => setIsFullSize(!isFullSize)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isFullSize ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content - Fixed Layout Structure */}
        <div className="flex flex-col" style={{ height: 'calc(100% - 80px)' }}>
          {mode === 'voice' ? (
            /* Voice Mode with Video */
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white/30 to-cream-50/30">
              {/* Hidden Video Element */}
              <video
                ref={videoRef}
                src={policeVideo}
                loop
                muted
                className="hidden"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />
              
              {/* Video Display Area with Circular Interface */}
              <div className="relative mb-8">
                {/* Video Container */}
                <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-amber-200 shadow-2xl bg-amber-50">
                  <video
                    src={policeVideo}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      isBotSpeaking ? 'opacity-100' : 'opacity-40'
                    }`}
                    loop
                    muted
                    autoPlay={isBotSpeaking}
                  />
                </div>
                
                {/* Circular Voice Interface Overlay */}
                <div 
                  className="absolute inset-0 w-64 h-64 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={handleVoiceToggle}
                  style={{
                    background: isBotSpeaking 
                      ? 'transparent' 
                      : `conic-gradient(from 0deg, #f0e68c ${audioLevel * 360}deg, rgba(240, 230, 140, 0.3) ${audioLevel * 360}deg)`
                  }}
                >
                  {/* Inner Circle for Voice Interaction */}
                  {!isBotSpeaking && (
                    <div 
                      className={`w-32 h-32 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 flex items-center justify-center transition-all duration-200 ${
                        isListening ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'
                      }`}
                      style={{
                        transform: `scale(${1 + audioLevel * 0.3})`
                      }}
                    >
                      {isListening ? (
                        <MicOff className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </div>
                  )}

                  {/* Animated Rings for User Voice */}
                  {isListening && !isBotSpeaking && (
                    <>
                      <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping opacity-75"></div>
                      <div className="absolute inset-4 rounded-full border-4 border-amber-400 animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
                    </>
                  )}
                  
                  {/* Bot Speaking Indicator */}
                  {isBotSpeaking && (
                    <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-pulse"></div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {isBotSpeaking 
                    ? 'AI Assistant Speaking...' 
                    : isListening 
                    ? 'Listening...' 
                    : 'Tap to speak'
                  }
                </h3>
                <p className="text-gray-600 max-w-md">
                  {isBotSpeaking
                    ? 'The AI assistant is responding to your query. Please listen carefully.'
                    : isListening 
                    ? 'I\'m listening. Speak clearly and I\'ll help you with your query.'
                    : 'Click the microphone to start voice interaction with the AI assistant.'
                  }
                </p>
                
                {/* Voice Level Indicator */}
                {isListening && !isBotSpeaking && (
                  <div className="mt-6">
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-sm text-gray-600">Voice Level:</span>
                      <div className="w-32 h-2 bg-gray-300/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-100"
                          style={{ width: `${audioLevel * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Bot Speaking Progress */}
                {isBotSpeaking && (
                  <div className="mt-6">
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-sm text-gray-600">AI Responding:</span>
                      <div className="w-32 h-2 bg-gray-300/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Test Bot Response Button (for demonstration) */}
                <div className="mt-6">
                  <button
                    onClick={() => simulateBotResponse("Hello! I am your AI Police Assistant. I can help you with filing complaints, getting information about police services, emergency contact numbers, and answering any questions you might have about law enforcement procedures.")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    disabled={isBotSpeaking}
                  >
                    {isBotSpeaking ? 'AI Speaking...' : 'Test AI Response'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Chat Mode - Fixed Layout */
            <>
              {/* Messages Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/20 backdrop-blur-sm">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isUser
                          ? 'bg-yellow-400 text-white shadow-sm'
                          : 'bg-white/30 backdrop-blur-sm text-gray-800 shadow-sm border border-white/20'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-yellow-100' : 'text-gray-600'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area - Fixed at Bottom */}
              <div className="flex-shrink-0 p-4 border-t border-white/10 bg-white/10 backdrop-blur-sm">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="px-4 py-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center min-w-[48px]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoliceAssistantOverlay;
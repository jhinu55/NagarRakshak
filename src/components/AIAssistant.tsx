import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Bot,
  User,
  Volume2,
  VolumeX,
  Languages,
  Settings
} from 'lucide-react';
import { UserRole } from '../App';
import { generateWithGemini } from '../lib/gemini';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, userRole }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: userRole === 'citizen' 
        ? 'नमस्ते! मैं नगर रक्षक AI असिस्टेंट हूं। मैं आपकी शिकायत दर्ज करने में मदद कर सकता हूं। आप हिंदी, अंग्रेजी या कोंकणी में बात कर सकते हैं।'
        : 'Hello Officer! I\'m your AI assistant. I can help you with case management, legal guidance, and administrative tasks. How can I assist you today?',
      timestamp: new Date(),
      language: userRole === 'citizen' ? 'Hindi' : 'English'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const hasGemini = typeof import.meta.env.VITE_GEMINI_API_KEY !== 'undefined' && !!import.meta.env.VITE_GEMINI_API_KEY;

  const languages = ['English', 'Hindi', 'Konkani', 'Marathi'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      let aiResponse: string;
      if (hasGemini) {
        const system = userRole === 'citizen'
          ? 'You are the Goa Police citizen assistant. Be empathetic, precise, multilingual (English/Hindi/Konkani/Marathi), and guide citizens to file complaints, check status, and find help. Keep answers short and actionable.'
          : 'You are the Goa Police officer assistant. Provide precise, concise responses about case management, IPC sections, reports, and workflows. Avoid hallucinations; ask clarifying questions.';
        aiResponse = await generateWithGemini(inputMessage, { systemInstruction: system });
      } else {
        aiResponse = generateAIResponse(inputMessage, userRole);
      }
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: `Sorry, I couldn’t reach the AI service. ${err?.message ? `(${err.message})` : ''}`,
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (input: string, role: UserRole): string => {
    const lowerInput = input.toLowerCase();
    
    if (role === 'citizen') {
      if (lowerInput.includes('complaint') || lowerInput.includes('शिकायत')) {
        return 'मैं आपकी शिकायत दर्ज करने में मदद करूंगा। कृपया बताएं कि क्या हुआ था? आप अपनी भाषा में बोल सकते हैं।';
      }
      if (lowerInput.includes('theft') || lowerInput.includes('चोरी')) {
        return 'चोरी की शिकायत के लिए मुझे निम्नलिखित जानकारी चाहिए: 1) क्या चोरी हुआ है? 2) कब हुआ? 3) कहाँ हुआ? 4) क्या आपके पास कोई गवाह है?';
      }
      if (lowerInput.includes('status') || lowerInput.includes('स्थिति')) {
        return 'अपने केस की स्थिति जानने के लिए कृपया अपना FIR नंबर बताएं। मैं आपको अपडेट दे दूंगा।';
      }
      return 'मैं समझ गया। क्या आप अपनी समस्या के बारे में और विस्तार से बता सकते हैं? मैं आपकी पूरी मदद करूंगा।';
    } else {
      if (lowerInput.includes('case') || lowerInput.includes('fir')) {
        return 'I can help you with case management. Would you like to: 1) Search for a specific case, 2) Update case status, 3) Generate reports, or 4) Assign cases to officers?';
      }
      if (lowerInput.includes('legal') || lowerInput.includes('ipc')) {
        return 'For legal guidance, I can help with IPC sections, case law references, and procedural requirements. What specific legal information do you need?';
      }
      if (lowerInput.includes('report') || lowerInput.includes('document')) {
        return 'I can generate various reports and documents including FIR reports, charge sheets, and case summaries. Which document would you like me to prepare?';
      }
      return 'I understand. Let me help you with that. Could you provide more specific details about what you need assistance with?';
    }
  };

  const getLangCode = (lang: string) => {
    switch (lang) {
      case 'Hindi': return 'hi-IN';
      case 'Konkani': return 'kok-IN';
      case 'Marathi': return 'mr-IN';
      default: return 'en-IN';
    }
  };

  const handleVoiceToggle = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      try { recognitionRef.current?.stop?.(); } catch {}
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = getLangCode(selectedLanguage);
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalTranscript = '';
    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interim += transcript;
      }
      const combined = (finalTranscript + interim).trim();
      setInputMessage(combined);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };

  const handleSpeak = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      const lang = getLangCode(selectedLanguage);
      utterance.lang = lang;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.split('-')[0])) || voices[0];
      if (preferred) utterance.voice = preferred;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-black/60 to-black/40">
      <div className="rounded-2xl shadow-2xl w-full max-w-4xl h-[82vh] flex flex-col border border-white/10 glass">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 goa-ai-gradient rounded-full flex items-center justify-center pulse-dot">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Goa Police AI Assistant</h2>
              <p className="text-sm text-white/70">
                {userRole === 'citizen' ? 'Citizen Support' : 'Officer Support'} • Online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1 border border-white/20 bg-white/10 text-white rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-[var(--goa-cerulean)]' 
                    : 'goa-ai-gradient'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-[var(--goa-cerulean)] text-white'
                    : 'bg-white/10 text-white border border-white/10'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.type === 'user' ? 'text-blue-100' : 'text-white/60'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                      {message.language && ` • ${message.language}`}
                    </span>
                    {message.type === 'ai' && (
                      <button
                        onClick={() => handleSpeak(message.content)}
                        className={`ml-2 p-1 rounded ${
                          isSpeaking ? 'text-cyan-300' : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        {isSpeaking ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-white/10 border border-white/10 text-white rounded-2xl px-4 py-2">
                <div className="bars">
                  <div className="bar" />
                  <div className="bar" />
                  <div className="bar" />
                  <div className="bar" />
                  <div className="bar" />
                </div>
                <span className="text-xs text-white/70">AI is thinking…</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-white/10">
          {/* Quick intents */}
          <div className="flex flex-wrap gap-2 mb-3">
            {['File a complaint', 'Case status', 'Nearest police station'].map((q) => (
              <button key={q} onClick={() => setInputMessage(q)} className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20">
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleVoiceToggle}
              className={`p-3 rounded-full transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Type your message in ${selectedLanguage}...`}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/10 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Languages className="w-4 h-4 text-white/60" />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-3 goa-ai-gradient text-white rounded-full hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {isRecording && (
            <div className="mt-3 flex items-center gap-3 text-white/80">
              <div className="bars">
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
              <span className="text-sm">Listening… Speak in {selectedLanguage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

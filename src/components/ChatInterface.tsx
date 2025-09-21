import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Volume2, 
  VolumeX,
  Globe,
  MessageCircle,
  Phone
} from 'lucide-react';

interface ChatInterfaceProps {
  language: 'en' | 'hi' | 'kok';
  onBack: () => void;
  accessibilityMode: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  language, 
  onBack 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const colors = {
    deepIndigo: '#2E3A59',
    teal: '#008080',
    amber: '#FFC107',
    whiteOpacity: 'rgba(255, 255, 255, 0.1)'
  };

  // Multi-language content
  const content = {
    en: {
      title: "Chat Support",
      subtitle: "Get instant help from our AI assistant",
      placeholder: "Type your message here...",
      listening: "Listening...",
      typing: "Assistant is typing...",
      voiceInput: "Voice Input",
      audioToggle: "Toggle Audio",
      emergencyHelp: "Emergency Help",
      quickActions: {
        title: "Quick Actions",
        fileComplaint: "How to file a complaint?",
        trackStatus: "Track my complaint status",
        contactOfficer: "Contact assigned officer",
        emergencyNumber: "Emergency contact numbers"
      },
      suggestions: [
        "How can I file a new complaint?",
        "What documents do I need?",
        "How long does investigation take?",
        "Can I track my complaint online?"
      ],
      welcomeMessage: "Hello! I'm your police assistant. How can I help you today?",
      botResponses: {
        filing: "To file a complaint, click on 'File Complaint' on the main dashboard. You'll need to provide personal details, incident information, and any evidence you have.",
        tracking: "You can track your complaint using the reference number provided when you submitted it. Use the 'Track Complaint' feature on the main page.",
        documents: "For filing a complaint, you typically need: 1) Valid ID proof, 2) Address proof, 3) Any evidence related to the incident (photos, videos, documents), 4) Witness contact details if available.",
        timeline: "Investigation timelines vary based on case complexity. Simple cases may be resolved in 7-15 days, while complex cases can take 30-90 days. You'll receive regular updates on your complaint status.",
        emergency: "For immediate emergencies, call 100 (Police), 108 (Ambulance), or 101 (Fire). For non-emergency assistance, you can file a complaint through this portal."
      }
    },
    hi: {
      title: "चैट सहायता",
      subtitle: "हमारे AI सहायक से तुरंत मदद पाएं",
      placeholder: "यहां अपना संदेश टाइप करें...",
      listening: "सुन रहा है...",
      typing: "सहायक टाइप कर रहा है...",
      voiceInput: "आवाज इनपुट",
      audioToggle: "ऑडियो टॉगल करें",
      emergencyHelp: "आपातकालीन सहायता",
      quickActions: {
        title: "त्वरित कार्य",
        fileComplaint: "शिकायत कैसे दर्ज करें?",
        trackStatus: "मेरी शिकायत की स्थिति ट्रैक करें",
        contactOfficer: "नियुक्त अधिकारी से संपर्क करें",
        emergencyNumber: "आपातकालीन संपर्क नंबर"
      },
      suggestions: [
        "मैं नई शिकायत कैसे दर्ज कर सकता हूं?",
        "मुझे कौन से दस्तावेज चाहिए?",
        "जांच में कितना समय लगता है?",
        "क्या मैं अपनी शिकायत ऑनलाइन ट्रैक कर सकता हूं?"
      ],
      welcomeMessage: "नमस्ते! मैं आपका पुलिस सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      botResponses: {
        filing: "शिकायत दर्ज करने के लिए, मुख्य डैशबोर्ड पर 'शिकायत दर्ज करें' पर क्लिक करें। आपको व्यक्तिगत विवरण, घटना की जानकारी, और आपके पास जो भी सबूत हों, प्रदान करने होंगे।",
        tracking: "आप अपनी शिकायत को उस संदर्भ नंबर का उपयोग करके ट्रैक कर सकते हैं जो आपको जमा करते समय दिया गया था। मुख्य पृष्ठ पर 'शिकायत ट्रैक करें' सुविधा का उपयोग करें।",
        documents: "शिकायत दर्ज करने के लिए, आपको आमतौर पर चाहिए: 1) वैध आईडी प्रूफ, 2) एड्रेस प्रूफ, 3) घटना से संबंधित कोई भी सबूत (फोटो, वीडियो, दस्तावेज), 4) गवाह संपर्क विवरण यदि उपलब्ध हो।",
        timeline: "जांच की समयसीमा मामले की जटिलता के आधार पर अलग होती है। सामान्य मामले 7-15 दिनों में हल हो सकते हैं, जबकि जटिल मामलों में 30-90 दिन लग सकते हैं। आपको अपनी शिकायत की स्थिति पर नियमित अपडेट मिलेंगे।",
        emergency: "तत्काल आपातकाल के लिए, 100 (पुलिस), 108 (एम्बुलेंस), या 101 (फायर) पर कॉल करें। गैर-आपातकालीन सहायता के लिए, आप इस पोर्टल के माध्यम से शिकायत दर्ज कर सकते हैं।"
      }
    },
    kok: {
      title: "चॅट सहाय्य",
      subtitle: "आमच्या AI सहायकाकडून तत्काळ मदत घ्या",
      placeholder: "हांगा तुमचो संदेश टाइप करात...",
      listening: "ऐकतात...",
      typing: "सहायक टाइप करतात...",
      voiceInput: "आवाज इनपुट",
      audioToggle: "ऑडियो टॉगल करात",
      emergencyHelp: "आपतकालीन मदत",
      quickActions: {
        title: "फटाफट कार्य",
        fileComplaint: "तक्रार कशी नोंदोवची?",
        trackStatus: "म्हज्या तक्रारीची स्थिती ट्रॅक करात",
        contactOfficer: "नेमलेल्या अधिकाऱ्याशी संपर्क करात",
        emergencyNumber: "आपतकालीन संपर्क नंबर"
      },
      suggestions: [
        "हांव नवी तक्रार कशी नोंदोवंक शकता?",
        "म्हाका कोणते कागदपत्र जाय?",
        "तपासणीक किती वेळ लागता?",
        "हांव म्हजी तक्रार ऑनलाइन ट्रॅक करूंक शकता का?"
      ],
      welcomeMessage: "नमस्कार! हांव तुमचो पोलीस सहायक. आज हांव तुमची कशी मदत करूंक शकता?",
      botResponses: {
        filing: "तक्रार नोंदोवपाक, मुख्य डॅशबोर्डाचेर 'तक्रार नोंदोवची' हाचेर क्लिक करात. तुमकां व्यक्तिगत माहिती, घटनेची माहिती, आनी तुमच्याकडे आसलेले पुरावे दिवचे पडटले.",
        tracking: "तुमी तुमची तक्रार त्या संदर्भ नंबराचो वापर करून ट्रॅक करूंक शकता जो तुमकां सादर करतना दिला गेलो. मुख्य पानाचेर 'तक्रार ट्रॅक करात' सुविधेचो वापर करात.",
        documents: "तक्रार नोंदोवपाक, तुमकां सामान्यपणान जाय: 1) वैध आयडी प्रूफ, 2) पत्त्याचो पुरावो, 3) घटनेशी संबंधीत कोणतोय पुरावो (फोटो, व्हिडिओ, कागदपत्र), 4) साक्षीदाराचे संपर्क तपशील जर उपलब्ध आसत.",
        timeline: "तपासणीची वेळमर्यादा केसाच्या जटिलतेवर आदारीत आसता. सोपे केस 7-15 दिसांनी सुटूंक शकतात, जाल्यार जटिल केसांनी 30-90 दीस लागूंक शकतात. तुमकां तुमच्या तक्रारीच्या स्थितीवर नियमीत अपडेट मेळटले.",
        emergency: "तत्काळ आपतकालाक, 100 (पोलीस), 108 (एम्ब्युलन्स), वा 101 (आग) हाचेर कॉल करात. गैर-आपतकालीन सहाय्याक, तुमी ह्या पोर्टलाचे वरवीं तक्रार नोंदोवूंक शकता."
      }
    }
  };

  const currentContent = content[language];

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: currentContent.welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [currentContent.welcomeMessage, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const generateBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('file') || msg.includes('complaint') || msg.includes('नोंदोव') || msg.includes('दर्ज')) {
      return currentContent.botResponses.filing;
    } else if (msg.includes('track') || msg.includes('status') || msg.includes('ट्रैक') || msg.includes('स्थिती')) {
      return currentContent.botResponses.tracking;
    } else if (msg.includes('document') || msg.includes('paper') || msg.includes('कागदपत्र') || msg.includes('दस्तावेज')) {
      return currentContent.botResponses.documents;
    } else if (msg.includes('time') || msg.includes('long') || msg.includes('समय') || msg.includes('वेळ')) {
      return currentContent.botResponses.timeline;
    } else if (msg.includes('emergency') || msg.includes('urgent') || msg.includes('आपातकाल') || msg.includes('आपतकाल')) {
      return currentContent.botResponses.emergency;
    } else {
      return "I understand your concern. Could you please provide more details about what specific help you need? You can also use the quick action buttons below for common queries.";
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Text-to-speech for bot response (if audio enabled)
      if (audioEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse.content);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      // Start voice recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'kok' ? 'kok-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      }
    } else {
      setIsListening(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-90"
        style={{
          background: `linear-gradient(135deg, ${colors.deepIndigo} 0%, ${colors.teal} 100%)`
        }}
      />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">{currentContent.title}</h1>
            <p className="text-white/70 text-sm">{currentContent.subtitle}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
              title={currentContent.audioToggle}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            <button className="p-2 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-400/30 hover:bg-red-500/30 transition-all duration-300 text-red-300">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 relative z-10 px-6 py-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-amber-500' 
                    : 'bg-teal-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl backdrop-blur-md border ${
                  message.type === 'user'
                    ? 'bg-amber-500/20 border-amber-400/30 text-white rounded-br-lg'
                    : 'bg-white/10 border-white/20 text-white rounded-bl-lg'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 opacity-70 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 rounded-bl-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <p className="text-xs mt-2 text-white/70">{currentContent.typing}</p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative z-10 px-6 py-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h4 className="text-white font-medium mb-3">{currentContent.quickActions.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickAction(currentContent.quickActions.fileComplaint)}
                className="text-left p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 text-white text-sm"
              >
                {currentContent.quickActions.fileComplaint}
              </button>
              <button
                onClick={() => handleQuickAction(currentContent.quickActions.trackStatus)}
                className="text-left p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 text-white text-sm"
              >
                {currentContent.quickActions.trackStatus}
              </button>
              <button
                onClick={() => handleQuickAction(currentContent.quickActions.contactOfficer)}
                className="text-left p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 text-white text-sm"
              >
                {currentContent.quickActions.contactOfficer}
              </button>
              <button
                onClick={() => handleQuickAction(currentContent.quickActions.emergencyNumber)}
                className="text-left p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 text-white text-sm"
              >
                {currentContent.quickActions.emergencyNumber}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="relative z-10 p-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={currentContent.placeholder}
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none max-h-32"
              />
              
              {/* Voice Input Button */}
              <button
                onClick={toggleVoiceInput}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={currentContent.voiceInput}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-2xl transition-all duration-300 text-white"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Status */}
          {isListening && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-red-300">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm">{currentContent.listening}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
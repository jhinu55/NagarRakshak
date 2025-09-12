import React from 'react';
import { 
  Brain, 
  Languages, 
  Mic, 
  MessageCircle,
  Database,
  Cloud,
  Lock,
  RefreshCw
} from 'lucide-react';

const AICapabilities = () => {
  const capabilities = [
    {
      icon: Brain,
      title: "Advanced NLP Understanding",
      description: "At its core is a powerful Natural Language Processing engine that understands various Indian languages, dialects, and even mixed-language sentences (e.g. Hinglish). It grasps casual descriptions of incidents and extracts structured details like names, dates, and offense types. This makes the system extremely robust in real-world scenarios where people might not speak formally – it bridges the gap between everyday speech and the formal language needed for police records."
    },
    {
      icon: Languages,
      title: "Real-Time Multilingual Translation",
      description: "The assistant is inherently multilingual. It can switch interface languages on the fly and translate conversations in real time. For example, if a user speaks in Konkani, the system can display and store the complaint in both Konkani and English. It leverages modern language models (like the government's Bhashini platform) to translate between Indian languages and major world languages seamlessly. This ensures inclusive accessibility—citizens can interact in their mother tongue while officers still get information in a language they understand."
    },
    {
      icon: Mic,
      title: "Speech Recognition & Voice Response",
      description: "The AI includes high-accuracy speech-to-text for capturing voice inputs, even in a noisy police station environment, and text-to-speech for conversing naturally. It can handle multiple speakers in one conversation (e.g., if two people are narrating an incident). The assistant's voice responses sound human-like and are available in multiple languages and voices (for example, a soothing female voice in Hindi or a neutral male voice in English). It creates a smooth, human-like conversational experience."
    },
    {
      icon: MessageCircle,
      title: "Context Awareness",
      description: "The AI remembers context within the dialogue. If a citizen shares their name or details early on, and later just says, \"I lost my phone,\" the system knows who \"I\" refers to and what was already discussed. It can handle multi-turn conversations with clarifications (\"Could you spell that street name for me?\") and refer back to earlier answers if needed. The assistant also adapts its tone depending on the user – more polite and guiding for citizens, and more concise or report-like for officers using it as a tool."
    },
    {
      icon: Database,
      title: "Legal Knowledge Graph",
      description: "Under the hood is an extensive knowledge graph of Indian laws and police procedures. The AI cross-references the user's input with this database to categorize the complaint correctly and provide legal info. Mentioning keywords like \"dowry\" or \"bribe\" will trigger the relevant IPC sections in its response or filing. If asked, it can quote the exact text of a law or list the penalties for a given offense. This ensures legal accuracy in all guidance and documentation."
    },
    {
      icon: Cloud,
      title: "Simulated Backend Integrations",
      description: "Nagar Rakshak 2.0 can run fully standalone (offline), but it smartly simulates certain integrations to give a full experience. For example, when a new FIR is filed, it generates a dummy FIR number in the same format as official systems. It can simulate sending an OTP to the user's phone/email for verification, and even validate ID numbers (like Aadhaar or PAN formats) for correctness. Users and officers get the feeling of a connected smart system even without real-time network connectivity."
    },
    {
      icon: Lock,
      title: "Privacy & Security Built-in",
      description: "The system is designed with data privacy and security as top priorities. All conversations and records stay local to the station's server – none of the sensitive data is uploaded to cloud servers. Everything is encrypted and access-controlled. The AI also enforces privacy rules; for example, it may mask or not vocally repeat sensitive personal information (like names of minors or victims) in open areas. It maintains citizen trust by safeguarding their data."
    },
    {
      icon: RefreshCw,
      title: "Continuous Learning",
      description: "The AI model and knowledge base are continuously updatable. As laws change (for instance, if new criminal codes or amendments come into effect), the system can be updated so it always follows the latest legal framework. It also learns from usage – administrators can feed back common unanswered questions or new types of queries into the system to improve it. The assistant gets smarter and more relevant over time."
    }
  ];

  return (
    <section id="ai-capabilities" className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Intelligent Core
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Powered by cutting-edge AI technology that understands, learns, and adapts to serve both citizens and officers better
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* Central AI Visual */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Brain className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-cyan-300 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="absolute top-4 -right-4 w-4 h-4 bg-cyan-500 rounded-full animate-ping"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {capabilities.map((capability, index) => {
            const IconComponent = capability.icon;
            return (
              <div 
                key={index}
                className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:border-cyan-400/50 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      {capability.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AICapabilities;
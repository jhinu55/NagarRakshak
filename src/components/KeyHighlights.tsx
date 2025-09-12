import React from 'react';
import { 
  Settings, 
  MessageSquare, 
  CheckSquare, 
  BarChart3, 
  Scale, 
  Shield 
} from 'lucide-react';

const KeyHighlights = () => {
  const highlights = [
    {
      icon: Settings,
      title: "Agentic Automation",
      description: "End-to-end workflow automation for FIR filing, case routing, and document drafting, reducing manual work."
    },
    {
      icon: MessageSquare,
      title: "Conversational Interface",
      description: "Natural multilingual voice/text chat with contextual understanding for smooth dialogues."
    },
    {
      icon: CheckSquare,
      title: "Guided Workflows",
      description: "Step-by-step complaint filing with intelligent form validation to ensure complete, accurate information."
    },
    {
      icon: BarChart3,
      title: "Integrated Dashboard",
      description: "Unified case management dashboard with real-time updates, alerts, and easy assignment tools."
    },
    {
      icon: Scale,
      title: "Legal Intelligence",
      description: "Built-in legal guidance (IPC section suggestions, case law references) to assist in investigations."
    },
    {
      icon: Shield,
      title: "Offline & Accessible",
      description: "24/7 offline-capable operation with voice guidance and full accessibility for all users."
    }
  ];

  return (
    <section id="overview" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Revolutionary AI-Powered Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming police operations with cutting-edge technology that bridges the gap between citizens and law enforcement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <div 
                key={index}
                className="group bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border border-slate-200 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyHighlights;
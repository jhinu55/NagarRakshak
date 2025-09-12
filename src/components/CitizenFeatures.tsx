import React from 'react';
import { 
  Mic, 
  FileCheck, 
  FileText, 
  Camera, 
  Monitor, 
  Activity,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';

const CitizenFeatures = () => {
  const features = [
    {
      icon: Mic,
      title: "Multilingual Voice & Text Complaint Filing",
      description: "Citizens can file complaints by speaking or typing in English, Hindi, Konkani, or other languages. The AI transcribes their report in real time and converts it into a structured FIR format, eliminating the need for handwritten forms. This makes complaint registration accessible to everyone – including tourists and those uncomfortable with paperwork – by allowing a natural conversation instead of complex forms."
    },
    {
      icon: FileCheck,
      title: "Guided Form Filling & Verification",
      description: "The assistant guides users through simple, step-by-step questions (covering who, what, when, where of the incident) to ensure no detail is missed. It automatically checks inputs for errors (like invalid dates or contact info) and asks follow-up questions for clarity if needed. Even first-time users can easily complete what would normally be a complex FIR form correctly, since the AI ensures all critical information is captured accurately."
    },
    {
      icon: FileText,
      title: "Instant FIR Document Generation",
      description: "Once details are provided, the system instantly generates a properly formatted FIR/complaint document (in English or the local language) for review. It neatly organizes the information into the official format and gives the citizen a reference number along with a digital or printed copy. This saves time and guarantees the complaint is in the correct format, replacing tedious clerical drafting with one-click document creation."
    },
    {
      icon: Camera,
      title: "Photo, Video & ID Upload",
      description: "Users can attach photos or videos as evidence, and scan or upload an ID for verification. The AI uses OCR to extract details from the ID (name, address, ID number) and can perform basic authenticity checks on the document. For extra security, it can even match the ID photo with a live snapshot of the user to confirm identity. Incorporating evidence at the filing stage makes the complaint more robust, and automated ID capture speeds up verification far beyond what manual data entry could."
    },
    {
      icon: Monitor,
      title: "24/7 Self-Service Kiosk & Portal",
      description: "The system is accessible via a web portal and on-site touchscreen kiosks at police stations, enabling citizens to initiate complaints any time—day or night—without waiting for an officer. The kiosk offers voice-guided help in multiple languages, and the mobile-friendly web app extends access to users at home. This reduces queues and front-desk workload by letting the public help themselves. Even after office hours, police services remain accessible, improving the overall service availability."
    },
    {
      icon: Activity,
      title: "Real-Time Status Tracking",
      description: "After filing a complaint, citizens receive a reference ID to track its progress. They can ask the assistant for status updates (for example, \"Has my case been registered?\"), or check a status page to see updates like \"FIR registered\", \"Under Investigation\", or \"Action Taken\". The system updates these statuses as the case progresses. It brings transparency and peace of mind—people stay informed about their case without having to repeatedly call or visit the station for updates."
    },
    {
      icon: HelpCircle,
      title: "Legal Guidance & FAQs",
      description: "Beyond just taking complaints, the assistant can answer common legal questions and provide guidance. For instance, a user might ask, \"What are my rights if I get harassed?\" or \"How do I file a cybercrime report?\" The AI draws on a built-in knowledge base of Indian law and procedures to give clear, jargon-free answers. It can also explain next steps (like how to obtain a copy of one's FIR or the typical timeline for an investigation). This empowers citizens with knowledge of their rights and the proper procedures, giving them reliable legal advice even before they speak to an officer."
    },
    {
      icon: ThumbsUp,
      title: "Feedback and Follow-up",
      description: "After a case is resolved, the system can prompt the citizen to provide feedback or a satisfaction rating on how their complaint was handled. This might appear as a short survey or simple rating in the app or kiosk. This fosters trust and continuous improvement by giving the public a voice in evaluating police services – a feedback loop far more engaging and actionable than a simple suggestion box."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Empowering Citizens
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Making police services accessible, transparent, and user-friendly for every citizen
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-cyan-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
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

export default CitizenFeatures;
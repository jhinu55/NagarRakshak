import React from 'react';
import { 
  BarChart, 
  Smartphone, 
  WifiOff, 
  FileCheck,
  Puzzle,
  Bot,
  Accessibility
} from 'lucide-react';

const SystemFeatures = () => {
  const features = [
    {
      icon: BarChart,
      title: "Dynamic Dashboards & Visualization",
      description: "Beyond individual cases, the system provides aggregate data dashboards for macro-level insight. Station commanders can see real-time charts of crime statistics, identify trends (like spikes in certain crime types or peak hours for incidents), and even view a map of crime hotspots. It gives management a bird's-eye view of operations, helping in resource allocation (e.g., scheduling more night patrols if most incidents occur at night) and evaluating the impact of initiatives or interventions."
    },
    {
      icon: Smartphone,
      title: "Mobile App Companion",
      description: "Nagar Rakshak 2.0 isn't tied to a desk. It comes with a mobile app (Android/iOS) for both officers and citizens. Officers in the field receive push notifications about new complaints or updates, and they can update case info or communicate through the app. Citizens can file and track complaints directly from their phones. This adds flexibility and responsiveness – police can react faster with real-time alerts on their mobile devices, and the public can access services on-the-go without needing to visit the station."
    },
    {
      icon: WifiOff,
      title: "Offline Functionality",
      description: "The entire system is designed to work without internet connectivity. All core features – voice recognition, language translation, data storage – run locally on a server at the police station (or even a powerful kiosk). This offers resilience and reliability. Police work cannot stop when the network is down or in rural areas with limited internet. Nagar Rakshak 2.0 ensures that even in offline mode, complaints are filed and information is available 24/7, which is a huge improvement over systems that depend on constant internet access."
    },
    {
      icon: FileCheck,
      title: "Audit Trail & Accountability",
      description: "Every action on a case (filing, edits, status changes, assignments) is logged with a timestamp and user ID. Authorized officials can review a complete audit trail for any case, and any modifications are clearly recorded. In future versions, this could even be secured via blockchain for absolute tamper-proofing. It builds accountability and trust in the system. Both citizens and senior officers can be confident that once information is entered, it can't be secretly altered."
    },
    {
      icon: Puzzle,
      title: "Integration-Ready Architecture",
      description: "While Nagar Rakshak 2.0 is a standalone solution today, it's built with open APIs and hooks to integrate with other systems. It can be connected to national databases like CCTNS, court record systems, or e-government services when needed. Modules for extras like e-payment of fines, attaching CCTV footage from city cameras, or automatic SMS/email alerts to complainants are available to switch on when an internet connection is present. This ensures the platform is future-ready and easily upgradeable."
    },
    {
      icon: Bot,
      title: "Beyond Chatbot – Task Automation",
      description: "Unlike simple FAQ chatbots, this assistant actually takes action. It files and registers cases, drafts documents, verifies IDs, and manages workflows automatically. It's like having a virtual clerk and legal assistant working 24/7. The result is massive efficiency gains — routine tasks that used to consume hours of staff time are handled by AI in seconds. Officers can then dedicate more time to on-ground investigation and community policing, while the \"digital clerk\" handles the repetitive paperwork in the background."
    },
    {
      icon: Accessibility,
      title: "User-Friendly & Accessible Design",
      description: "The platform is designed for ease of use, even for those not tech-savvy. The interface is clean and intuitive, with menus and prompts in multiple languages. Important instructions and alerts are also given via voice, aiding users who have reading difficulties. Accessibility features like adjustable text size, high contrast mode, and voice commands/input ensure that differently-abled users (e.g., visually impaired or those who cannot use a keyboard) can use the system effectively. It ensures no citizen or officer is left behind."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Robust Platform Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Built for reliability, scalability, and seamless integration with existing police infrastructure
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-cyan-200 transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SystemFeatures;
import React from 'react';
import { 
  Layout, 
  AlertTriangle, 
  Users, 
  FileEdit,
  Lightbulb,
  BookOpen,
  Globe,
  Mic2,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

const PoliceFeatures = () => {
  const features = [
    {
      icon: Layout,
      title: "Secure Case Management Dashboard",
      description: "Officers and station managers get a real-time dashboard of all incoming and ongoing cases at a glance. Complaints are automatically categorized (e.g. as FIRs, non-cognizable reports, emergencies) for easy sorting and triage. The dashboard provides filters by status, priority, and category. From here, an officer can assign cases to investigators, update case statuses, or mark them resolved. Role-based logins ensure each user sees only what they should, and sensitive data stays protected. This streamlines case load management—supervisors can prioritize incidents quickly, and nothing falls through the cracks thanks to a transparent, tamper-proof log of every case."
    },
    {
      icon: AlertTriangle,
      title: "Prioritization & Alerts",
      description: "The system automatically flags urgent cases. If the content of a complaint suggests an emergency or serious offense, that case is highlighted (e.g., in red) and immediate alerts are sent to on-duty officers' devices. Similarly, if a citizen adds new evidence or there's an important update on a case, the system notifies the relevant officers via the dashboard and push notifications. This ensures urgent matters get immediate attention and improves response times. Officers no longer rely on scanning a paper log or word-of-mouth updates—the assistant actively alerts them to what's important, the moment it happens."
    },
    {
      icon: Users,
      title: "Integrated Workflow & Assignment",
      description: "Each case file contains a workflow timeline where officers can log investigation notes, change the case phase (like \"Under Investigation\" → \"Charge Sheet Filed\" → \"Closed\"), and set reminders for follow-ups or court dates. Supervisors can assign a case to an investigating officer or a team with a click, and the assignee will be notified. All actions are time-stamped. It replaces stacks of physical registers with a collaborative digital trail. This makes teamwork easier and ensures everyone — from the SHO to the investigating constable — can see the full history of actions on a case, enhancing coordination and accountability."
    },
    {
      icon: FileEdit,
      title: "Automatic Report & Document Generation",
      description: "The AI assistant dramatically cuts down paperwork for officers by auto-drafting reports and forms. Based on the data from a complaint, it can generate an FIR report, charge sheet, or incident summary in the official format, ready for review. It also fills out standard templates (like letters to magistrates, requisitions to forensic labs, etc.) by plugging in the case details. Officers can then fine-tune these drafts rather than writing from scratch. This saves officers hours of clerical work—the AI produces well-structured, error-free documents in seconds, allowing officers to focus on actual police work instead of tedious typing. It also standardizes documents, reducing errors in formatting or missing information."
    },
    {
      icon: Lightbulb,
      title: "AI Guidance during Investigations",
      description: "The assistant serves as a virtual legal aide. It gives smart prompts and reminders in the background as officers input case details or statements. For example, if an officer is recording a burglary, the AI might suggest: \"Ask if there were any witnesses or CCTV cameras.\" For a complex case, it can recommend applicable IPC sections or legal provisions based on the description (e.g., hinting that a house break-in at night might fall under Section 457 IPC). It also suggests evidence to collect (\"This sounds like cybercrime – don't forget to secure digital logs\"). This is especially helpful for new officers or challenging cases, ensuring no key step or detail is overlooked. By embedding expert knowledge of law and procedure, it standardizes the quality of investigations and reduces the chance of mistakes."
    },
    {
      icon: BookOpen,
      title: "Legal Reference & Case Law Recommendations",
      description: "Built into the system is a comprehensive legal reference. An officer can query the assistant for specifics (e.g., \"What's the punishment under Section 498A?\") and the AI will provide the answer from the statutes. It can also pull up recent court judgments or relevant case law precedents. When an officer is preparing a charge sheet, the AI can suggest citing certain landmark judgments or past cases, based on the context of the crime. Officers get on-the-spot legal research support without needing to flip through law books or call a senior for advice. This helps in framing charges correctly and can strengthen the case by backing it up with appropriate legal references, improving its credibility in court."
    },
    {
      icon: Globe,
      title: "Multilingual Translation in the Field",
      description: "The platform's multilingual prowess isn't just for citizens; it helps officers in the field too. If an officer needs to communicate with someone who speaks a language they don't know (say a tourist speaking Mandarin, or a complainant speaking only a local dialect), the assistant can act as an interpreter. The officer can record or speak a question in English, and have it translated and spoken out in the citizen's language – then translate the citizen's response back to English. This breaks language barriers during police-public interactions. Police in tourist areas or diverse communities can serve the public more effectively, as communication hurdles are minimized, leading to faster responses and better community trust."
    },
    {
      icon: Mic2,
      title: "Voice-Powered Queries & Commands",
      description: "Officers can operate the system completely hands-free with voice commands, which is especially useful while on patrol or driving. For example, an officer can just speak, \"Show me all open theft cases this week,\" and the assistant will read out a summary or display the list on their device. They can also dictate notes to attach to a case file by voice. This improves efficiency and safety—officers can retrieve information or update cases without stopping to type or write, much like using a smart assistant. It's like having a combined police radio and database assistant that responds instantly to voice requests."
    },
    {
      icon: TrendingUp,
      title: "Analytics & Crime Insights",
      description: "All the case data captured can be aggregated (locally) to provide insightful analytics. The system can show charts and graphs on crime trends: for instance, a bar graph of different crime types reported in the last month, a line chart of cases over time, or a heat map of crime occurrences in the area. The AI can highlight anomalies or trends (e.g., \"This month has seen a 20% rise in cybercrime reports compared to last month\"). It provides actionable insights for strategic planning. Station chiefs and senior officers can make data-driven decisions — such as deploying more patrols in a high-crime area identified by the heat map — and easily compile reports for higher authorities or community meetings using these statistics."
    },
    {
      icon: GraduationCap,
      title: "Officer Training Mode",
      description: "There's a training sandbox built in for practice and onboarding. New recruits or any officer can engage in a simulated scenario where the assistant plays the role of a citizen reporting an incident. The trainee goes through the steps of filing a case or responding, and the AI gives feedback or tips (for example, alerting if they missed a crucial question). This mode can also quiz officers on procedures or laws in a conversational way. This feature helps in capacity building — new staff learn to use the system and reinforce correct procedures in an interactive, low-stakes environment. It ensures that by the time they handle real cases with the assistant, they are confident and adept, maximizing the benefits of the system."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Empowering Officers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Advanced tools that enhance efficiency, reduce paperwork, and support better policing
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border border-slate-200 hover:border-cyan-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-slate-700 to-slate-800 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-cyan-400" />
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

export default PoliceFeatures;
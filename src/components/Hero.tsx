import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  const scrollToDemo = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactDemo = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background:'linear-gradient(135deg, #0B2A4A, #0077B6)'}}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23F4E1B5\' stroke-width=\'0.5\' opacity=\'0.5\'%3E%3Cpath d=\'M0 40 H80 M40 0 V80\'/%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[var(--goa-sea)] rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-[var(--goa-emerald)] rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-[var(--goa-sea)] rounded-full opacity-60 animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-[var(--goa-emerald)] rounded-full animate-bounce delay-300"></div>
      </div>

      {/* Goan Waves */}
      <div className="absolute bottom-0 left-0 right-0 h-40" aria-hidden>
        <svg viewBox="0 0 1440 160" className="w-full h-full" preserveAspectRatio="none">
          <path fill="#00B4D8" fillOpacity="0.3" d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,96C672,75,768,53,864,69.3C960,85,1056,139,1152,144C1248,149,1344,107,1392,85.3L1440,64L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z" />
          <path fill="#2A9D8F" fillOpacity="0.25" d="M0,96L60,90.7C120,85,240,75,360,80C480,85,600,107,720,117.3C840,128,960,128,1080,112C1200,96,1320,64,1380,48L1440,32L1440,160L1380,160C1320,160,1200,160,1080,160C960,160,840,160,720,160C600,160,480,160,360,160C240,160,120,160,60,160L0,160Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">Goa Police</span>
            <span className="block bg-gradient-to-r from-[var(--goa-saffron)] via-white to-[#138808] bg-clip-text text-transparent">
              Nagar Rakshak 2.0
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 font-light">
            Bridging gaps in communication, automating routine work, and empowering both citizens and officers.
          </p>

          {/* Intro Blurb */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              A futuristic AI assistant for police stations that streamlines operations through a multilingual conversational interface. 
              More than a chatbot, it handles end-to-end workflows from complaint filing to case management, automating paperwork 
              and providing intelligent legal guidance.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleContactDemo}
              className="group goa-ai-gradient hover:brightness-110 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25 flex items-center space-x-2"
            >
              <span>Request a Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button
              onClick={scrollToDemo}
              className="group bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Learn More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;

import React from 'react';
import { Shield, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/public/image.png" alt="Nagar Rakshak 2.0 Logo" className="h-8 w-auto" />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Nagar Rakshak 2.0
                </h3>
                <p className="text-sm text-gray-400">AI-Powered Police Assistant</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Revolutionizing police services through advanced AI technology, making law enforcement more efficient, 
              accessible, and citizen-friendly.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-cyan-400" />
              </a>
              <a 
                href="#" 
                className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-cyan-400" />
              </a>
              <a 
                href="#" 
                className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-cyan-400" />
              </a>
              <a 
                href="#" 
                className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#overview" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Overview
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#ai-capabilities" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  AI Technology
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Shield className="w-5 h-5 text-cyan-400" />
            <p className="text-gray-400 text-sm">
              Developed for the Government of India | Ministry of Home Affairs
            </p>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Nagar Rakshak 2.0. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
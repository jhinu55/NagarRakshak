import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Star,
  MessageSquare,
  Send,
  RefreshCw
} from 'lucide-react';

interface ComplaintTrackingProps {
  language: 'en' | 'hi' | 'kok';
  onBack: () => void;
  accessibilityMode: boolean;
}

interface ComplaintStatus {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

interface ComplaintDetails {
  referenceNumber: string;
  type: string;
  description: string;
  location: string;
  submittedDate: string;
  status: string;
  assignedOfficer: string;
  priority: 'low' | 'medium' | 'high';
  statusHistory: ComplaintStatus[];
}

const ComplaintTracking: React.FC<ComplaintTrackingProps> = ({ 
  language, 
  onBack 
}) => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const colors = {
    deepIndigo: '#2E3A59',
    teal: '#008080',
    amber: '#FFC107',
    whiteOpacity: 'rgba(255, 255, 255, 0.1)'
  };

  // Multi-language content
  const content = {
    en: {
      title: "Track Your Complaint",
      subtitle: "Enter your reference number to check status",
      placeholder: "Enter complaint reference number",
      search: "Track Complaint",
      notFound: "Complaint not found. Please check your reference number.",
      loading: "Searching for your complaint...",
      details: {
        reference: "Reference Number",
        type: "Complaint Type",
        description: "Description",
        location: "Location",
        submitted: "Submitted On",
        status: "Current Status",
        officer: "Assigned Officer",
        priority: "Priority"
      },
      statusSteps: {
        submitted: "Complaint Submitted",
        acknowledged: "Acknowledged by Police",
        investigation: "Under Investigation",
        resolved: "Resolved"
      },
      feedback: {
        title: "Rate Your Experience",
        subtitle: "Help us improve our services",
        placeholder: "Share your feedback (optional)",
        submit: "Submit Feedback",
        thanks: "Thank you for your feedback!"
      },
      priority: {
        low: "Low",
        medium: "Medium", 
        high: "High"
      }
    },
    hi: {
      title: "अपनी शिकायत ट्रैक करें",
      subtitle: "स्थिति जांचने के लिए अपना संदर्भ नंबर दर्ज करें",
      placeholder: "शिकायत संदर्भ नंबर दर्ज करें",
      search: "शिकायत ट्रैक करें",
      notFound: "शिकायत नहीं मिली। कृपया अपना संदर्भ नंबर जांचें।",
      loading: "आपकी शिकायत खोजी जा रही है...",
      details: {
        reference: "संदर्भ नंबर",
        type: "शिकायत प्रकार",
        description: "विवरण",
        location: "स्थान",
        submitted: "जमा किया गया",
        status: "वर्तमान स्थिति",
        officer: "नियुक्त अधिकारी",
        priority: "प्राथमिकता"
      },
      statusSteps: {
        submitted: "शिकायत जमा की गई",
        acknowledged: "पुलिस द्वारा स्वीकार की गई",
        investigation: "जांच के तहत",
        resolved: "हल किया गया"
      },
      feedback: {
        title: "अपने अनुभव को रेट करें",
        subtitle: "हमारी सेवाओं को बेहतर बनाने में मदद करें",
        placeholder: "अपनी प्रतिक्रिया साझा करें (वैकल्पिक)",
        submit: "प्रतिक्रिया जमा करें",
        thanks: "आपकी प्रतिक्रिया के लिए धन्यवाद!"
      },
      priority: {
        low: "कम",
        medium: "मध्यम",
        high: "उच्च"
      }
    },
    kok: {
      title: "तुमची तक्रार ट्रॅक करात",
      subtitle: "स्थिती तपासपाक तुमचो संदर्भ नंबर घालात",
      placeholder: "तक्रार संदर्भ नंबर घालात",
      search: "तक्रार ट्रॅक करात",
      notFound: "तक्रार मेळली ना। कृपया तुमचो संदर्भ नंबर तपासात।",
      loading: "तुमची तक्रार सोदतात...",
      details: {
        reference: "संदर्भ नंबर",
        type: "तक्रार प्रकार",
        description: "वर्णन",
        location: "स्थळ",
        submitted: "सादर केला",
        status: "सध्याची स्थिती",
        officer: "नेमलेला अधिकारी",
        priority: "प्राधान्य"
      },
      statusSteps: {
        submitted: "तक्रार सादर केली",
        acknowledged: "पोलिसांनी मान्य केली",
        investigation: "तपासणी सुरू",
        resolved: "सोडवली"
      },
      feedback: {
        title: "तुमचो अनुभव रेट करात",
        subtitle: "आमच्या सेवा बरे करपाक मदत करात",
        placeholder: "तुमची प्रतिक्रिया सांगात (पर्यायी)",
        submit: "प्रतिक्रिया सादर करात",
        thanks: "तुमच्या प्रतिक्रियेक धन्यवाद!"
      },
      priority: {
        low: "कमी",
        medium: "मध्यम",
        high: "उंच"
      }
    }
  };

  const currentContent = content[language];

  // Mock data for demonstration
  const mockComplaint: ComplaintDetails = {
    referenceNumber: 'NR12345678',
    type: 'Theft',
    description: 'Mobile phone stolen from public transport',
    location: 'Panaji Bus Stand, Goa',
    submittedDate: '2024-03-15T10:30:00',
    status: 'Under Investigation',
    assignedOfficer: 'Inspector Rajesh Singh',
    priority: 'medium',
    statusHistory: [
      {
        id: '1',
        title: currentContent.statusSteps.submitted,
        description: 'Your complaint has been successfully submitted to our system.',
        timestamp: '2024-03-15T10:30:00',
        completed: true,
        current: false
      },
      {
        id: '2',
        title: currentContent.statusSteps.acknowledged,
        description: 'Police station has acknowledged your complaint and assigned an officer.',
        timestamp: '2024-03-15T14:20:00',
        completed: true,
        current: false
      },
      {
        id: '3',
        title: currentContent.statusSteps.investigation,
        description: 'Investigation is in progress. Evidence is being collected.',
        timestamp: '2024-03-16T09:15:00',
        completed: false,
        current: true
      },
      {
        id: '4',
        title: currentContent.statusSteps.resolved,
        description: 'Case will be closed once investigation is complete.',
        timestamp: '',
        completed: false,
        current: false
      }
    ]
  };

  const searchComplaint = async () => {
    if (!referenceNumber.trim()) {
      setError('Please enter a reference number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (referenceNumber === 'NR12345678') {
        setComplaint(mockComplaint);
      } else {
        setError(currentContent.notFound);
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowFeedback(false);
      setRating(0);
      setFeedback('');
      alert(currentContent.feedback.thanks);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const renderTimeline = () => (
    <div className="space-y-6">
      {complaint?.statusHistory.map((status, index) => (
        <div key={status.id} className="flex items-start space-x-4">
          {/* Timeline dot */}
          <div className={`relative flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
            status.completed 
              ? 'bg-green-500 border-green-400'
              : status.current
              ? 'bg-amber-500 border-amber-400 animate-pulse'
              : 'bg-white/10 border-white/30'
          }`}>
            {status.completed ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : status.current ? (
              <Clock className="w-4 h-4 text-white" />
            ) : (
              <div className="w-2 h-2 bg-white/60 rounded-full" />
            )}
          </div>

          {/* Timeline line */}
          {index < complaint.statusHistory.length - 1 && (
            <div className={`absolute left-4 mt-8 w-0.5 h-16 ${
              status.completed ? 'bg-green-400' : 'bg-white/20'
            }`} />
          )}

          {/* Content */}
          <div className="flex-1 pb-8">
            <div className={`p-4 rounded-xl border backdrop-blur-md ${
              status.current 
                ? 'bg-amber-500/10 border-amber-400/30'
                : status.completed
                ? 'bg-green-500/10 border-green-400/30'
                : 'bg-white/5 border-white/20'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                status.current ? 'text-amber-300' : status.completed ? 'text-green-300' : 'text-white'
              }`}>
                {status.title}
              </h4>
              <p className="text-white/80 text-sm mb-2">{status.description}</p>
              {status.timestamp && (
                <p className="text-white/60 text-xs flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(status.timestamp)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-90"
        style={{
          background: `linear-gradient(135deg, ${colors.deepIndigo} 0%, ${colors.teal} 100%)`
        }}
      />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <h1 className="text-xl font-bold text-white">{currentContent.title}</h1>
          
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          
          {!complaint ? (
            /* Search Section */
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">{currentContent.title}</h2>
                <p className="text-white/70 mb-8">{currentContent.subtitle}</p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                    placeholder={currentContent.placeholder}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md text-center text-lg tracking-wider"
                    maxLength={12}
                  />
                  
                  {error && (
                    <div className="flex items-center justify-center space-x-2 p-3 bg-red-500/20 border border-red-400/30 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm">{error}</span>
                    </div>
                  )}
                  
                  <button
                    onClick={searchComplaint}
                    disabled={loading || !referenceNumber.trim()}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-xl transition-all duration-300 text-white font-medium"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{currentContent.loading}</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>{currentContent.search}</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="mt-8 p-4 bg-white/5 rounded-xl">
                  <p className="text-white/60 text-sm">
                    💡 Reference numbers are typically in format: NR12345678
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Complaint Details */
            <div className="space-y-6">
              {/* Complaint Info Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Complaint Details</h2>
                  <button
                    onClick={() => setComplaint(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-colors"
                  >
                    Search Another
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/60 text-sm">{currentContent.details.reference}</label>
                      <p className="text-white font-mono text-lg">{complaint.referenceNumber}</p>
                    </div>
                    
                    <div>
                      <label className="text-white/60 text-sm">{currentContent.details.type}</label>
                      <p className="text-white">{complaint.type}</p>
                    </div>
                    
                    <div>
                      <label className="text-white/60 text-sm">{currentContent.details.location}</label>
                      <p className="text-white flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {complaint.location}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-white/60 text-sm">{currentContent.details.priority}</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                        {currentContent.priority[complaint.priority]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/60 text-sm">{currentContent.details.submitted}</label>
                      <p className="text-white flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(complaint.submittedDate)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-white/60 text-sm">{currentContent.details.officer}</label>
                      <p className="text-white flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {complaint.assignedOfficer}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-white/60 text-sm">{currentContent.details.status}</label>
                      <p className="text-amber-300 font-medium">{complaint.status}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="text-white/60 text-sm">{currentContent.details.description}</label>
                  <div className="mt-2 p-4 bg-white/5 rounded-xl">
                    <p className="text-white">{complaint.description}</p>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Progress Timeline</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/60 text-sm">Completed</span>
                    <div className="w-2 h-2 bg-amber-400 rounded-full ml-4"></div>
                    <span className="text-white/60 text-sm">Current</span>
                    <div className="w-2 h-2 bg-white/30 rounded-full ml-4"></div>
                    <span className="text-white/60 text-sm">Pending</span>
                  </div>
                </div>
                
                <div className="relative">
                  {renderTimeline()}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">{currentContent.feedback.title}</h3>
                  <button
                    onClick={() => setShowFeedback(!showFeedback)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Give Feedback</span>
                  </button>
                </div>
                
                {showFeedback && (
                  <div className="space-y-4">
                    <p className="text-white/70">{currentContent.feedback.subtitle}</p>
                    
                    {/* Star Rating */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`p-1 transition-colors ${
                              star <= rating ? 'text-amber-400' : 'text-white/30'
                            }`}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Feedback Text */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Comments</label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={currentContent.feedback.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md resize-none"
                      />
                    </div>
                    
                    <button
                      onClick={handleFeedbackSubmit}
                      disabled={rating === 0}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-xl transition-all duration-300 text-white font-medium"
                    >
                      <Send className="w-4 h-4" />
                      <span>{currentContent.feedback.submit}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ComplaintTracking;
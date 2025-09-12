import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Camera, 
  Upload, 
  FileText, 
  Send,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const CitizenPortal: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [complaintData, setComplaintData] = useState({
    type: '',
    description: '',
    location: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    evidence: [] as File[]
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [firNumber, setFirNumber] = useState('');

  const complaintTypes = [
    'Theft', 'Assault', 'Domestic Violence', 'Cybercrime', 
    'Traffic Violation', 'Fraud', 'Missing Person', 'Noise Complaint', 'Other'
  ];

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // Simulate voice recognition
    if (!isRecording) {
      setTimeout(() => {
        setComplaintData(prev => ({
          ...prev,
          description: prev.description + " [Voice input: Someone stole my bicycle from the parking area near the market...]"
        }));
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setComplaintData(prev => ({
      ...prev,
      evidence: [...prev.evidence, ...files]
    }));
  };

  const handleSubmit = () => {
    // Generate FIR number
    const firNum = `FIR${Date.now().toString().slice(-6)}`;
    setFirNumber(firNum);
    setIsSubmitted(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Select Complaint Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {complaintTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setComplaintData(prev => ({ ...prev, type }))}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    complaintData.type === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Describe the Incident</h3>
            
            {/* Voice Input */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Voice Input (Hindi/English/Konkani)</span>
                <button
                  onClick={handleVoiceToggle}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                </button>
              </div>
              {isRecording && (
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Recording... Speak clearly in your preferred language</span>
                </div>
              )}
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or type your complaint
              </label>
              <textarea
                value={complaintData.description}
                onChange={(e) => setComplaintData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what happened, when, where, and any other relevant details..."
              />
            </div>

            {/* Location and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={complaintData.location}
                  onChange={(e) => setComplaintData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Where did this happen?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={complaintData.date}
                  onChange={(e) => setComplaintData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Upload Evidence & Contact Info</h3>
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-300">
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="evidence-upload"
              />
              <label htmlFor="evidence-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload photos, videos, or documents</p>
                <p className="text-sm text-gray-500">Click to browse or drag and drop files</p>
              </label>
            </div>

            {/* Uploaded Files */}
            {complaintData.evidence.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Uploaded Evidence:</h4>
                {complaintData.evidence.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={complaintData.name}
                  onChange={(e) => setComplaintData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={complaintData.phone}
                  onChange={(e) => setComplaintData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your phone number"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={complaintData.email}
                onChange={(e) => setComplaintData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your email address"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Review Your Complaint</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Complaint Type:</h4>
                <p className="text-gray-900">{complaintData.type}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Description:</h4>
                <p className="text-gray-900">{complaintData.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Location:</h4>
                  <p className="text-gray-900">{complaintData.location}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Date & Time:</h4>
                  <p className="text-gray-900">{complaintData.date}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Contact:</h4>
                <p className="text-gray-900">{complaintData.name} - {complaintData.phone}</p>
              </div>
              {complaintData.evidence.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700">Evidence:</h4>
                  <p className="text-gray-900">{complaintData.evidence.length} file(s) attached</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complaint Submitted Successfully!</h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Your FIR Number</h3>
              <p className="text-2xl font-bold text-blue-600">{firNumber}</p>
              <p className="text-sm text-blue-700 mt-2">Please save this number for future reference</p>
            </div>
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Your complaint is being processed</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700">You will receive updates via SMS and email</span>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">A copy of your FIR will be generated shortly</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                setComplaintData({
                  type: '', description: '', location: '', date: '', time: '',
                  name: '', phone: '', email: '', evidence: []
                });
              }}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              File Another Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">File a Complaint</h1>
          <p className="text-gray-600">Use voice or text in Hindi, English, or Konkani</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
              >
                <span>Next</span>
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2"
              >
                <span>Submit Complaint</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenPortal;
import React, { useState, useCallback, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  Check, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText,
  Camera,
  Mic,
  Eye,
  Trash2
} from 'lucide-react';

interface ComplaintFilingWizardProps {
  language: 'en' | 'hi' | 'kok';
  onBack: () => void;
  accessibilityMode: boolean;
}

interface FormData {
  complainantInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  incidentDetails: {
    type: string;
    subType: string;
    description: string;
    location: string;
    dateTime: string;
    urgency: 'low' | 'medium' | 'high';
  };
  evidence: File[];
}

const ComplaintFilingWizard: React.FC<ComplaintFilingWizardProps> = ({ 
  language, 
  onBack, 
  accessibilityMode 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    complainantInfo: {
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    incidentDetails: {
      type: '',
      subType: '',
      description: '',
      location: '',
      dateTime: '',
      urgency: 'medium'
    },
    evidence: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = {
    deepIndigo: '#2E3A59',
    teal: '#008080',
    amber: '#FFC107',
    whiteOpacity: 'rgba(255, 255, 255, 0.1)'
  };

  // Multi-language content
  const content = {
    en: {
      title: "File New Complaint",
      steps: ["Personal Info", "Incident Details", "Evidence Upload", "Review & Submit"],
      personalInfo: {
        title: "Personal Information",
        subtitle: "Please provide your contact details",
        name: "Full Name",
        phone: "Phone Number",
        email: "Email Address",
        address: "Address"
      },
      incidentDetails: {
        title: "Incident Details",
        subtitle: "Describe what happened",
        type: "Complaint Type",
        subType: "Sub Category",
        description: "Detailed Description",
        location: "Incident Location",
        dateTime: "Date & Time",
        urgency: "Priority Level"
      },
      evidence: {
        title: "Upload Evidence",
        subtitle: "Add photos, videos, or documents",
        dragText: "Drag and drop files here, or click to browse",
        supportedFormats: "Supported: JPG, PNG, PDF, MP4 (Max 10MB each)",
        noFiles: "No files uploaded yet"
      },
      review: {
        title: "Review & Submit",
        subtitle: "Please verify all information before submitting"
      },
      buttons: {
        back: "Back",
        next: "Next",
        submit: "Submit Complaint",
        cancel: "Cancel"
      },
      validation: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email",
        invalidPhone: "Please enter a valid phone number"
      }
    },
    hi: {
      title: "नई शिकायत दर्ज करें",
      steps: ["व्यक्तिगत जानकारी", "घटना विवरण", "साक्ष्य अपलोड", "समीक्षा और जमा"],
      personalInfo: {
        title: "व्यक्तिगत जानकारी",
        subtitle: "कृपया अपनी संपर्क जानकारी प्रदान करें",
        name: "पूरा नाम",
        phone: "फोन नंबर",
        email: "ईमेल पता",
        address: "पता"
      },
      incidentDetails: {
        title: "घटना विवरण",
        subtitle: "बताएं कि क्या हुआ",
        type: "शिकायत प्रकार",
        subType: "उप श्रेणी",
        description: "विस्तृत विवरण",
        location: "घटना स्थल",
        dateTime: "दिनांक और समय",
        urgency: "प्राथमिकता स्तर"
      },
      evidence: {
        title: "साक्ष्य अपलोड करें",
        subtitle: "फोटो, वीडियो या दस्तावेज जोड़ें",
        dragText: "फाइलों को यहां खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें",
        supportedFormats: "समर्थित: JPG, PNG, PDF, MP4 (अधिकतम 10MB प्रत्येक)",
        noFiles: "अभी तक कोई फाइल अपलोड नहीं की गई"
      },
      review: {
        title: "समीक्षा और जमा",
        subtitle: "जमा करने से पहले सभी जानकारी सत्यापित करें"
      },
      buttons: {
        back: "वापस",
        next: "अगला",
        submit: "शिकायत जमा करें",
        cancel: "रद्द करें"
      },
      validation: {
        required: "यह फील्ड आवश्यक है",
        invalidEmail: "कृपया एक वैध ईमेल दर्ज करें",
        invalidPhone: "कृपया एक वैध फोन नंबर दर्ज करें"
      }
    },
    kok: {
      title: "नवी तक्रार नोंदोवची",
      steps: ["व्यक्तिगत माहिती", "घटना तपशील", "पुरावो अपलोड", "परीक्षण आनी सादर"],
      personalInfo: {
        title: "व्यक्तिगत माहिती",
        subtitle: "कृपया तुमची संपर्क माहिती दिया",
        name: "पूर्ण नाव",
        phone: "फोन नंबर",
        email: "ईमेल पत्ता",
        address: "पत्ता"
      },
      incidentDetails: {
        title: "घटना तपशील",
        subtitle: "काय घडलां ते सांगात",
        type: "तक्रार प्रकार",
        subType: "उप वर्ग",
        description: "तपशीलवार वर्णन",
        location: "घटना स्थळ",
        dateTime: "दिनांक आनी वेळ",
        urgency: "प्राधान्य पातळी"
      },
      evidence: {
        title: "पुरावो अपलोड करात",
        subtitle: "फोटो, व्हिडिओ वा कागदपत्र घालात",
        dragText: "फायली हांगा ओढून घालात, वा ब्राउझ करपाक क्लिक करात",
        supportedFormats: "समर्थित: JPG, PNG, PDF, MP4 (कमाल 10MB दरेक)",
        noFiles: "अजून कोणतीच फायल अपलोड केली ना"
      },
      review: {
        title: "परीक्षण आनी सादर",
        subtitle: "सादर करपाक आदीं सगळी माहिती तपासात"
      },
      buttons: {
        back: "परत",
        next: "फुडलो",
        submit: "तक्रार सादर करात",
        cancel: "रद्द"
      },
      validation: {
        required: "हे फील्ड गरजेचे",
        invalidEmail: "कृपया वैध ईमेल घालात",
        invalidPhone: "कृपया वैध फोन नंबर घालात"
      }
    }
  };

  const currentContent = content[language];

  const complaintTypes = {
    en: [
      'Theft', 'Burglary', 'Fraud', 'Harassment', 'Traffic Violation', 
      'Domestic Violence', 'Cyber Crime', 'Property Dispute', 'Noise Complaint', 'Other'
    ],
    hi: [
      'चोरी', 'सेंधमारी', 'धोखाधड़ी', 'उत्पीड़न', 'यातायात उल्लंघन',
      'घरेलू हिंसा', 'साइबर अपराध', 'संपत्ति विवाद', 'शोर शिकायत', 'अन्य'
    ],
    kok: [
      'चोरी', 'घरफोडी', 'फसवणूक', 'छळवणूक', 'वातायात उल्लंघन',
      'घरगुती हिंसा', 'सायबर गुन्हो', 'मालमत्ता वाद', 'आवाज तक्रार', 'इतर'
    ]
  };

  const urgencyLevels = {
    en: { low: 'Low', medium: 'Medium', high: 'High' },
    hi: { low: 'कम', medium: 'मध्यम', high: 'उच्च' },
    kok: { low: 'कमी', medium: 'मध्यम', high: 'उंच' }
  };

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.complainantInfo.name.trim()) {
        newErrors.name = currentContent.validation.required;
      }
      if (!formData.complainantInfo.phone.trim()) {
        newErrors.phone = currentContent.validation.required;
      } else if (!/^[6-9]\d{9}$/.test(formData.complainantInfo.phone)) {
        newErrors.phone = currentContent.validation.invalidPhone;
      }
      if (formData.complainantInfo.email && !/\S+@\S+\.\S+/.test(formData.complainantInfo.email)) {
        newErrors.email = currentContent.validation.invalidEmail;
      }
    } else if (step === 2) {
      if (!formData.incidentDetails.type) {
        newErrors.type = currentContent.validation.required;
      }
      if (!formData.incidentDetails.description.trim()) {
        newErrors.description = currentContent.validation.required;
      }
      if (!formData.incidentDetails.location.trim()) {
        newErrors.location = currentContent.validation.required;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File upload handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = /\.(jpg|jpeg|png|pdf|mp4|mov)$/i.test(file.name);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      evidence: [...prev.evidence, ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }));
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate reference number
      const refNumber = `NR${Date.now().toString().slice(-8)}`;
      
      // Show success and redirect
      alert(`Complaint submitted successfully! Reference Number: ${refNumber}`);
      onBack();
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step content renderers
  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{currentContent.personalInfo.title}</h3>
        <p className="text-white/70">{currentContent.personalInfo.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <User className="w-4 h-4 inline mr-2" />
            {currentContent.personalInfo.name}
          </label>
          <input
            type="text"
            value={formData.complainantInfo.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              complainantInfo: { ...prev.complainantInfo, name: e.target.value }
            }))}
            className={`w-full px-4 py-3 bg-white/10 border ${errors.name ? 'border-red-400' : 'border-white/20'} rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            {currentContent.personalInfo.phone}
          </label>
          <input
            type="tel"
            value={formData.complainantInfo.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              complainantInfo: { ...prev.complainantInfo, phone: e.target.value }
            }))}
            className={`w-full px-4 py-3 bg-white/10 border ${errors.phone ? 'border-red-400' : 'border-white/20'} rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md`}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            {currentContent.personalInfo.email}
          </label>
          <input
            type="email"
            value={formData.complainantInfo.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              complainantInfo: { ...prev.complainantInfo, email: e.target.value }
            }))}
            className={`w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md`}
            placeholder="Enter email address (optional)"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            {currentContent.personalInfo.address}
          </label>
          <textarea
            value={formData.complainantInfo.address}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              complainantInfo: { ...prev.complainantInfo, address: e.target.value }
            }))}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md resize-none"
            placeholder="Enter your address"
          />
        </div>
      </div>
    </div>
  );

  const renderIncidentDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{currentContent.incidentDetails.title}</h3>
        <p className="text-white/70">{currentContent.incidentDetails.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            {currentContent.incidentDetails.type}
          </label>
          <select
            value={formData.incidentDetails.type}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              incidentDetails: { ...prev.incidentDetails, type: e.target.value }
            }))}
            className={`w-full px-4 py-3 bg-white/10 border ${errors.type ? 'border-red-400' : 'border-white/20'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md`}
          >
            <option value="" className="bg-gray-800">Select complaint type</option>
            {complaintTypes[language].map((type, index) => (
              <option key={index} value={type} className="bg-gray-800">{type}</option>
            ))}
          </select>
          {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            {currentContent.incidentDetails.dateTime}
          </label>
          <input
            type="datetime-local"
            value={formData.incidentDetails.dateTime}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              incidentDetails: { ...prev.incidentDetails, dateTime: e.target.value }
            }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            {currentContent.incidentDetails.location}
          </label>
          <input
            type="text"
            value={formData.incidentDetails.location}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              incidentDetails: { ...prev.incidentDetails, location: e.target.value }
            }))}
            className={`w-full px-4 py-3 bg-white/10 border ${errors.location ? 'border-red-400' : 'border-white/20'} rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md`}
            placeholder="Enter incident location"
          />
          {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            {currentContent.incidentDetails.urgency}
          </label>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(urgencyLevels[language]).map(([level, label]) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  incidentDetails: { ...prev.incidentDetails, urgency: level as 'low' | 'medium' | 'high' }
                }))}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  formData.incidentDetails.urgency === level
                    ? 'bg-amber-500 border-amber-400 text-white'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            {currentContent.incidentDetails.description}
          </label>
          <textarea
            value={formData.incidentDetails.description}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              incidentDetails: { ...prev.incidentDetails, description: e.target.value }
            }))}
            rows={4}
            className={`w-full px-4 py-3 bg-white/10 border ${errors.description ? 'border-red-400' : 'border-white/20'} rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md resize-none`}
            placeholder="Describe the incident in detail..."
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>
    </div>
  );

  const renderEvidenceUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{currentContent.evidence.title}</h3>
        <p className="text-white/70">{currentContent.evidence.subtitle}</p>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-amber-400 bg-amber-400/10' 
            : 'border-white/30 hover:border-white/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.mp4,.mov"
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-white text-lg mb-2">{currentContent.evidence.dragText}</p>
            <p className="text-white/60 text-sm">{currentContent.evidence.supportedFormats}</p>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {formData.evidence.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Uploaded Files ({formData.evidence.length})</h4>
          <div className="grid grid-cols-1 gap-3">
            {formData.evidence.map((file, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-md">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <Camera className="w-5 h-5 text-white" />
                  ) : file.type.startsWith('video/') ? (
                    <Eye className="w-5 h-5 text-white" />
                  ) : (
                    <FileText className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{file.name}</p>
                  <p className="text-white/60 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white/60">{currentContent.evidence.noFiles}</p>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{currentContent.review.title}</h3>
        <p className="text-white/70">{currentContent.review.subtitle}</p>
      </div>

      <div className="space-y-6">
        {/* Personal Info Review */}
        <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md">
          <h4 className="text-white font-semibold mb-4">{currentContent.personalInfo.title}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/60">{currentContent.personalInfo.name}:</span>
              <span className="text-white ml-2">{formData.complainantInfo.name}</span>
            </div>
            <div>
              <span className="text-white/60">{currentContent.personalInfo.phone}:</span>
              <span className="text-white ml-2">{formData.complainantInfo.phone}</span>
            </div>
            {formData.complainantInfo.email && (
              <div>
                <span className="text-white/60">{currentContent.personalInfo.email}:</span>
                <span className="text-white ml-2">{formData.complainantInfo.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Incident Details Review */}
        <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md">
          <h4 className="text-white font-semibold mb-4">{currentContent.incidentDetails.title}</h4>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-white/60">{currentContent.incidentDetails.type}:</span>
              <span className="text-white ml-2">{formData.incidentDetails.type}</span>
            </div>
            <div>
              <span className="text-white/60">{currentContent.incidentDetails.location}:</span>
              <span className="text-white ml-2">{formData.incidentDetails.location}</span>
            </div>
            <div>
              <span className="text-white/60">{currentContent.incidentDetails.urgency}:</span>
              <span className="text-white ml-2">{urgencyLevels[language][formData.incidentDetails.urgency]}</span>
            </div>
            <div>
              <span className="text-white/60">{currentContent.incidentDetails.description}:</span>
              <p className="text-white mt-1">{formData.incidentDetails.description}</p>
            </div>
          </div>
        </div>

        {/* Evidence Review */}
        {formData.evidence.length > 0 && (
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md">
            <h4 className="text-white font-semibold mb-4">{currentContent.evidence.title}</h4>
            <p className="text-white/60 text-sm">{formData.evidence.length} files attached</p>
          </div>
        )}
      </div>
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
            <span>{currentContent.buttons.back}</span>
          </button>
          
          <h1 className="text-xl font-bold text-white">{currentContent.title}</h1>
          
          <button
            onClick={onBack}
            className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 px-6 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            {currentContent.steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index + 1 < currentStep
                    ? 'bg-green-500 border-green-400 text-white'
                    : index + 1 === currentStep
                    ? 'bg-amber-500 border-amber-400 text-white'
                    : 'bg-white/10 border-white/30 text-white/60'
                }`}>
                  {index + 1 < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < currentContent.steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                    index + 1 < currentStep ? 'bg-green-400' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-medium text-white">{currentContent.steps[currentStep - 1]}</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
            {currentStep === 1 && renderPersonalInfoStep()}
            {currentStep === 2 && renderIncidentDetailsStep()}
            {currentStep === 3 && renderEvidenceUploadStep()}
            {currentStep === 4 && renderReviewStep()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
              <button
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{currentContent.buttons.back}</span>
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={goToNextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl transition-all duration-300 text-white font-medium"
                >
                  <span>{currentContent.buttons.next}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl transition-all duration-300 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{currentContent.buttons.submit}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintFilingWizard;
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Users, 
  Shield,
  AlertTriangle,
  Download,
  Printer,
  Save,
  FileCheck,
  Award,
  Stamp
} from 'lucide-react';
import { CaseData } from '../lib/firData';

interface CaseVerificationProps {
  caseData: CaseData;
  onBack: () => void;
}

// Define verification fields
interface VerificationField {
  id: string;
  label: string;
  section: string;
  required: boolean;
  verified: boolean;
}

const CaseVerification: React.FC<CaseVerificationProps> = ({ caseData, onBack }) => {
  // Initialize verification state for all fields
  const [verificationFields, setVerificationFields] = useState<VerificationField[]>([
    // Basic Information
    { id: 'fir_number', label: 'FIR Number', section: 'Basic Information', required: true, verified: false },
    { id: 'incident_type', label: 'Incident Type', section: 'Basic Information', required: true, verified: false },
    { id: 'assigned_officer', label: 'Assigned Officer', section: 'Basic Information', required: true, verified: false },
    { id: 'created_at', label: 'Registration Date', section: 'Basic Information', required: true, verified: false },
    
    // Complainant Information
    { id: 'victim_name', label: 'Complainant Name', section: 'Complainant Information', required: true, verified: false },
    { id: 'contact_phone', label: 'Contact Phone', section: 'Complainant Information', required: true, verified: false },
    { id: 'contact_email', label: 'Email Address', section: 'Complainant Information', required: false, verified: false },
    
    // Incident Details
    { id: 'incident_datetime', label: 'Incident Date & Time', section: 'Incident Details', required: true, verified: false },
    { id: 'incident_location', label: 'Incident Location', section: 'Incident Details', required: true, verified: false },
    { id: 'incident_description', label: 'Incident Description', section: 'Incident Details', required: true, verified: false },
    
    // Additional Information
    { id: 'suspect_names', label: 'Suspect Information', section: 'Additional Information', required: false, verified: false },
    { id: 'witness_contacts', label: 'Witness Information', section: 'Additional Information', required: false, verified: false },
    { id: 'property_details', label: 'Property Details', section: 'Additional Information', required: false, verified: false }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  // Calculate verification progress
  const totalFields = verificationFields.length;
  const verifiedFields = verificationFields.filter(field => field.verified).length;
  const verificationProgress = Math.round((verifiedFields / totalFields) * 100);

  // Generate and download PDF document
  const generatePDF = async () => {
    try {
      console.log('📄 Generating PDF document...');
      
      // Create a new window for PDF content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to generate PDF');
        return;
      }

      // Generate HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>FIR Verification Document - ${caseData.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Times New Roman', serif; 
              line-height: 1.6; 
              color: #000; 
              background: white;
              padding: 20mm;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #000; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .header h1 { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 5px; 
            }
            .header h2 { 
              font-size: 18px; 
              margin-bottom: 10px; 
            }
            .verification-status { 
              background: #f0f8ff; 
              border: 2px solid #4169e1; 
              padding: 15px; 
              text-align: center; 
              margin-bottom: 30px; 
              border-radius: 8px;
            }
            .section { 
              margin-bottom: 25px; 
            }
            .section-title { 
              font-size: 16px; 
              font-weight: bold; 
              border-bottom: 1px solid #000; 
              padding-bottom: 5px; 
              margin-bottom: 15px; 
            }
            .field-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
              margin-bottom: 20px; 
            }
            .field { 
              border: 1px solid #ccc; 
              padding: 10px; 
              border-radius: 4px; 
            }
            .field-full { 
              grid-column: 1 / -1; 
            }
            .field-label { 
              font-weight: bold; 
              font-size: 12px; 
              color: #555; 
              margin-bottom: 5px; 
            }
            .field-value { 
              font-size: 14px; 
              color: #000; 
            }
            .verified { 
              background: #e8f5e8; 
              border-color: #4caf50; 
            }
            .verified::after { 
              content: " ✓ VERIFIED"; 
              color: #4caf50; 
              font-weight: bold; 
              float: right; 
              font-size: 10px; 
            }
            .pending::after { 
              content: " ✗ PENDING"; 
              color: #f44336; 
              font-weight: bold; 
              float: right; 
              font-size: 10px; 
            }
            .footer { 
              margin-top: 50px; 
              border-top: 1px solid #000; 
              padding-top: 20px; 
              text-align: center; 
            }
            .signature-area { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 50px; 
              margin-top: 40px; 
            }
            .signature-box { 
              text-align: center; 
              border-top: 1px solid #000; 
              padding-top: 10px; 
            }
            @media print {
              body { padding: 10mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <h1>GOVERNMENT OF INDIA</h1>
            <h2>NAGAR RAKSHAK POLICE DEPARTMENT</h2>
            <h2>FIRST INFORMATION REPORT (FIR)</h2>
            <h3>OFFICIAL VERIFICATION DOCUMENT</h3>
          </div>

          <!-- Verification Status -->
          <div class="verification-status">
            <h3>VERIFICATION STATUS: ${verificationProgress}% COMPLETE</h3>
            <p><strong>${verifiedFields} of ${totalFields} fields verified</strong></p>
            <p>Document generated on: ${new Date().toLocaleDateString('en-IN')}</p>
          </div>

          <!-- Basic Information -->
          <div class="section">
            <div class="section-title">BASIC INFORMATION</div>
            <div class="field-grid">
              <div class="field ${isFieldVerified('fir_number') ? 'verified' : 'pending'}">
                <div class="field-label">FIR NUMBER</div>
                <div class="field-value">${caseData.fullRecord.fir_number}</div>
              </div>
              <div class="field ${isFieldVerified('incident_type') ? 'verified' : 'pending'}">
                <div class="field-label">INCIDENT TYPE</div>
                <div class="field-value">${caseData.fullRecord.incident_type}</div>
              </div>
              <div class="field ${isFieldVerified('assigned_officer') ? 'verified' : 'pending'}">
                <div class="field-label">ASSIGNED OFFICER</div>
                <div class="field-value">${caseData.assignedTo}</div>
              </div>
              <div class="field ${isFieldVerified('created_at') ? 'verified' : 'pending'}">
                <div class="field-label">REGISTRATION DATE</div>
                <div class="field-value">${formatDateTime(caseData.fullRecord.created_at)}</div>
              </div>
            </div>
          </div>

          <!-- Complainant Information -->
          <div class="section">
            <div class="section-title">COMPLAINANT INFORMATION</div>
            <div class="field-grid">
              <div class="field field-full ${isFieldVerified('victim_name') ? 'verified' : 'pending'}">
                <div class="field-label">FULL NAME</div>
                <div class="field-value">${caseData.fullRecord.victim_full_name}</div>
              </div>
              <div class="field ${isFieldVerified('contact_phone') ? 'verified' : 'pending'}">
                <div class="field-label">CONTACT PHONE</div>
                <div class="field-value">${caseData.fullRecord.contact_phone}</div>
              </div>
              <div class="field ${isFieldVerified('contact_email') ? 'verified' : 'pending'}">
                <div class="field-label">EMAIL ADDRESS</div>
                <div class="field-value">${caseData.fullRecord.contact_email}</div>
              </div>
            </div>
          </div>

          <!-- Incident Details -->
          <div class="section">
            <div class="section-title">INCIDENT DETAILS</div>
            <div class="field-grid">
              <div class="field ${isFieldVerified('incident_datetime') ? 'verified' : 'pending'}">
                <div class="field-label">DATE & TIME</div>
                <div class="field-value">${formatDateTime(caseData.fullRecord.incident_datetime)}</div>
              </div>
              <div class="field ${isFieldVerified('incident_location') ? 'verified' : 'pending'}">
                <div class="field-label">LOCATION</div>
                <div class="field-value">${caseData.fullRecord.incident_location_address}</div>
              </div>
              <div class="field field-full ${isFieldVerified('incident_description') ? 'verified' : 'pending'}">
                <div class="field-label">INCIDENT DESCRIPTION</div>
                <div class="field-value">${caseData.fullRecord.incident_description}</div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="section">
            <div class="section-title">ADDITIONAL INFORMATION</div>
            <div class="field-grid">
              <div class="field field-full ${isFieldVerified('suspect_names') ? 'verified' : 'pending'}">
                <div class="field-label">SUSPECT INFORMATION</div>
                <div class="field-value">${
                  caseData.fullRecord.suspect_names && caseData.fullRecord.suspect_names.length > 0
                    ? caseData.fullRecord.suspect_names.join(', ')
                    : 'No suspects identified'
                }</div>
              </div>
              <div class="field field-full ${isFieldVerified('witness_contacts') ? 'verified' : 'pending'}">
                <div class="field-label">WITNESS INFORMATION</div>
                <div class="field-value">${caseData.fullRecord.witness_names_contacts || 'No witnesses recorded'}</div>
              </div>
              <div class="field field-full ${isFieldVerified('property_details') ? 'verified' : 'pending'}">
                <div class="field-label">PROPERTY DETAILS</div>
                <div class="field-value">${caseData.fullRecord.property_details}</div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>--- OFFICIAL DOCUMENT ---</strong></p>
            <p>Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}</p>
            <p>Verification Status: ${verificationProgress}% Complete</p>
            
            <div class="signature-area">
              <div class="signature-box">
                <p>Verifying Officer</p>
                <p style="margin-top: 20px;">_______________________</p>
                <p style="font-size: 12px;">${caseData.assignedTo}</p>
              </div>
              <div class="signature-box">
                <p>Supervising Officer</p>
                <p style="margin-top: 20px;">_______________________</p>
                <p style="font-size: 12px;">Date: ${new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          <script>
            // Auto-print when page loads
            window.onload = function() {
              window.print();
              // Close window after printing (optional)
              setTimeout(function() {
                window.close();
              }, 1000);
            };
          </script>
        </body>
        </html>
      `;

      // Write content to new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      console.log('✅ PDF content generated and opened for printing');
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Handle regular print
  const handlePrint = () => {
    window.print();
  };

  // Handle save progress
  const handleSaveProgress = async () => {
    try {
      setIsSaving(true);
      console.log('💾 Saving verification progress...');
      
      // Create verification progress data
      const progressData = {
        caseId: caseData.id,
        verificationFields: verificationFields,
        verificationProgress: verificationProgress,
        lastSaved: new Date().toISOString(),
        savedBy: 'current_officer', // In production, get from auth context
        totalFields: totalFields,
        verifiedFields: verifiedFields
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage as backup
      localStorage.setItem(`verification_progress_${caseData.id}`, JSON.stringify(progressData));
      
      // In a real application, you would save to Firestore/database here
      // await firestoreService.saveVerificationProgress(progressData);
      
      console.log('✅ Verification progress saved successfully');
      console.log('📊 Progress data:', progressData);
      
      // Show success feedback (you could add a toast notification here)
      alert(`Verification progress saved successfully!\n\nProgress: ${verificationProgress}%\nVerified fields: ${verifiedFields}/${totalFields}`);
      
    } catch (error) {
      console.error('❌ Error saving verification progress:', error);
      alert('Failed to save progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Load saved progress on component mount
  React.useEffect(() => {
    const loadSavedProgress = () => {
      try {
        const savedData = localStorage.getItem(`verification_progress_${caseData.id}`);
        if (savedData) {
          const progressData = JSON.parse(savedData);
          console.log('📂 Loading saved verification progress...');
          console.log('📊 Loaded progress data:', progressData);
          
          // Restore verification state
          setVerificationFields(progressData.verificationFields || verificationFields);
          
          console.log('✅ Verification progress loaded successfully');
          console.log(`📈 Restored progress: ${progressData.verificationProgress}%`);
        }
      } catch (error) {
        console.error('❌ Error loading saved progress:', error);
      }
    };

    loadSavedProgress();
  }, [caseData.id]); // Only run when caseId changes

  // Toggle field verification
  const toggleFieldVerification = (fieldId: string) => {
    setVerificationFields(prev => 
      prev.map(field => 
        field.id === fieldId 
          ? { ...field, verified: !field.verified }
          : field
      )
    );
  };

  // Get field verification status
  const isFieldVerified = (fieldId: string) => {
    return verificationFields.find(field => field.id === fieldId)?.verified || false;
  };

  // Format date and time
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group fields by section
  const fieldsBySection = verificationFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, VerificationField[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Case Details</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Case Verification</h1>
                  <p className="text-sm text-gray-500">{caseData.id}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">{verificationProgress}% Complete</span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={generatePDF}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button 
                  onClick={handleSaveProgress}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Main Document Area */}
        <div className="flex-1 p-6">
          {/* Progress Banner */}
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold mb-2">Verification Progress</h2>
                <p className="text-blue-100">{verifiedFields} of {totalFields} fields verified</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{verificationProgress}%</div>
                <div className="w-24 h-2 bg-blue-400 rounded-full mt-2">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${verificationProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Document Layout */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Document Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Shield className="w-8 h-8" />
                  <div>
                    <h2 className="text-3xl font-bold">GOVERNMENT OF INDIA</h2>
                    <p className="text-gray-300 text-lg">NagarRakshak Police Department</p>
                  </div>
                  <Shield className="w-8 h-8" />
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <h3 className="text-2xl font-semibold mb-2">FIRST INFORMATION REPORT</h3>
                  <div className="inline-flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-full">
                    <Award className="w-5 h-5" />
                    <span className="font-medium">OFFICIAL VERIFICATION DOCUMENT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b-2 border-blue-100">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VerificationField
                    label="FIR Number"
                    value={caseData.fullRecord.fir_number}
                    verified={isFieldVerified('fir_number')}
                    onClick={() => toggleFieldVerification('fir_number')}
                    icon={<FileText className="w-5 h-5" />}
                  />
                  
                  <VerificationField
                    label="Incident Type"
                    value={caseData.fullRecord.incident_type}
                    verified={isFieldVerified('incident_type')}
                    onClick={() => toggleFieldVerification('incident_type')}
                    icon={<AlertTriangle className="w-5 h-5" />}
                  />
                  
                  <VerificationField
                    label="Assigned Officer"
                    value={caseData.assignedTo}
                    verified={isFieldVerified('assigned_officer')}
                    onClick={() => toggleFieldVerification('assigned_officer')}
                    icon={<Shield className="w-5 h-5" />}
                  />
                  
                  <VerificationField
                    label="Registration Date"
                    value={formatDateTime(caseData.fullRecord.created_at)}
                    verified={isFieldVerified('created_at')}
                    onClick={() => toggleFieldVerification('created_at')}
                    icon={<Calendar className="w-5 h-5" />}
                  />
                </div>
              </div>

              {/* Complainant Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b-2 border-green-100">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Complainant Information</h3>
                </div>
                
                <div className="space-y-6">
                  <VerificationField
                    label="Full Name"
                    value={caseData.fullRecord.victim_full_name}
                    verified={isFieldVerified('victim_name')}
                    onClick={() => toggleFieldVerification('victim_name')}
                    icon={<User className="w-5 h-5" />}
                    fullWidth
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VerificationField
                      label="Contact Phone"
                      value={caseData.fullRecord.contact_phone}
                      verified={isFieldVerified('contact_phone')}
                      onClick={() => toggleFieldVerification('contact_phone')}
                      icon={<Phone className="w-5 h-5" />}
                    />
                    
                    <VerificationField
                      label="Email Address"
                      value={caseData.fullRecord.contact_email}
                      verified={isFieldVerified('contact_email')}
                      onClick={() => toggleFieldVerification('contact_email')}
                      icon={<Mail className="w-5 h-5" />}
                    />
                  </div>
                </div>
              </div>

              {/* Incident Details Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b-2 border-orange-100">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Incident Details</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VerificationField
                      label="Date & Time"
                      value={formatDateTime(caseData.fullRecord.incident_datetime)}
                      verified={isFieldVerified('incident_datetime')}
                      onClick={() => toggleFieldVerification('incident_datetime')}
                      icon={<Calendar className="w-5 h-5" />}
                    />
                    
                    <VerificationField
                      label="Location"
                      value={caseData.fullRecord.incident_location_address}
                      verified={isFieldVerified('incident_location')}
                      onClick={() => toggleFieldVerification('incident_location')}
                      icon={<MapPin className="w-5 h-5" />}
                    />
                  </div>
                  
                  <VerificationField
                    label="Incident Description"
                    value={caseData.fullRecord.incident_description}
                    verified={isFieldVerified('incident_description')}
                    onClick={() => toggleFieldVerification('incident_description')}
                    icon={<FileText className="w-5 h-5" />}
                    fullWidth
                    multiline
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b-2 border-purple-100">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Additional Information</h3>
                </div>
                
                <div className="space-y-6">
                  <VerificationField
                    label="Suspect Information"
                    value={caseData.fullRecord.suspect_names && caseData.fullRecord.suspect_names.length > 0 
                      ? caseData.fullRecord.suspect_names.join(', ') 
                      : 'No suspects identified'}
                    verified={isFieldVerified('suspect_names')}
                    onClick={() => toggleFieldVerification('suspect_names')}
                    icon={<Users className="w-5 h-5" />}
                    fullWidth
                  />
                  
                  <VerificationField
                    label="Witness Information"
                    value={caseData.fullRecord.witness_names_contacts || 'No witnesses recorded'}
                    verified={isFieldVerified('witness_contacts')}
                    onClick={() => toggleFieldVerification('witness_contacts')}
                    icon={<Users className="w-5 h-5" />}
                    fullWidth
                  />
                  
                  <VerificationField
                    label="Property Details"
                    value={caseData.fullRecord.property_details}
                    verified={isFieldVerified('property_details')}
                    onClick={() => toggleFieldVerification('property_details')}
                    icon={<FileText className="w-5 h-5" />}
                    fullWidth
                    multiline
                  />
                </div>
              </div>
              
              {/* Verification Stamp */}
              <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-300">
                <div className="flex items-center justify-center space-x-4">
                  <Stamp className="w-12 h-12 text-blue-600" />
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-800">Official Verification Status</h4>
                    <p className="text-blue-600 font-medium">{verificationProgress}% Complete</p>
                    <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Verification Sidebar */}
        <div className="w-80 bg-white/70 backdrop-blur-sm p-6 border-l border-gray-200/50">
          <div className="sticky top-24 space-y-6">
            {/* Progress Circle */}
            <div className="text-center">
              <div className="relative inline-flex">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - verificationProgress / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{verificationProgress}%</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{verifiedFields} of {totalFields} verified</p>
            </div>

            {/* Field Checklist */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Verification Checklist</h3>
              
              {Object.entries(fieldsBySection).map(([sectionName, fields]) => (
                <div key={sectionName} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
                    {sectionName}
                  </h4>
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        field.verified 
                          ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                          : 'bg-gray-50 hover:bg-blue-50 border border-gray-200'
                      }`}
                      onClick={() => toggleFieldVerification(field.id)}
                    >
                      {field.verified ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          field.verified ? 'text-green-800' : 'text-gray-900'
                        }`}>
                          {field.label}
                        </p>
                        {field.required && (
                          <p className="text-xs text-red-500">Required</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <button 
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  verificationProgress === 100
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={verificationProgress !== 100}
              >
                {verificationProgress === 100 ? (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete Verification</span>
                  </div>
                ) : (
                  <span>Complete All Fields</span>
                )}
              </button>
              
              <button 
                onClick={handleSaveProgress}
                disabled={isSaving}
                className="w-full py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Progress</span>
                )}
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={generatePDF}
                  className="py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium flex items-center justify-center"
                  title="Generate PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={handlePrint}
                  className="py-2 px-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm font-medium"
                >
                  <Printer className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Verification Field Component
interface VerificationFieldProps {
  label: string;
  value: string;
  verified: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  fullWidth?: boolean;
  multiline?: boolean;
}

const VerificationField: React.FC<VerificationFieldProps> = ({
  label,
  value,
  verified,
  onClick,
  icon,
  fullWidth = false,
  multiline = false
}) => {
  return (
    <div 
      className={`${fullWidth ? 'col-span-full' : ''} group relative`}
    >
      <div
        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
          verified 
            ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md' 
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30'
        }`}
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${verified ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={verified ? 'text-green-600' : 'text-gray-600'}>
                {icon}
              </div>
            </div>
            <span className={`text-sm font-semibold ${verified ? 'text-green-800' : 'text-gray-700'}`}>
              {label}
            </span>
          </div>
          
          {verified && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                VERIFIED
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className={`${multiline ? 'text-sm leading-relaxed' : 'text-base'} ${
          verified ? 'text-green-900' : 'text-gray-800'
        } font-medium`}>
          {multiline ? (
            <div className="bg-white/60 p-3 rounded-lg border border-gray-200">
              {value}
            </div>
          ) : (
            value
          )}
        </div>
        
        {/* Hover indicator */}
        {!verified && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Circle className="w-5 h-5 text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseVerification;
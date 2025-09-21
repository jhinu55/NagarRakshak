import React, { useState, useCallback, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  File, 
  Image, 
  Video, 
  FileText, 
  Trash2,
  Check,
  AlertTriangle
} from 'lucide-react';

interface EvidenceUploadProps {
  language: 'en' | 'hi' | 'kok';
  onBack: () => void;
  accessibilityMode: boolean;
}

interface UploadedFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'document';
  preview?: string;
  status: 'uploading' | 'uploaded' | 'error';
}

const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ 
  language, 
  onBack 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
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
      title: "Upload Evidence",
      subtitle: "Add photos, videos, or documents to support your case",
      dragText: "Drag and drop files here, or click to browse",
      supportedFormats: "Supported: JPG, PNG, PDF, MP4, MOV (Max 10MB each)",
      maxFiles: "Maximum 10 files allowed",
      uploading: "Uploading...",
      uploaded: "Uploaded successfully",
      error: "Upload failed",
      removeFile: "Remove file",
      noFiles: "No files uploaded yet",
      selectCase: "Select Case",
      casePlaceholder: "Enter case reference number"
    },
    hi: {
      title: "साक्ष्य अपलोड करें",
      subtitle: "अपने केस का समर्थन करने के लिए फोटो, वीडियो या दस्तावेज जोड़ें",
      dragText: "फाइलों को यहां खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें",
      supportedFormats: "समर्थित: JPG, PNG, PDF, MP4, MOV (अधिकतम 10MB प्रत्येक)",
      maxFiles: "अधिकतम 10 फाइलों की अनुमति है",
      uploading: "अपलोड हो रहा है...",
      uploaded: "सफलतापूर्वक अपलोड हुआ",
      error: "अपलोड असफल",
      removeFile: "फाइल हटाएं",
      noFiles: "अभी तक कोई फाइल अपलोड नहीं की गई",
      selectCase: "केस चुनें",
      casePlaceholder: "केस संदर्भ नंबर दर्ज करें"
    },
    kok: {
      title: "पुरावो अपलोड करात",
      subtitle: "तुमच्या केसाक समर्थन दिवपाक फोटो, व्हिडिओ वा कागदपत्र घालात",
      dragText: "फायली हांगा ओढून घालात, वा ब्राउझ करपाक क्लिक करात",
      supportedFormats: "समर्थित: JPG, PNG, PDF, MP4, MOV (कमाल 10MB दरेक)",
      maxFiles: "कमाल 10 फायलींक परवानगी",
      uploading: "अपलोड जातात...",
      uploaded: "यशस्वीपणान अपलोड जाला",
      error: "अपलोड अयशस्वी",
      removeFile: "फायल काडून टाकात",
      noFiles: "अजून कोणतीच फायल अपलोड केली ना",
      selectCase: "केस निवडात",
      casePlaceholder: "केस संदर्भ नंबर घालात"
    }
  };

  const currentContent = content[language];

  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const getFileIcon = (type: 'image' | 'video' | 'document') => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

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

    if (uploadedFiles.length + validFiles.length > 10) {
      alert('Maximum 10 files allowed');
      return;
    }

    validFiles.forEach(file => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36),
        file,
        type: getFileType(file),
        status: 'uploading'
      };

      // Create preview for images
      if (newFile.type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id 
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: Math.random() > 0.1 ? 'uploaded' : 'error' }
              : f
          )
        );
      }, 2000);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
      <header className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">{currentContent.title}</h1>
            <p className="text-white/70 text-sm">{currentContent.subtitle}</p>
          </div>
          
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Case Selection */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <h3 className="text-white font-semibold mb-4">{currentContent.selectCase}</h3>
            <input
              type="text"
              placeholder={currentContent.casePlaceholder}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md"
            />
          </div>

          {/* File Upload Area */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
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
                  <p className="text-white text-lg mb-2">{currentContent.dragText}</p>
                  <p className="text-white/60 text-sm mb-1">{currentContent.supportedFormats}</p>
                  <p className="text-white/60 text-xs">{currentContent.maxFiles}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <h3 className="text-white font-semibold mb-4">
              Uploaded Files ({uploadedFiles.length}/10)
            </h3>
            
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
                <File className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <p className="text-white/60">{currentContent.noFiles}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {uploadedFiles.map((uploadedFile) => {
                  const IconComponent = getFileIcon(uploadedFile.type);
                  return (
                    <div
                      key={uploadedFile.id}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      {/* File Preview/Icon */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                        {uploadedFile.preview ? (
                          <img 
                            src={uploadedFile.preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <IconComponent className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-white/60 text-xs">
                          {formatFileSize(uploadedFile.file.size)}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="flex items-center space-x-2">
                        {uploadedFile.status === 'uploading' && (
                          <div className="flex items-center space-x-2 text-amber-400">
                            <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
                            <span className="text-xs">{currentContent.uploading}</span>
                          </div>
                        )}
                        
                        {uploadedFile.status === 'uploaded' && (
                          <div className="flex items-center space-x-2 text-green-400">
                            <Check className="w-4 h-4" />
                            <span className="text-xs">{currentContent.uploaded}</span>
                          </div>
                        )}
                        
                        {uploadedFile.status === 'error' && (
                          <div className="flex items-center space-x-2 text-red-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs">{currentContent.error}</span>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFile(uploadedFile.id)}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          title={currentContent.removeFile}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          {uploadedFiles.length > 0 && (
            <div className="text-center">
              <button
                disabled={uploadedFiles.some(f => f.status === 'uploading')}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-xl transition-all duration-300 text-white font-medium"
              >
                Submit Evidence
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EvidenceUpload;
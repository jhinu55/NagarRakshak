
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          common: {
            goaPolice: 'Goa Police',
            nagarRakshak: 'Nagar Rakshak 2.0',
            aiPoweredAssistant: 'AI-Powered Police Assistant',
            selectLanguage: 'Select Your Language',
            chooseLanguage: 'Choose your preferred language to continue',
            poweredBy: 'Powered by AI Technology • Serving the People of Goa',
            login: 'Login',
            logout: 'Logout',
            settings: 'Settings'
          },
          landing: {
            title: 'Goa Police',
            subtitle: 'AI-Powered Police Modernization System'
          },
          navigation: {
            dashboard: 'Dashboard',
            citizenPortal: 'Citizen Portal',
            officerPortal: 'Officer Portal',
            caseManagement: 'Case Management',
            analytics: 'Analytics',
            aiAssistant: 'AI Assistant'
          },
          dashboard: {
            title: 'Dashboard',
            welcome: 'Welcome to the Police Modernization Dashboard',
            quickActions: 'Quick Actions',
            recentCases: 'Recent Cases',
            viewAllCases: 'View All Cases',
            systemStatus: 'System Status: Online',
            systemDesc: 'All systems operational. AI Assistant ready. Offline mode available.',
            database: 'Database: Connected',
            aiServices: 'AI Services: Active',
            voiceRecognition: 'Voice Recognition: Ready'
          },
          stats: {
            totalCases: 'Total Cases',
            activeCases: 'Active Cases',
            resolvedCases: 'Resolved Cases',
            urgentCases: 'Urgent Cases'
          },
          actions: {
            fileComplaint: 'File New Complaint',
            fileComplaintDesc: 'Citizens can file complaints easily',
            officerDashboard: 'Officer Dashboard',
            officerDashboardDesc: 'Access officer tools and case management',
            viewAnalytics: 'View Analytics',
            viewAnalyticsDesc: 'Crime statistics and trends',
            aiAssistant: 'AI Assistant',
            aiAssistantDesc: 'Get help from AI assistant'
          },
          cases: {
            theft: 'Theft',
            domesticDispute: 'Domestic Dispute',
            trafficViolation: 'Traffic Violation',
            cybercrime: 'Cybercrime',
            underInvestigation: 'Under Investigation',
            resolved: 'Resolved',
            pending: 'Pending',
            high: 'High',
            medium: 'Medium',
            low: 'Low'
          },
          userRoles: {
            citizen: 'Citizen',
            officer: 'Officer',
            admin: 'Admin',
            loginAs: 'Login as {{role}}'
          },
          login: {
            selectRole: 'Select Your Role',
            selectRoleDesc: 'Choose your login type to access the appropriate dashboard',
            backToLanguage: 'Back to Language Selection',
            backToRoles: 'Back to Role Selection',
            username: 'Username / Badge ID',
            password: 'Password',
            signIn: 'Sign In as {{role}}',
            forgotPassword: 'Forgot your password?',
            citizenDesc: 'File complaints, track cases, access public services',
            officerDesc: 'Manage cases, access officer tools, update investigations',
            adminDesc: 'System administration, user management, analytics',
            enterUsername: 'Enter Username',
            enterBadgeId: 'Enter Badge ID',
            enterPassword: 'Enter Password'
          }
        }
      },
      hi: {
        translation: {
          common: {
            goaPolice: 'गोवा पुलिस',
            nagarRakshak: 'नगर रक्षक 2.0',
            aiPoweredAssistant: 'एआई-संचालित पुलिस सहायक',
            selectLanguage: 'अपनी भाषा चुनें',
            chooseLanguage: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
            poweredBy: 'एआई प्रौद्योगिकी द्वारा संचालित • गोवा के लोगों की सेवा',
            login: 'लॉगिन',
            logout: 'लॉगआउट',
            settings: 'सेटिंग्स'
          },
          landing: {
            title: 'गोवा पुलिस',
            subtitle: 'एआई-संचालित पुलिस आधुनिकीकरण प्रणाली'
          },
          navigation: {
            dashboard: 'डैशबोर्ड',
            citizenPortal: 'नागरिक पोर्टल',
            officerPortal: 'अधिकारी पोर्टल',
            caseManagement: 'केस प्रबंधन',
            analytics: 'एनालिटिक्स',
            aiAssistant: 'एआई सहायक'
          },
          dashboard: {
            title: 'डैशबोर्ड',
            welcome: 'पुलिस आधुनिकीकरण डैशबोर्ड में आपका स्वागत है',
            quickActions: 'त्वरित कार्य',
            recentCases: 'हाल के मामले',
            viewAllCases: 'सभी मामले देखें',
            systemStatus: 'सिस्टम स्थिति: ऑनलाइन',
            systemDesc: 'सभी सिस्टम चालू। एआई सहायक तैयार। ऑफलाइन मोड उपलब्ध।',
            database: 'डेटाबेस: कनेक्टेड',
            aiServices: 'एआई सेवाएं: सक्रिय',
            voiceRecognition: 'आवाज पहचान: तैयार'
          },
          stats: {
            totalCases: 'कुल मामले',
            activeCases: 'सक्रिय मामले',
            resolvedCases: 'हल किए गए मामले',
            urgentCases: 'तत्काल मामले'
          },
          actions: {
            fileComplaint: 'नई शिकायत दर्ज करें',
            fileComplaintDesc: 'नागरिक आसानी से शिकायत दर्ज कर सकते हैं',
            officerDashboard: 'अधिकारी डैशबोर्ड',
            officerDashboardDesc: 'अधिकारी उपकरण और केस प्रबंधन तक पहुंच',
            viewAnalytics: 'एनालिटिक्स देखें',
            viewAnalyticsDesc: 'अपराध आंकड़े और रुझान',
            aiAssistant: 'एआई सहायक',
            aiAssistantDesc: 'एआई सहायक से सहायता प्राप्त करें'
          },
          cases: {
            theft: 'चोरी',
            domesticDispute: 'घरेलू विवाद',
            trafficViolation: 'यातायात उल्लंघन',
            cybercrime: 'साइबर अपराध',
            underInvestigation: 'जांच के तहत',
            resolved: 'हल हो गया',
            pending: 'लंबित',
            high: 'उच्च',
            medium: 'मध्यम',
            low: 'कम'
          },
          userRoles: {
            citizen: 'नागरिक',
            officer: 'अधिकारी',
            admin: 'व्यवस्थापक',
            loginAs: '{{role}} के रूप में लॉगिन करें'
          },
          login: {
            selectRole: 'अपनी भूमिका चुनें',
            selectRoleDesc: 'उपयुक्त डैशबोर्ड तक पहुंचने के लिए अपना लॉगिन प्रकार चुनें',
            backToLanguage: 'भाषा चयन पर वापस जाएं',
            backToRoles: 'भूमिका चयन पर वापस जाएं',
            username: 'उपयोगकर्ता नाम / बैज आईडी',
            password: 'पासवर्ड',
            signIn: '{{role}} के रूप में साइन इन करें',
            forgotPassword: 'अपना पासवर्ड भूल गए?',
            citizenDesc: 'शिकायत दर्ज करें, मामलों को ट्रैक करें, सार्वजनिक सेवाओं तक पहुंचें',
            officerDesc: 'मामलों का प्रबंधन करें, अधिकारी उपकरणों तक पहुंचें, जांच अपडेट करें',
            adminDesc: 'सिस्टम प्रशासन, उपयोगकर्ता प्रबंधन, एनालिटिक्स',
            enterUsername: 'उपयोगकर्ता नाम दर्ज करें',
            enterBadgeId: 'बैज आईडी दर्ज करें',
            enterPassword: 'पासवर्ड दर्ज करें'
          }
        }
      },
      mr: {
        translation: {
          common: {
            goaPolice: 'गोवा पोलीस',
            nagarRakshak: 'नगर रक्षक 2.0',
            aiPoweredAssistant: 'एआय-चालित पोलीस सहाय्यक',
            selectLanguage: 'तुमची भाषा निवडा',
            chooseLanguage: 'पुढे जाण्यासाठी तुमची पसंतीची भाषा निवडा',
            poweredBy: 'एआय तंत्रज्ञानाद्वारे चालित • गोव्याच्या लोकांची सेवा',
            login: 'लॉगिन',
            logout: 'लॉगआउट',
            settings: 'सेटिंग्ज'
          },
          landing: {
            title: 'गोवा पोलीस',
            subtitle: 'एआय-चालित पोलीस आधुनिकीकरण प्रणाली'
          },
          navigation: {
            dashboard: 'डॅशबोर्ड',
            citizenPortal: 'नागरिक पोर्टल',
            officerPortal: 'अधिकारी पोर्टल',
            caseManagement: 'केस व्यवस्थापन',
            analytics: 'अॅनालिटिक्स',
            aiAssistant: 'एआय सहाय्यक'
          },
          dashboard: {
            title: 'डॅशबोर्ड',
            welcome: 'पोलीस आधुनिकीकरण डॅशबोर्डवर आपले स्वागत आहे',
            quickActions: 'द्रुत कृती',
            recentCases: 'अलीकडील प्रकरणे',
            viewAllCases: 'सर्व प्रकरणे पहा',
            systemStatus: 'सिस्टम स्थिती: ऑनलाइन',
            systemDesc: 'सर्व सिस्टम चालू. एआय सहाय्यक तयार. ऑफलाइन मोड उपलब्ध.',
            database: 'डेटाबेस: कनेक्ट केलेले',
            aiServices: 'एआय सेवा: सक्रिय',
            voiceRecognition: 'आवाज ओळख: तयार'
          },
          stats: {
            totalCases: 'एकूण प्रकरणे',
            activeCases: 'सक्रिय प्रकरणे',
            resolvedCases: 'सोडवलेली प्रकरणे',
            urgentCases: 'तातडीची प्रकरणे'
          },
          actions: {
            fileComplaint: 'नवीन तक्रार दाखल करा',
            fileComplaintDesc: 'नागरिक सहजपणे तक्रार दाखल करू शकतात',
            officerDashboard: 'अधिकारी डॅशबोर्ड',
            officerDashboardDesc: 'अधिकारी साधने आणि केस व्यवस्थापनात प्रवेश',
            viewAnalytics: 'अॅनालिटिक्स पहा',
            viewAnalyticsDesc: 'गुन्हेगारी आकडेवारी आणि ट्रेंड',
            aiAssistant: 'एआय सहाय्यक',
            aiAssistantDesc: 'एआय सहाय्यकाकडून मदत मिळवा'
          },
          cases: {
            theft: 'चोरी',
            domesticDispute: 'घरगुती वाद',
            trafficViolation: 'ट्रॅफिक उल्लंघन',
            cybercrime: 'सायबर गुन्हा',
            underInvestigation: 'तपासाधीन',
            resolved: 'सोडवले',
            pending: 'प्रलंबित',
            high: 'उच्च',
            medium: 'मध्यम',
            low: 'कमी'
          },
          userRoles: {
            citizen: 'नागरिक',
            officer: 'अधिकारी',
            admin: 'प्रशासक',
            loginAs: '{{role}} म्हणून लॉगिन करा'
          },
          login: {
            selectRole: 'तुमची भूमिका निवडा',
            selectRoleDesc: 'योग्य डॅशबोर्डवर प्रवेश करण्यासाठी तुमचा लॉगिन प्रकार निवडा',
            backToLanguage: 'भाषा निवडीवर परत जा',
            backToRoles: 'भूमिका निवडीवर परत जा',
            username: 'वापरकर्ता नाव / बॅज आयडी',
            password: 'पासवर्ड',
            signIn: '{{role}} म्हणून साइन इन करा',
            forgotPassword: 'तुमचा पासवर्ड विसरलात?',
            citizenDesc: 'तक्रारी दाखल करा, प्रकरणे ट्रॅक करा, सार्वजनिक सेवांमध्ये प्रवेश मिळवा',
            officerDesc: 'प्रकरणे व्यवस्थापित करा, अधिकारी साधनांमध्ये प्रवेश मिळवा, तपास अपडेट करा',
            adminDesc: 'सिस्टम प्रशासन, वापरकर्ता व्यवस्थापन, अॅनालिटिक्स',
            enterUsername: 'वापरकर्ता नाव प्रविष्ट करा',
            enterBadgeId: 'बॅज आयडी प्रविष्ट करा',
            enterPassword: 'पासवर्ड प्रविष्ट करा'
          }
        }
      },
      kok: {
        translation: {
          common: {
            goaPolice: 'गोवा पोलिस',
            nagarRakshak: 'नगर रक्षक 2.0',
            aiPoweredAssistant: 'एआई-चालित पोलिस सहाय्यक',
            selectLanguage: 'तुमची भास निवडात',
            chooseLanguage: 'फुडें वचपाक तुमची आवडीची भास निवडात',
            poweredBy: 'एआई तंत्रगिन्यानान चालित • गोंयच्या लोकांची सेवा',
            login: 'लॉगिन',
            logout: 'लॉगआउट',
            settings: 'सेटिंग्स'
          },
          landing: {
            title: 'गोवा पोलिस',
            subtitle: 'एआई-चालित पोलिस आधुनिकीकरण प्रणाली'
          },
          navigation: {
            dashboard: 'डॅशबोर्ड',
            citizenPortal: 'नागरिक पोर्टल',
            officerPortal: 'अधिकारी पोर्टल',
            caseManagement: 'केस व्यवस्थापन',
            analytics: 'अॅनालिटिक्स',
            aiAssistant: 'एआई सहाय्यक'
          },
          dashboard: {
            title: 'डॅशबोर्ड',
            welcome: 'पोलिस आधुनिकीकरण डॅशबोर्डाक येवकार',
            quickActions: 'बेगीन कृती',
            recentCases: 'हालीच्या प्रकरणां',
            viewAllCases: 'सगळीं प्रकरणां पळयात',
            systemStatus: 'सिस्टम स्थिती: ऑनलाइन',
            systemDesc: 'सगळें सिस्टम चालू. एआई सहाय्यक तयार. ऑफलाइन मोड उपलब्ध.',
            database: 'डेटाबेस: जोडलां',
            aiServices: 'एआई सेवा: सक्रिय',
            voiceRecognition: 'आवाज वळखप: तयार'
          },
          stats: {
            totalCases: 'एकूण प्रकरणां',
            activeCases: 'सक्रिय प्रकरणां',
            resolvedCases: 'सोडवलेलीं प्रकरणां',
            urgentCases: 'तातडीचीं प्रकरणां'
          },
          actions: {
            fileComplaint: 'नवीं तक्रार दाखल करात',
            fileComplaintDesc: 'नागरिक सुकरेपणान तक्रार दाखल करूं येतात',
            officerDashboard: 'अधिकारी डॅशबोर्ड',
            officerDashboardDesc: 'अधिकारी साधनां आनी केस व्यवस्थापनांत प्रवेश',
            viewAnalytics: 'अॅनालिटिक्स पळयात',
            viewAnalyticsDesc: 'गुन्हेगारीची आंकडेवारी आनी ट्रेंड',
            aiAssistant: 'एआई सहाय्यक',
            aiAssistantDesc: 'एआई सहाय्यकाकडल्यान आदार घेयात'
          },
          cases: {
            theft: 'चोरी',
            domesticDispute: 'घरगुतीं वाद',
            trafficViolation: 'ट्रॅफिक उल्लंघन',
            cybercrime: 'सायबर गुन्हो',
            underInvestigation: 'तपासाधीन',
            resolved: 'सोडवलां',
            pending: 'प्रलंबित',
            high: 'व्हड',
            medium: 'मध्यम',
            low: 'उणें'
          },
          userRoles: {
            citizen: 'नागरिक',
            officer: 'अधिकारी',
            admin: 'प्रशासक',
            loginAs: '{{role}} म्हूण लॉगिन करात'
          },
          login: {
            selectRole: 'तुमची भूमिका निवडात',
            selectRoleDesc: 'योग्य डॅशबोर्डांत प्रवेश करपाक तुमचो लॉगिन प्रकार निवडात',
            backToLanguage: 'भाषा निवडणेंत परत वचात',
            backToRoles: 'भूमिका निवडणेंत परत वचात',
            username: 'वापरप्यांचें नांव / बॅज आयडी',
            password: 'पासवर्ड',
            signIn: '{{role}} म्हूण साइन इन करात',
            forgotPassword: 'तुमचो पासवर्ड विसरलात?',
            citizenDesc: 'तक्रारी दाखल करात, प्रकरणां ट्रॅक करात, सार्वजनिक सेवांनी प्रवेश घेयात',
            officerDesc: 'प्रकरणां व्यवस्थापित करात, अधिकारी साधनांनी प्रवेश घेयात, तपास अपडेट करात',
            adminDesc: 'सिस्टम प्रशासन, वापरप्यांचो व्यवस्थापन, अॅनालिटिक्स',
            enterUsername: 'वापरप्यांचें नांव भरात',
            enterBadgeId: 'बॅज आयडी भरात',
            enterPassword: 'पासवर्ड भरात'
          }
        }
      },
      kn: {
        translation: {
          common: {
            goaPolice: 'ಗೋವಾ ಪೊಲೀಸ್',
            nagarRakshak: 'ನಗರ ರಕ್ಷಕ 2.0',
            aiPoweredAssistant: 'ಎಐ-ಚಾಲಿತ ಪೊಲೀಸ್ ಸಹಾಯಕ',
            selectLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            chooseLanguage: 'ಮುಂದುವರಿಸಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            poweredBy: 'ಎಐ ತಂತ್ರಜ್ಞಾನದಿಂದ ಚಾಲಿತ • ಗೋವಾದ ಜನರ ಸೇವೆ',
            login: 'ಲಾಗಿನ್',
            logout: 'ಲಾಗೌಟ್',
            settings: 'ಸೆಟ್ಟಿಂಗ್ಗಳು'
          },
          landing: {
            title: 'ಗೋವಾ ಪೊಲೀಸ್',
            subtitle: 'ಎಐ-ಚಾಲಿತ ಪೊಲೀಸ್ ಆಧುನೀಕರಣ ವ್ಯವಸ್ಥೆ'
          },
          navigation: {
            dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
            citizenPortal: 'ನಾಗರಿಕ ಪೋರ್ಟಲ್',
            officerPortal: 'ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್',
            caseManagement: 'ಕೇಸ್ ನಿರ್ವಹಣೆ',
            analytics: 'ಅನ್ಯಾಲಿಟಿಕ್ಸ್',
            aiAssistant: 'ಎಐ ಸಹಾಯಕ'
          },
          dashboard: {
            title: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
            welcome: 'ಪೊಲೀಸ್ ಆಧುನೀಕರಣ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಸುಸ್ವಾಗತ',
            quickActions: 'ತ್ವರಿತ ಕ್ರಮಗಳು',
            recentCases: 'ಇತ್ತೀಚಿನ ಪ್ರಕರಣಗಳು',
            viewAllCases: 'ಎಲ್ಲಾ ಪ್ರಕರಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
            systemStatus: 'ಸಿಸ್ಟಂ ಸ್ಥಿತಿ: ಆನ್‌ಲೈನ್',
            systemDesc: 'ಎಲ್ಲಾ ಸಿಸ್ಟಮ್‌ಗಳು ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿವೆ. ಎಐ ಸಹಾಯಕ ಸಿದ್ಧ. ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಲಭ್ಯ.',
            database: 'ಡೇಟಾಬೇಸ್: ಸಂಪರ್ಕಿತ',
            aiServices: 'ಎಐ ಸೇವೆಗಳು: ಸಕ್ರಿಯ',
            voiceRecognition: 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ: ಸಿದ್ಧ'
          },
          stats: {
            totalCases: 'ಒಟ್ಟು ಪ್ರಕರಣಗಳು',
            activeCases: 'ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು',
            resolvedCases: 'ಪರಿಹರಿಸಿದ ಪ್ರಕರಣಗಳು',
            urgentCases: 'ತುರ್ತು ಪ್ರಕರಣಗಳು'
          },
          actions: {
            fileComplaint: 'ಹೊಸ ದೂರು ದಾಖಲಿಸಿ',
            fileComplaintDesc: 'ನಾಗರಿಕರು ಸುಲಭವಾಗಿ ದೂರುಗಳನ್ನು ದಾಖಲಿಸಬಹುದು',
            officerDashboard: 'ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
            officerDashboardDesc: 'ಅಧಿಕಾರಿ ಸಾಧನಗಳು ಮತ್ತು ಕೇಸ್ ನಿರ್ವಹಣೆಗೆ ಪ್ರವೇಶ',
            viewAnalytics: 'ಅನ್ಯಾಲಿಟಿಕ್ಸ್ ವೀಕ್ಷಿಸಿ',
            viewAnalyticsDesc: 'ಅಪರಾಧ ಅಂಕಿಅಂಶಗಳು ಮತ್ತು ಪ್ರವೃತ್ತಿಗಳು',
            aiAssistant: 'ಎಐ ಸಹಾಯಕ',
            aiAssistantDesc: 'ಎಐ ಸಹಾಯಕರಿಂದ ಸಹಾಯ ಪಡೆಯಿರಿ'
          },
          cases: {
            theft: 'ಕಳ್ಳತನ',
            domesticDispute: 'ಮನೆಯ ವಿವಾದ',
            trafficViolation: 'ಸಂಚಾರ ಉಲ್ಲಂಘನೆ',
            cybercrime: 'ಸೈಬರ್ ಅಪರಾಧ',
            underInvestigation: 'ತನಿಖೆಯಲ್ಲಿದೆ',
            resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
            pending: 'ಬಾಕಿ',
            high: 'ಹೆಚ್ಚು',
            medium: 'ಮಧ್ಯಮ',
            low: 'ಕಡಿಮೆ'
          },
          userRoles: {
            citizen: 'ನಾಗರಿಕ',
            officer: 'ಅಧಿಕಾರಿ',
            admin: 'ನಿರ್ವಾಹಕ',
            loginAs: '{{role}} ಆಗಿ ಲಾಗಿನ್ ಮಾಡಿ'
          },
          login: {
            selectRole: 'ನಿಮ್ಮ ಭೂಮಿಕೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            selectRoleDesc: 'ಯೋಗ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ಲಾಗಿನ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            backToLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಗೆ ವಾಪಸು ಹೋಗಿ',
            backToRoles: 'ಭೂಮಿಕೆ ಆಯ್ಕೆಗೆ ವಾಪಸು ಹೋಗಿ',
            username: 'ವಾಪರಕರ್ತ ಹೆಸರು / ಬ್ಯಾಜ್ ಆಈಡಿ',
            password: 'ಪಾಸ್ವರ್ಡ್',
            signIn: '{{role}} ಆಗಿ ಸೈನ್ ಇನ್ ಮಾಡಿ',
            forgotPassword: 'ನಿಮ್ಮ ಪಾಸ್ವರ್ಡ್ ಮರೆತಿದ್ದೀರಿ?',
            citizenDesc: 'ದೂರುಗಳನ್ನು ದಾಖಲಿಸಿ, ಪ್ರಕರಣಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
            officerDesc: 'ಪ್ರಕರಣಗಳನ್ನು ನಿರ್ವಹಿಸಿ, ಅಧಿಕಾರಿ ಸಾಧನಗಳನ್ನು ಬೇರೆ, ತನಿಖೆಯನ್ನು ಅಪ್ಡೇಟ್ ಮಾಡಿ',
            adminDesc: 'ಸಿಸ್ಟಂ ಪ್ರಶಾಸನ, ವಾಪರಕರ್ತ ನಿರ್ವಹಣೆ, ಅನ್ಯಾಲಿಟಿಕ್ಸ್',
            enterUsername: 'ವಾಪರಕರ್ತ ಹೆಸರು ನಮೂದಿಸಿ',
            enterBadgeId: 'ಬ್ಯಾಜ್ ಆಈಡಿ ನಮೂದಿಸಿ',
            enterPassword: 'ಪಾಸ್ವರ್ಡ್ ನಮೂದಿಸಿ'
          }
        }
      },
      fr: {
        translation: {
          common: {
            goaPolice: 'Police de Goa',
            nagarRakshak: 'Nagar Rakshak 2.0',
            aiPoweredAssistant: 'Assistant de Police Alimenté par IA',
            selectLanguage: 'Sélectionnez Votre Langue',
            chooseLanguage: 'Choisissez votre langue préférée pour continuer',
            poweredBy: 'Alimenté par la Technologie IA • Au Service du Peuple de Goa',
            login: 'Connexion',
            logout: 'Déconnexion',
            settings: 'Paramètres'
          },
          landing: {
            title: 'Police de Goa',
            subtitle: 'Système de Modernisation de Police Alimenté par IA'
          },
          navigation: {
            dashboard: 'Tableau de Bord',
            citizenPortal: 'Portail Citoyen',
            officerPortal: 'Portail Officier',
            caseManagement: 'Gestion des Affaires',
            analytics: 'Analytiques',
            aiAssistant: 'Assistant IA'
          },
          dashboard: {
            title: 'Tableau de Bord',
            welcome: 'Bienvenue sur le Tableau de Bord de Modernisation de la Police',
            quickActions: 'Actions Rapides',
            recentCases: 'Affaires Récentes',
            viewAllCases: 'Voir Toutes les Affaires',
            systemStatus: 'État du Système: En Ligne',
            systemDesc: 'Tous les systèmes opérationnels. Assistant IA prêt. Mode hors ligne disponible.',
            database: 'Base de Données: Connectée',
            aiServices: 'Services IA: Actifs',
            voiceRecognition: 'Reconnaissance Vocale: Prête'
          },
          stats: {
            totalCases: 'Total des Affaires',
            activeCases: 'Affaires Actives',
            resolvedCases: 'Affaires Résolues',
            urgentCases: 'Affaires Urgentes'
          },
          actions: {
            fileComplaint: 'Déposer une Nouvelle Plainte',
            fileComplaintDesc: 'Les citoyens peuvent facilement déposer des plaintes',
            officerDashboard: 'Tableau de Bord Officier',
            officerDashboardDesc: 'Accès aux outils d\'officier et gestion des affaires',
            viewAnalytics: 'Voir les Analytiques',
            viewAnalyticsDesc: 'Statistiques et tendances criminelles',
            aiAssistant: 'Assistant IA',
            aiAssistantDesc: 'Obtenez de l\'aide de l\'assistant IA'
          },
          cases: {
            theft: 'Vol',
            domesticDispute: 'Dispute Domestique',
            trafficViolation: 'Violation du Code de la Route',
            cybercrime: 'Cybercriminalité',
            underInvestigation: 'Sous Enquête',
            resolved: 'Résolu',
            pending: 'En Attente',
            high: 'Élevé',
            medium: 'Moyen',
            low: 'Bas'
          },
          userRoles: {
            citizen: 'Citoyen',
            officer: 'Officier',
            admin: 'Administrateur',
            loginAs: 'Se connecter en tant que {{role}}'
          },
          login: {
            selectRole: 'Sélectionnez Votre Rôle',
            selectRoleDesc: 'Choisissez votre type de connexion pour accéder au tableau de bord approprié',
            backToLanguage: 'Retour à la Sélection de Langue',
            backToRoles: 'Retour à la Sélection de Rôle',
            username: 'Nom d\'utilisateur / ID Badge',
            password: 'Mot de passe',
            signIn: 'Se connecter en tant que {{role}}',
            forgotPassword: 'Mot de passe oublié?',
            citizenDesc: 'Déposer des plaintes, suivre les affaires, accéder aux services publics',
            officerDesc: 'Gérer les affaires, accéder aux outils d\'officier, mettre à jour les enquêtes',
            adminDesc: 'Administration système, gestion des utilisateurs, analytiques',
            enterUsername: 'Entrez le nom d\'utilisateur',
            enterBadgeId: 'Entrez l\'ID du badge',
            enterPassword: 'Entrez le mot de passe'
          }
        }
      },
      de: {
        translation: {
          common: {
            goaPolice: 'Goa Polizei',
            nagarRakshak: 'Nagar Rakshak 2.0',
            aiPoweredAssistant: 'KI-betriebener Polizei-Assistent',
            selectLanguage: 'Wählen Sie Ihre Sprache',
            chooseLanguage: 'Wählen Sie Ihre bevorzugte Sprache, um fortzufahren',
            poweredBy: 'Angetrieben von KI-Technologie • Im Dienste der Menschen von Goa',
            login: 'Anmelden',
            logout: 'Abmelden',
            settings: 'Einstellungen'
          },
          landing: {
            title: 'Goa Polizei',
            subtitle: 'KI-betriebenes Polizei-Modernisierungssystem'
          },
          navigation: {
            dashboard: 'Armaturenbrett',
            citizenPortal: 'Bürgerportal',
            officerPortal: 'Beamtenportal',
            caseManagement: 'Fallverwaltung',
            analytics: 'Analytik',
            aiAssistant: 'KI-Assistent'
          },
          dashboard: {
            title: 'Armaturenbrett',
            welcome: 'Willkommen beim Polizei-Modernisierungs-Dashboard',
            quickActions: 'Schnellaktionen',
            recentCases: 'Neueste Fälle',
            viewAllCases: 'Alle Fälle anzeigen',
            systemStatus: 'Systemstatus: Online',
            systemDesc: 'Alle Systeme betriebsbereit. KI-Assistent bereit. Offline-Modus verfügbar.',
            database: 'Datenbank: Verbunden',
            aiServices: 'KI-Dienste: Aktiv',
            voiceRecognition: 'Spracherkennung: Bereit'
          },
          stats: {
            totalCases: 'Gesamte Fälle',
            activeCases: 'Aktive Fälle',
            resolvedCases: 'Gelöste Fälle',
            urgentCases: 'Dringende Fälle'
          },
          actions: {
            fileComplaint: 'Neue Beschwerde einreichen',
            fileComplaintDesc: 'Bürger können einfach Beschwerden einreichen',
            officerDashboard: 'Beamten-Dashboard',
            officerDashboardDesc: 'Zugang zu Beamten-Tools und Fallverwaltung',
            viewAnalytics: 'Analytik anzeigen',
            viewAnalyticsDesc: 'Kriminalstatistiken und Trends',
            aiAssistant: 'KI-Assistent',
            aiAssistantDesc: 'Hilfe vom KI-Assistenten erhalten'
          },
          cases: {
            theft: 'Diebstahl',
            domesticDispute: 'Häuslicher Streit',
            trafficViolation: 'Verkehrsverstoß',
            cybercrime: 'Cyberkriminalität',
            underInvestigation: 'Unter Untersuchung',
            resolved: 'Gelöst',
            pending: 'Ausstehend',
            high: 'Hoch',
            medium: 'Mittel',
            low: 'Niedrig'
          },
          userRoles: {
            citizen: 'Bürger',
            officer: 'Beamter',
            admin: 'Administrator',
            loginAs: 'Als {{role}} anmelden'
          },
          login: {
            selectRole: 'Wählen Sie Ihre Rolle',
            selectRoleDesc: 'Wählen Sie Ihren Anmeldetyp, um auf das entsprechende Dashboard zuzugreifen',
            backToLanguage: 'Zurück zur Sprachauswahl',
            backToRoles: 'Zurück zur Rollenauswahl',
            username: 'Benutzername / Dienstausweis-ID',
            password: 'Passwort',
            signIn: 'Als {{role}} anmelden',
            forgotPassword: 'Passwort vergessen?',
            citizenDesc: 'Beschwerden einreichen, Fälle verfolgen, auf öffentliche Dienste zugreifen',
            officerDesc: 'Fälle verwalten, auf Beamten-Tools zugreifen, Ermittlungen aktualisieren',
            adminDesc: 'Systemverwaltung, Benutzerverwaltung, Analytik',
            enterUsername: 'Benutzername eingeben',
            enterBadgeId: 'Dienstausweis-ID eingeben',
            enterPassword: 'Passwort eingeben'
          }
        }
      },
      ru: {
        translation: {
          common: {
            goaPolice: 'Полиция Гоа',
            nagarRakshak: 'Нагар Ракшак 2.0',
            aiPoweredAssistant: 'ИИ-помощник полиции',
            selectLanguage: 'Выберите Ваш Язык',
            chooseLanguage: 'Выберите предпочитаемый язык для продолжения',
            poweredBy: 'На основе ИИ-технологий • Служим народу Гоа',
            login: 'Войти',
            logout: 'Выйти',
            settings: 'Настройки'
          },
          landing: {
            title: 'Полиция Гоа',
            subtitle: 'ИИ-система модернизации полиции'
          },
          navigation: {
            dashboard: 'Панель управления',
            citizenPortal: 'Портал граждан',
            officerPortal: 'Портал офицеров',
            caseManagement: 'Управление делами',
            analytics: 'Аналитика',
            aiAssistant: 'ИИ-помощник'
          },
          dashboard: {
            title: 'Панель управления',
            welcome: 'Добро пожаловать в панель модернизации полиции',
            quickActions: 'Быстрые действия',
            recentCases: 'Недавние дела',
            viewAllCases: 'Просмотреть все дела',
            systemStatus: 'Статус системы: Онлайн',
            systemDesc: 'Все системы работают. ИИ-помощник готов. Офлайн-режим доступен.',
            database: 'База данных: Подключена',
            aiServices: 'ИИ-сервисы: Активны',
            voiceRecognition: 'Распознавание речи: Готово'
          },
          stats: {
            totalCases: 'Всего дел',
            activeCases: 'Активные дела',
            resolvedCases: 'Решенные дела',
            urgentCases: 'Срочные дела'
          },
          actions: {
            fileComplaint: 'Подать новую жалобу',
            fileComplaintDesc: 'Граждане могут легко подавать жалобы',
            officerDashboard: 'Панель офицера',
            officerDashboardDesc: 'Доступ к инструментам офицера и управлению делами',
            viewAnalytics: 'Просмотреть аналитику',
            viewAnalyticsDesc: 'Статистика преступности и тенденции',
            aiAssistant: 'ИИ-помощник',
            aiAssistantDesc: 'Получить помощь от ИИ-помощника'
          },
          cases: {
            theft: 'Кража',
            domesticDispute: 'Семейный спор',
            trafficViolation: 'Нарушение ПДД',
            cybercrime: 'Киберпреступление',
            underInvestigation: 'Расследуется',
            resolved: 'Решено',
            pending: 'В ожидании',
            high: 'Высокий',
            medium: 'Средний',
            low: 'Низкий'
          },
          userRoles: {
            citizen: 'Гражданин',
            officer: 'Офицер',
            admin: 'Администратор',
            loginAs: 'Войти как {{role}}'
          },
          login: {
            selectRole: 'Выберите Вашу Роль',
            selectRoleDesc: 'Выберите тип входа для доступа к соответствующей панели',
            backToLanguage: 'Назад к выбору языка',
            backToRoles: 'Назад к выбору роли',
            username: 'Имя пользователя / ID бейджа',
            password: 'Пароль',
            signIn: 'Войти как {{role}}',
            forgotPassword: 'Забыли пароль?',
            citizenDesc: 'Подавать жалобы, отслеживать дела, получать доступ к госуслугам',
            officerDesc: 'Управлять делами, использовать инструменты офицера, обновлять расследования',
            adminDesc: 'Администрирование системы, управление пользователями, аналитика',
            enterUsername: 'Введите имя пользователя',
            enterBadgeId: 'Введите ID бейджа',
            enterPassword: 'Введите пароль'
          }
        }
      }
    }
  });

export default i18n;

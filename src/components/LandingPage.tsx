
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import policeLogoPng from './police_logo.png';
import backJpeg from './back.jpeg';
import PoliceImage from './PoliceImage';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'kok', name: 'कोंकणी', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const LandingPage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${backJpeg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={policeLogoPng} 
              alt="Goa Police Logo" 
              className="w-20 h-20 mr-4 drop-shadow-lg"
            />
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                {t('common.goaPolice')}
              </h1>
              <p className="text-xl md:text-2xl text-orange-200 font-semibold">
                {t('common.nagarRakshak')}
              </p>
            </div>
          </div>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {t('landing.subtitle')}
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">{t('common.selectLanguage')}</h2>
            </div>
            <p className="text-white/80 text-lg">{t('common.chooseLanguage')}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <Link 
                to="/login" 
                key={lang.code} 
                onClick={() => changeLanguage(lang.code)} 
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center space-y-2 text-center"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-white font-medium group-hover:text-white transition-colors">
                  {lang.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            {t('common.poweredBy')}
          </p>
        </div>
      </div>

      {/* Interactive Police Image */}
      <PoliceImage />
    </div>
  );
};

export default LandingPage;

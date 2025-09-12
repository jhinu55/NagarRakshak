# Nagar Rakshak 2.0 - Goa Police Modernization System

## 🚔 Overview

Nagar Rakshak 2.0 is an AI-powered police modernization system designed for the Goa Police force. This comprehensive web application provides a multilingual platform for police operations, citizen services, and administrative management.

## ✨ Features

### 🌐 Multilingual Support
- **8 Languages**: English, Hindi, Marathi, Konkani, Kannada, French, German, and Russian
- **Native Scripts**: Proper display in local languages including Devanagari and Kannada scripts
- **Real-time Translation**: Instant language switching throughout the application

### 🏠 Landing Page
- Full-screen translucent background with Goa Police branding
- Interactive language selection with flag icons
- Beautiful glassmorphism design
- Official Goa Police logo integration

### 📊 Dashboard Features
- Real-time crime statistics and analytics
- Case management overview
- Quick action buttons for common tasks
- System status monitoring
- AI-powered insights

### 👥 Multi-Role Support
- **Citizens**: File complaints, track cases, access services
- **Officers**: Case management, evidence handling, reports
- **Administrators**: System oversight, analytics, user management

### 🤖 AI Integration
- AI-powered assistant for guidance and support
- Smart case categorization and priority assessment
- Automated report generation
- Voice recognition capabilities

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: React i18next
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/OmkarShr/NagarRakshak.git
cd NagarRakshak
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── LandingPage.tsx # Language selection and entry point
│   ├── Header.tsx      # Navigation and user management
│   ├── Dashboard.tsx   # Main dashboard
│   ├── CitizenPortal.tsx
│   ├── OfficerPortal.tsx
│   ├── CaseManagement.tsx
│   ├── Analytics.tsx
│   └── AIAssistant.tsx
├── lib/                # Utility libraries
├── i18n.ts            # Internationalization configuration
├── Home.tsx           # Main application component
└── App.tsx            # Router configuration
```

## 🌍 Supported Languages

| Language | Code | Script |
|----------|------|--------|
| English | en | Latin |
| Hindi | hi | Devanagari |
| Marathi | mr | Devanagari |
| Konkani | kok | Devanagari |
| Kannada | kn | Kannada |
| French | fr | Latin |
| German | de | Latin |
| Russian | ru | Cyrillic |

## 🎨 Design Features

- **Glassmorphism UI**: Modern, translucent design elements
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant design
- **Dark/Light Mode**: System preference detection
- **Police Branding**: Official Goa Police colors and logos

## 🔐 Security Features

- Role-based access control
- Secure authentication system
- Data encryption
- Audit logging
- Privacy protection compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Omkar Shrinivas**
- GitHub: [@OmkarShr](https://github.com/OmkarShr)

## 🙏 Acknowledgments

- Goa Police Department for their support and requirements
- The open-source community for the amazing tools and libraries
- All contributors who help improve this system

## 📞 Support

For support, email omkar@example.com or create an issue in this repository.

---

**Built with ❤️ for the people of Goa**
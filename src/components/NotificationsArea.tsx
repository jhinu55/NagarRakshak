import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  Trash2, 
  Check,
  Filter,
  Search,
  Zap
} from 'lucide-react';

interface NotificationsAreaProps {
  language: 'en' | 'hi' | 'kok';
  onBack: () => void;
  accessibilityMode: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  referenceNumber?: string;
}

const NotificationsArea: React.FC<NotificationsAreaProps> = ({ 
  language, 
  onBack 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const colors = {
    deepIndigo: '#2E3A59',
    teal: '#008080',
    amber: '#FFC107',
    whiteOpacity: 'rgba(255, 255, 255, 0.1)'
  };

  // Multi-language content
  const content = {
    en: {
      title: "Notifications",
      subtitle: "Stay updated with your complaint status",
      noNotifications: "No notifications yet",
      noNotificationsDesc: "You'll receive updates about your complaints here",
      markAllRead: "Mark All Read",
      clearAll: "Clear All",
      searchPlaceholder: "Search notifications...",
      filters: {
        all: "All",
        unread: "Unread",
        urgent: "Urgent"
      },
      types: {
        success: "Success",
        warning: "Warning", 
        info: "Information",
        urgent: "Urgent"
      },
      actions: {
        markRead: "Mark as Read",
        delete: "Delete",
        viewDetails: "View Details"
      },
      timeAgo: {
        now: "Just now",
        minutes: "minutes ago",
        hours: "hours ago",
        days: "days ago"
      }
    },
    hi: {
      title: "सूचनाएं",
      subtitle: "अपनी शिकायत की स्थिति से अपडेट रहें",
      noNotifications: "अभी तक कोई सूचना नहीं",
      noNotificationsDesc: "आपको अपनी शिकायतों के बारे में यहां अपडेट मिलेंगे",
      markAllRead: "सभी को पढ़ा हुआ मार्क करें",
      clearAll: "सभी साफ़ करें",
      searchPlaceholder: "सूचनाएं खोजें...",
      filters: {
        all: "सभी",
        unread: "अपठित",
        urgent: "तत्काल"
      },
      types: {
        success: "सफलता",
        warning: "चेतावनी",
        info: "जानकारी",
        urgent: "तत्काल"
      },
      actions: {
        markRead: "पढ़ा हुआ मार्क करें",
        delete: "मिटाएं",
        viewDetails: "विवरण देखें"
      },
      timeAgo: {
        now: "अभी-अभी",
        minutes: "मिनट पहले",
        hours: "घंटे पहले",
        days: "दिन पहले"
      }
    },
    kok: {
      title: "सूचना",
      subtitle: "तुमच्या तक्रारीच्या स्थितीशी अपडेट रावात",
      noNotifications: "अजून कोणती सूचना ना",
      noNotificationsDesc: "तुमकां तुमच्या तक्रारींविषीं हांगा अपडेट मेळटले",
      markAllRead: "सगळे वाचले म्हणून मार्क करात",
      clearAll: "सगळे साफ करात",
      searchPlaceholder: "सूचना सोदात...",
      filters: {
        all: "सगळे",
        unread: "नावाचलेले",
        urgent: "तातडीचे"
      },
      types: {
        success: "यश",
        warning: "चेतावणी",
        info: "माहिती",
        urgent: "तातडीचे"
      },
      actions: {
        markRead: "वाचले म्हणून मार्क करात",
        delete: "काडून टाकात",
        viewDetails: "तपशील पळोवात"
      },
      timeAgo: {
        now: "आताच",
        minutes: "मिनीट आदीं",
        hours: "वरां आदीं",
        days: "दीस आदीं"
      }
    }
  };

  const currentContent = content[language];

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Complaint Filed Successfully',
        message: 'Your complaint #NR12345678 has been successfully submitted and assigned to Inspector Rajesh Singh.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        actionable: true,
        referenceNumber: 'NR12345678'
      },
      {
        id: '2',
        type: 'info',
        title: 'Investigation Update',
        message: 'Evidence collection is in progress for your case. Expected completion by March 25, 2024.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        actionable: true,
        referenceNumber: 'NR12345678'
      },
      {
        id: '3',
        type: 'urgent',
        title: 'Urgent: Additional Information Required',
        message: 'Please provide witness contact details for case #NR12345678 within 48 hours.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false,
        actionable: true,
        referenceNumber: 'NR12345678'
      },
      {
        id: '4',
        type: 'warning',
        title: 'Scheduled Hearing',
        message: 'You have a scheduled hearing on March 30, 2024 at 10:00 AM at Panaji Police Station.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        actionable: false
      },
      {
        id: '5',
        type: 'success',
        title: 'Case Status Updated',
        message: 'Your complaint #NR87654321 has been marked as resolved. Please provide feedback.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: false,
        actionable: true,
        referenceNumber: 'NR87654321'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'urgent': return Zap;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 border-green-400/30 text-green-300';
      case 'warning': return 'bg-amber-500/20 border-amber-400/30 text-amber-300';
      case 'urgent': return 'bg-red-500/20 border-red-400/30 text-red-300';
      default: return 'bg-blue-500/20 border-blue-400/30 text-blue-300';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return currentContent.timeAgo.now;
    if (diffInMinutes < 60) return `${diffInMinutes} ${currentContent.timeAgo.minutes}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${currentContent.timeAgo.hours}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${currentContent.timeAgo.days}`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'urgent' && notification.type === 'urgent');
    
    const matchesSearch = searchTerm === '' || 
                         notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notification.referenceNumber && notification.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
            <div className="flex items-center justify-center space-x-2">
              <Bell className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">{currentContent.title}</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-white/70 text-sm">{currentContent.subtitle}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 text-white text-sm"
            >
              {currentContent.markAllRead}
            </button>
            <button
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md rounded-xl border border-red-400/30 transition-all duration-300 text-red-300 text-sm"
            >
              {currentContent.clearAll}
            </button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={currentContent.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              {Object.entries(currentContent.filters).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as 'all' | 'unread' | 'urgent')}
                  className={`px-4 py-3 rounded-xl backdrop-blur-md border transition-all duration-300 text-sm font-medium ${
                    filter === key
                      ? 'bg-amber-500 border-amber-400 text-white'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Filter className="w-4 h-4 inline mr-2" />
                  {label}
                  {key === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <main className="relative z-10 px-6 pb-6 flex-1">
        <div className="max-w-4xl mx-auto">
          {filteredNotifications.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-white/50" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{currentContent.noNotifications}</h3>
              <p className="text-white/70">{currentContent.noNotificationsDesc}</p>
            </div>
          ) : (
            /* Notifications */
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`relative p-6 backdrop-blur-md rounded-2xl border transition-all duration-300 hover:bg-white/15 ${
                      notification.read 
                        ? 'bg-white/5 border-white/20' 
                        : 'bg-white/10 border-white/30'
                    }`}
                  >
                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="absolute top-4 left-4 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                    )}

                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getNotificationColor(notification.type)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`font-semibold ${notification.read ? 'text-white/80' : 'text-white'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-white/60 text-xs flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className={`text-sm leading-relaxed mb-3 ${notification.read ? 'text-white/60' : 'text-white/80'}`}>
                          {notification.message}
                        </p>

                        {notification.referenceNumber && (
                          <div className="mb-3">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70 font-mono">
                              {notification.referenceNumber}
                            </span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 text-sm transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              <span>{currentContent.actions.markRead}</span>
                            </button>
                          )}
                          
                          {notification.actionable && (
                            <button className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 text-sm transition-colors">
                              <span>{currentContent.actions.viewDetails}</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="flex items-center space-x-1 text-red-400 hover:text-red-300 text-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>{currentContent.actions.delete}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsArea;
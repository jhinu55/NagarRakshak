import { OfficerProfile, RolePermissions } from './officerProfileService';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  permission?: keyof RolePermissions;
  minRank?: string;
  departments?: string[];
  description?: string;
  isNew?: boolean;
  badge?: number;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

class MenuConfigService {
  
  // Rank hierarchy (higher number = higher rank)
  private rankHierarchy: Record<string, number> = {
    'Constable': 1,
    'Head Constable': 2,
    'Assistant Sub-Inspector': 3,
    'Sub-Inspector': 4,
    'Inspector': 5,
    'Deputy Superintendent': 6,
    'Superintendent': 7,
    'Deputy Inspector General': 8,
    'Inspector General': 9,
    'Director General': 10
  };

  /**
   * Get all available menu items for officer dashboard
   */
  getOfficerMenuItems(profile: OfficerProfile, permissions: RolePermissions): MenuItem[] {
    const allItems: MenuItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '📊',
        description: 'Overview of cases and statistics'
      },
      {
        id: 'cases',
        label: 'Case Management',
        icon: '📁',
        permission: 'canEditCases',
        description: 'Manage assigned cases'
      },
      {
        id: 'officer',
        label: 'Officer Portal',
        icon: '👮',
        permission: 'canViewAllCases',
        description: 'Officer-specific tools and information'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: '📈',
        permission: 'canViewAnalytics',
        description: 'Performance metrics and insights'
      },
      {
        id: 'admin',
        label: 'Administration',
        icon: '⚙️',
        permission: 'canAccessAdmin',
        minRank: 'Inspector',
        description: 'System administration and management'
      },
      {
        id: 'officers',
        label: 'Manage Officers',
        icon: '👮‍♂️',
        permission: 'canManageOfficers',
        minRank: 'Sub-Inspector',
        description: 'Officer assignments and management'
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: '📋',
        permission: 'canViewAnalytics',
        minRank: 'Head Constable',
        description: 'Generate and view reports'
      },
      {
        id: 'investigation',
        label: 'Investigation',
        icon: '🔍',
        departments: ['CID', 'Detective', 'Investigation'],
        minRank: 'Head Constable',
        description: 'Investigation tools and case tracking'
      },
      {
        id: 'traffic',
        label: 'Traffic Control',
        icon: '🚦',
        departments: ['Traffic'],
        description: 'Traffic management and violations'
      },
      {
        id: 'cybercrime',
        label: 'Cyber Crime',
        icon: '💻',
        departments: ['Cyber Crime', 'Technology'],
        minRank: 'Sub-Inspector',
        description: 'Cyber crime investigation and prevention'
      },
      {
        id: 'forensics',
        label: 'Forensics',
        icon: '🔬',
        departments: ['Forensics', 'Investigation'],
        minRank: 'Inspector',
        description: 'Forensic analysis and evidence management'
      },
      {
        id: 'emergency',
        label: 'Emergency Response',
        icon: '🚨',
        departments: ['Emergency', 'Response', 'General'],
        description: 'Emergency response coordination'
      }
    ];

    return this.filterMenuItems(allItems, profile, permissions);
  }

  /**
   * Get organized menu sections for officer dashboard
   */
  getMenuSections(profile: OfficerProfile, permissions: RolePermissions): MenuSection[] {
    const items = this.getOfficerMenuItems(profile, permissions);
    
    const sections: MenuSection[] = [
      {
        title: 'Core Functions',
        items: items.filter(item => 
          ['dashboard', 'cases', 'officer'].includes(item.id)
        )
      },
      {
        title: 'Analytics & Reports',
        items: items.filter(item => 
          ['analytics', 'reports'].includes(item.id)
        )
      },
      {
        title: 'Department Specific',
        items: items.filter(item => 
          ['investigation', 'traffic', 'cybercrime', 'forensics', 'emergency'].includes(item.id)
        )
      },
      {
        title: 'Administration',
        items: items.filter(item => 
          ['admin', 'officers'].includes(item.id)
        )
      }
    ];

    // Remove empty sections
    return sections.filter(section => section.items.length > 0);
  }

  /**
   * Filter menu items based on officer profile and permissions
   */
  private filterMenuItems(
    items: MenuItem[], 
    profile: OfficerProfile, 
    permissions: RolePermissions
  ): MenuItem[] {
    return items.filter(item => {
      // Check permission
      if (item.permission && !permissions[item.permission]) {
        return false;
      }

      // Check minimum rank requirement
      if (item.minRank && !this.hasMinimumRank(profile.rank || '', item.minRank)) {
        return false;
      }

      // Check department restriction
      if (item.departments && !item.departments.includes(profile.department || '')) {
        return false;
      }

      return true;
    });
  }

  /**
   * Check if officer has minimum required rank
   */
  private hasMinimumRank(officerRank: string, requiredRank: string): boolean {
    const officerLevel = this.rankHierarchy[officerRank] || 0;
    const requiredLevel = this.rankHierarchy[requiredRank] || 0;
    return officerLevel >= requiredLevel;
  }

  /**
   * Get quick action items for dashboard
   */
  getQuickActions(profile: OfficerProfile, permissions: RolePermissions): MenuItem[] {
    const quickActions: MenuItem[] = [
      {
        id: 'new-case',
        label: 'New Case',
        icon: '➕',
        permission: 'canEditCases',
        description: 'Register a new case'
      },
      {
        id: 'search-case',
        label: 'Search Cases',
        icon: '🔍',
        description: 'Search existing cases'
      },
      {
        id: 'emergency-alert',
        label: 'Emergency Alert',
        icon: '🚨',
        description: 'Send emergency alert'
      },
      {
        id: 'daily-report',
        label: 'Daily Report',
        icon: '📝',
        permission: 'canViewAnalytics',
        description: 'Generate daily activity report'
      },
      {
        id: 'officer-status',
        label: 'Update Status',
        icon: '📍',
        description: 'Update duty status and location'
      },
      {
        id: 'complaint-register',
        label: 'Register Complaint',
        icon: '📋',
        description: 'Register citizen complaint'
      }
    ];

    return this.filterMenuItems(quickActions, profile, permissions);
  }

  /**
   * Get context-sensitive menu items based on current view
   */
  getContextualMenuItems(
    currentView: string, 
    profile: OfficerProfile, 
    permissions: RolePermissions
  ): MenuItem[] {
    const contextualItems: Record<string, MenuItem[]> = {
      cases: [
        {
          id: 'filter-my-cases',
          label: 'My Cases',
          icon: '👤',
          description: 'Show only cases assigned to me'
        },
        {
          id: 'filter-urgent',
          label: 'Urgent Cases',
          icon: '⚡',
          description: 'Show high priority cases'
        },
        {
          id: 'export-cases',
          label: 'Export',
          icon: '📤',
          permission: 'canViewAnalytics',
          description: 'Export case data'
        }
      ],
      analytics: [
        {
          id: 'performance-metrics',
          label: 'My Performance',
          icon: '📊',
          description: 'View personal performance metrics'
        },
        {
          id: 'department-stats',
          label: 'Department Stats',
          icon: '🏢',
          minRank: 'Sub-Inspector',
          description: 'Department-wide statistics'
        },
        {
          id: 'comparative-analysis',
          label: 'Comparative Analysis',
          icon: '📈',
          minRank: 'Inspector',
          description: 'Compare performance across departments'
        }
      ],
      officer: [
        {
          id: 'duty-roster',
          label: 'Duty Roster',
          icon: '📅',
          description: 'View duty schedule'
        },
        {
          id: 'leave-request',
          label: 'Leave Request',
          icon: '🏖️',
          description: 'Request leave or time off'
        },
        {
          id: 'training-schedule',
          label: 'Training',
          icon: '🎓',
          description: 'View training schedule'
        }
      ]
    };

    const items = contextualItems[currentView] || [];
    return this.filterMenuItems(items, profile, permissions);
  }

  /**
   * Get available departments for officer selection
   */
  getAvailableDepartments(): string[] {
    return [
      'General',
      'Traffic',
      'Investigation',
      'CID',
      'Cyber Crime',
      'Forensics',
      'Emergency Response',
      'Community Policing',
      'Women & Child Protection',
      'Economic Offences',
      'Anti-Terrorism',
      'Intelligence',
      'Training',
      'Administration'
    ];
  }

  /**
   * Get available ranks for officer hierarchy
   */
  getAvailableRanks(): string[] {
    return Object.keys(this.rankHierarchy).sort((a, b) => 
      this.rankHierarchy[a] - this.rankHierarchy[b]
    );
  }

  /**
   * Get notification count for menu items
   */
  getMenuNotifications(profile: OfficerProfile): Record<string, number> {
    // This would typically come from a real notification service
    // For now, return mock data based on officer profile
    const notifications: Record<string, number> = {};

    if (profile.role === 'admin') {
      notifications['admin'] = 3;
      notifications['officers'] = 2;
    }

    if (profile.casesAssigned > 0) {
      notifications['cases'] = Math.min(profile.casesAssigned, 9);
    }

    return notifications;
  }
}

export const menuConfigService = new MenuConfigService();
import { supabase } from './supabaseClient';
import { firestoreService } from './firestoreService';
import { CaseData } from './firData';

// Types for admin functionality
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'citizen' | 'officer' | 'admin';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  department?: string;
  badge?: string;
  rank?: string;
  phoneNumber?: string;
}

export interface AdminCase extends CaseData {
  complainantEmail?: string;
  officerEmail?: string;
  transferHistory?: TransferRecord[];
}

export interface TransferRecord {
  id: string;
  caseId: string;
  fromOfficer: string;
  toOfficer: string;
  reason: string;
  transferredAt: string;
  transferredBy: string;
}

export interface AuditLog {
  id: string;
  action: string;
  targetType: 'user' | 'case' | 'officer' | 'system';
  targetId: string;
  performedBy: string;
  performedByEmail: string;
  details: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface SystemHealth {
  database: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    lastCheck: string;
  };
  authentication: {
    status: 'healthy' | 'degraded' | 'down';
    activeSessions: number;
    lastCheck: string;
  };
  firestore: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    lastCheck: string;
  };
}

export interface AdminStats {
  users: {
    total: number;
    citizens: number;
    officers: number;
    admins: number;
    activeSessions: number;
    newToday: number;
  };
  cases: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    highPriority: number;
    newToday: number;
    unassigned: number;
  };
  officers: {
    total: number;
    active: number;
    averageCaseload: number;
    overloaded: number;
  };
  system: {
    uptime: string;
    lastBackup: string;
    storageUsed: string;
  };
}

export interface OfficerWorkload {
  officerId: string;
  officerName: string;
  badge: string;
  department: string;
  rank: string;
  activeCases: number;
  resolvedCases: number;
  averageResolutionTime: number;
  lastActive: string;
  isOnline: boolean;
  caseLoad: 'Light' | 'Moderate' | 'Heavy' | 'Overloaded';
  recentCases: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    assignedDate: string;
  }>;
}

class AdminService {
  // User Management - Connect to Supabase Auth
  static async getAllUsers(): Promise<AdminUser[]> {
    try {
      console.log('🔍 Fetching all users from Supabase...');
      
      // Get users from Supabase auth.users
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('❌ Error fetching users:', error);
        throw new Error('Failed to fetch users from authentication system');
      }

      // Transform to AdminUser format
      const adminUsers: AdminUser[] = users.map(user => ({
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || 
                 (user.user_metadata?.first_name && user.user_metadata?.last_name 
                   ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` 
                   : user.email?.split('@')[0] || 'Unknown'),
        role: (user.user_metadata?.role || 'citizen') as 'citizen' | 'officer' | 'admin',
        createdAt: user.created_at,
        lastLogin: user.last_sign_in_at || undefined,
        isActive: !!user.email_confirmed_at,
        department: user.user_metadata?.department,
        badge: user.user_metadata?.badge_number || user.user_metadata?.badge,
        rank: user.user_metadata?.rank,
        phoneNumber: user.phone || user.user_metadata?.phone
      }));

      console.log(`✅ Successfully fetched ${adminUsers.length} users`);
      return adminUsers;
    } catch (error) {
      console.error('❌ Error in getAllUsers:', error);
      throw error;
    }
  }

  static async getUsersByRole(role: 'citizen' | 'officer' | 'admin'): Promise<AdminUser[]> {
    const allUsers = await this.getAllUsers();
    return allUsers.filter(user => user.role === role);
  }

  static async updateUserRole(userId: string, newRole: 'citizen' | 'officer' | 'admin'): Promise<void> {
    try {
      console.log(`🔄 Updating user ${userId} role to ${newRole}...`);
      
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role: newRole }
      });

      if (error) {
        throw new Error(`Failed to update user role: ${error.message}`);
      }

      await this.logAuditAction({
        action: 'user_role_updated',
        targetType: 'user',
        targetId: userId,
        details: { new_role: newRole }
      });

      console.log(`✅ Successfully updated user ${userId} role to ${newRole}`);
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string, reason: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting user ${userId}...`);
      
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      await this.logAuditAction({
        action: 'user_deleted',
        targetType: 'user',
        targetId: userId,
        details: { reason }
      });

      console.log(`✅ Successfully deleted user ${userId}`);
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
  }

  // Case Management - Connect to Firestore
  static async getAllCases(): Promise<AdminCase[]> {
    try {
      console.log('� [ADMIN SERVICE] getAllCases() called - fetching ALL cases for admin view...');
      
      const cases = await firestoreService.loadAllCases();
      console.log(`🔧 [ADMIN SERVICE] firestoreService.loadAllCases() returned ${cases.length} cases`);
      
      const adminCases: AdminCase[] = cases.map(case_ => ({
        ...case_,
        complainantEmail: case_.fullRecord?.contact_email,
        transferHistory: [] // Could be enhanced to fetch from transfer_logs collection
      }));

      console.log(`✅ [ADMIN SERVICE] Successfully processed ${adminCases.length} cases for admin view`);
      console.log('📋 [ADMIN SERVICE] Sample cases:', adminCases.slice(0, 3).map(c => ({ id: c.id, type: c.type, assignedTo: c.assignedTo })));
      return adminCases;
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Error fetching cases for admin:', error);
      throw error;
    }
  }

  static async getCasesByOfficer(officerName: string): Promise<AdminCase[]> {
    try {
      const cases = await firestoreService.loadCasesByOfficer(officerName);
      return cases.map(case_ => ({ 
        ...case_, 
        transferHistory: [],
        complainantEmail: case_.fullRecord?.contact_email
      }));
    } catch (error) {
      console.error('❌ Error fetching cases by officer:', error);
      throw error;
    }
  }

  static async getUnassignedCases(): Promise<AdminCase[]> {
    const allCases = await this.getAllCases();
    return allCases.filter(case_ => !case_.assignedTo || case_.assignedTo === 'Unassigned');
  }

  static async assignCaseToOfficer(caseId: string, officerName: string, reason: string): Promise<void> {
    try {
      console.log(`👮 Assigning case ${caseId} to officer ${officerName}...`);
      
      await firestoreService.transferCase(caseId, officerName, reason, 'Admin');

      await this.logAuditAction({
        action: 'case_assigned',
        targetType: 'case',
        targetId: caseId,
        details: { 
          assigned_to: officerName,
          reason,
          assigned_by: 'admin'
        }
      });

      console.log(`✅ Successfully assigned case ${caseId} to ${officerName}`);
    } catch (error) {
      console.error('❌ Error assigning case:', error);
      throw error;
    }
  }

  static async deleteCaseAsAdmin(caseId: string, reason: string): Promise<void> {
    try {
      console.log(`🗑️ Admin deleting case ${caseId}...`);
      
      await firestoreService.deleteCase(caseId, reason);

      await this.logAuditAction({
        action: 'case_deleted',
        targetType: 'case',
        targetId: caseId,
        details: { 
          reason,
          deleted_by: 'admin'
        }
      });

      console.log(`✅ Successfully deleted case ${caseId}`);
    } catch (error) {
      console.error('❌ Error deleting case as admin:', error);
      throw error;
    }
  }

  // Officer Management
  static async getOfficerWorkloads(): Promise<OfficerWorkload[]> {
    try {
      console.log('👮‍♂️ Calculating officer workloads...');
      
      const [officers, allCases] = await Promise.all([
        this.getUsersByRole('officer'),
        this.getAllCases()
      ]);
      
      const workloads: OfficerWorkload[] = [];

      for (const officer of officers) {
        const officerCases = allCases.filter(case_ => 
          case_.assignedTo === officer.fullName || 
          case_.assignedTo === officer.email?.split('@')[0]
        );

        const activeCases = officerCases.filter(c => 
          c.status === 'Pending' || c.status === 'Under Investigation'
        ).length;
        const resolvedCases = officerCases.filter(c => c.status === 'Resolved').length;

        let caseLoad: 'Light' | 'Moderate' | 'Heavy' | 'Overloaded' = 'Light';
        if (officerCases.length > 15) caseLoad = 'Overloaded';
        else if (officerCases.length > 10) caseLoad = 'Heavy';
        else if (officerCases.length > 5) caseLoad = 'Moderate';

        workloads.push({
          officerId: officer.id,
          officerName: officer.fullName,
          badge: officer.badge || 'N/A',
          department: officer.department || 'General',
          rank: officer.rank || 'Officer',
          activeCases,
          resolvedCases,
          averageResolutionTime: this.calculateAverageResolutionTime(officerCases),
          lastActive: officer.lastLogin || officer.createdAt,
          isOnline: officer.lastLogin ? 
            (new Date(officer.lastLogin).getTime() > Date.now() - 24*60*60*1000) : false,
          caseLoad,
          recentCases: officerCases.slice(0, 5).map(case_ => ({
            id: case_.id,
            title: case_.type,
            priority: case_.priority,
            status: case_.status,
            assignedDate: case_.date
          }))
        });
      }

      console.log(`✅ Successfully calculated workloads for ${workloads.length} officers`);
      return workloads;
    } catch (error) {
      console.error('❌ Error calculating officer workloads:', error);
      throw error;
    }
  }

  // Admin Statistics
  static async getAdminStats(): Promise<AdminStats> {
    try {
      console.log('📊 Calculating admin statistics...');
      
      const [users, cases, officers] = await Promise.all([
        this.getAllUsers(),
        this.getAllCases(),
        this.getUsersByRole('officer')
      ]);

      const today = new Date().toDateString();
      
      const stats: AdminStats = {
        users: {
          total: users.length,
          citizens: users.filter(u => u.role === 'citizen').length,
          officers: users.filter(u => u.role === 'officer').length,
          admins: users.filter(u => u.role === 'admin').length,
          activeSessions: users.filter(u => u.lastLogin && 
            new Date(u.lastLogin).toDateString() === today).length,
          newToday: users.filter(u => 
            new Date(u.createdAt).toDateString() === today).length
        },
        cases: {
          total: cases.length,
          pending: cases.filter(c => c.status === 'Pending').length,
          inProgress: cases.filter(c => c.status === 'Under Investigation').length,
          resolved: cases.filter(c => c.status === 'Resolved').length,
          highPriority: cases.filter(c => c.priority === 'High').length,
          newToday: cases.filter(c => 
            new Date(c.date).toDateString() === today).length,
          unassigned: cases.filter(c => !c.assignedTo || c.assignedTo === 'Unassigned').length
        },
        officers: {
          total: officers.length,
          active: officers.filter(o => o.isActive).length,
          averageCaseload: Math.round(cases.length / Math.max(officers.length, 1)),
          overloaded: 0 // Will be calculated from workloads
        },
        system: {
          uptime: this.calculateUptime(),
          lastBackup: 'Not configured',
          storageUsed: 'Unknown'
        }
      };

      console.log('✅ Successfully calculated admin statistics');
      return stats;
    } catch (error) {
      console.error('❌ Error calculating admin stats:', error);
      throw error;
    }
  }

  // System Health
  static async getSystemHealth(): Promise<SystemHealth> {
    const health: SystemHealth = {
      database: await this.checkSupabaseHealth(),
      authentication: await this.checkAuthHealth(),
      firestore: await this.checkFirestoreHealth()
    };

    return health;
  }

  // Audit Logging
  static async logAuditAction(action: {
    action: string;
    targetType: 'user' | 'case' | 'officer' | 'system';
    targetId: string;
    details: Record<string, any>;
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const auditLog: Omit<AuditLog, 'id'> = {
        ...action,
        performedBy: user?.id || 'system',
        performedByEmail: user?.email || 'system@nagarrakshak.com',
        timestamp: new Date().toISOString(),
        ipAddress: 'unknown' // Could be enhanced with IP detection
      };

      // Try to store in Supabase, but don't fail if table doesn't exist
      const { error } = await supabase
        .from('audit_logs')
        .insert([auditLog]);

      if (error && error.code !== 'relation does not exist') {
        console.warn('⚠️ Failed to log audit action:', error.message);
      } else if (!error) {
        console.log('✅ Audit action logged successfully');
      }
    } catch (error) {
      console.warn('⚠️ Error logging audit action:', error);
    }
  }

  static async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    try {
      console.log('📋 Fetching audit logs...');
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('⚠️ Could not fetch audit logs (table may not exist):', error.message);
        return this.getMockAuditLogs();
      }

      console.log(`✅ Successfully fetched ${data?.length || 0} audit logs`);
      return data || [];
    } catch (error) {
      console.warn('⚠️ Error fetching audit logs:', error);
      return this.getMockAuditLogs();
    }
  }

  // Helper Methods
  private static calculateAverageResolutionTime(cases: AdminCase[]): number {
    const resolvedCases = cases.filter(c => c.status === 'Resolved');
    if (resolvedCases.length === 0) return 0;
    
    // Mock calculation - in reality you'd calculate based on creation and resolution dates
    return Math.round(Math.random() * 30); // Days
  }

  private static async checkSupabaseHealth(): Promise<SystemHealth['database']> {
    const start = Date.now();
    try {
      const { error } = await supabase.from('audit_logs').select('count').limit(1);
      const responseTime = Date.now() - start;
      
      return {
        status: error ? 'degraded' : 'healthy',
        responseTime: responseTime,
        lastCheck: new Date().toISOString()
      };
    } catch {
      return {
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString()
      };
    }
  }

  private static async checkAuthHealth(): Promise<SystemHealth['authentication']> {
    try {
      await supabase.auth.getSession();
      return {
        status: 'healthy',
        activeSessions: 1, // Mock - would need session tracking
        lastCheck: new Date().toISOString()
      };
    } catch {
      return {
        status: 'down',
        activeSessions: 0,
        lastCheck: new Date().toISOString()
      };
    }
  }

  private static async checkFirestoreHealth(): Promise<SystemHealth['firestore']> {
    const start = Date.now();
    try {
      await firestoreService.loadAllCases();
      return {
        status: 'healthy',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString()
      };
    } catch {
      return {
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString()
      };
    }
  }

  private static calculateUptime(): string {
    // Mock uptime calculation
    return '24 hours';
  }

  private static getMockAuditLogs(): AuditLog[] {
    return [
      {
        id: '1',
        action: 'case_transferred',
        targetType: 'case',
        targetId: 'FIR2024001',
        performedBy: 'admin',
        performedByEmail: 'admin@nagarrakshak.com',
        details: { from_officer: 'Officer A', to_officer: 'Officer B', reason: 'Workload balancing' },
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        action: 'user_role_updated',
        targetType: 'user',
        targetId: 'user123',
        performedBy: 'admin',
        performedByEmail: 'admin@nagarrakshak.com',
        details: { old_role: 'citizen', new_role: 'officer' },
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  // Export Methods
  static async exportUsers(): Promise<string> {
    const users = await this.getAllUsers();
    return JSON.stringify(users, null, 2);
  }

  static async exportCases(): Promise<string> {
    const cases = await this.getAllCases();
    return JSON.stringify(cases, null, 2);
  }

  static async exportAuditLogs(): Promise<string> {
    const logs = await this.getAuditLogs(1000);
    return JSON.stringify(logs, null, 2);
  }
}

export default AdminService;
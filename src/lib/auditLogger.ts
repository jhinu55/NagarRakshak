export interface AuditAction {
  action: 'case_created' | 'case_assigned' | 'case_transferred' | 'case_deleted' | 'case_updated' | 'officer_created' | 'officer_updated' | 'user_created';
  performedBy: string;
  targetId: string;
  targetType: 'case' | 'user' | 'officer';
  details: Record<string, any>;
}

class AuditLogger {
  // Log any administrative action
  static async logAction(actionData: AuditAction): Promise<void> {
    try {
      // For now, just console log - in production this would save to database
      console.log('🔍 Audit Log:', {
        ...actionData,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      });
      
      // TODO: Save to Supabase audit_logs table
      // await supabase.from('audit_logs').insert({
      //   ...actionData,
      //   timestamp: new Date().toISOString(),
      //   performed_by_name: 'Get from user lookup',
      //   performed_by_role: 'Get from user lookup',
      //   ip_address: 'Get from request'
      // });
      
    } catch (error) {
      console.error('❌ Failed to log audit action:', error);
      // Don't throw error for logging failures
    }
  }

  // Helper methods for common actions
  static async logCaseCreated(caseId: string, userId: string, caseDetails: any): Promise<void> {
    await this.logAction({
      action: 'case_created',
      performedBy: userId,
      targetId: caseId,
      targetType: 'case',
      details: {
        caseTitle: caseDetails.title,
        priority: caseDetails.priority,
        category: caseDetails.category,
        complainant: caseDetails.complainantName
      }
    });
  }

  static async logCaseAssigned(caseId: string, officerId: string, adminUserId: string, caseTitle: string): Promise<void> {
    await this.logAction({
      action: 'case_assigned',
      performedBy: adminUserId,
      targetId: caseId,
      targetType: 'case',
      details: {
        assignedToOfficer: officerId,
        caseTitle: caseTitle,
        assignedAt: new Date().toISOString()
      }
    });
  }

  static async logCaseTransferred(caseId: string, fromOfficerId: string, toOfficerId: string, adminUserId: string, reason?: string): Promise<void> {
    await this.logAction({
      action: 'case_transferred',
      performedBy: adminUserId,
      targetId: caseId,
      targetType: 'case',
      details: {
        fromOfficer: fromOfficerId,
        toOfficer: toOfficerId,
        reason: reason || 'Administrative transfer',
        transferredAt: new Date().toISOString()
      }
    });
  }

  static async logCaseDeleted(caseId: string, adminUserId: string, reason: string, caseTitle: string): Promise<void> {
    await this.logAction({
      action: 'case_deleted',
      performedBy: adminUserId,
      targetId: caseId,
      targetType: 'case',
      details: {
        reason: reason,
        caseTitle: caseTitle,
        deletedAt: new Date().toISOString()
      }
    });
  }

  static async logCaseUpdated(caseId: string, userId: string, changes: any): Promise<void> {
    await this.logAction({
      action: 'case_updated',
      performedBy: userId,
      targetId: caseId,
      targetType: 'case',
      details: {
        changes: changes,
        updatedAt: new Date().toISOString()
      }
    });
  }

  static async logOfficerCreated(officerId: string, adminUserId: string, officerData: any): Promise<void> {
    await this.logAction({
      action: 'officer_created',
      performedBy: adminUserId,
      targetId: officerId,
      targetType: 'officer',
      details: {
        officerName: officerData.fullName,
        badge: officerData.badge,
        department: officerData.department,
        rank: officerData.rank,
        createdAt: new Date().toISOString()
      }
    });
  }

  static async logUserCreated(userId: string, adminUserId: string, userData: any): Promise<void> {
    await this.logAction({
      action: 'user_created',
      performedBy: adminUserId,
      targetId: userId,
      targetType: 'user',
      details: {
        userName: userData.fullName,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString()
      }
    });
  }
}

export default AuditLogger;
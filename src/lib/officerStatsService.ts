import { firestoreService } from './firestoreService';
import { CaseData } from './firData';

export interface OfficerStats {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  urgentCases: number;
  pendingCases: number;
  underInvestigationCases: number;
  recentCases: CaseData[];
  completionRate: number;
  averageResolutionTime: number;
  todaysNewCases: number;
  thisWeekProgress: number;
}

export interface SystemStatus {
  database: 'online' | 'offline' | 'maintenance';
  aiServices: 'online' | 'offline' | 'maintenance';
  voiceRecognition: 'online' | 'offline' | 'maintenance';
  lastUpdate: string;
  uptime: string;
}

class OfficerStatsService {
  
  /**
   * Get comprehensive statistics for a specific officer
   */
  async getOfficerStats(officerName: string): Promise<OfficerStats> {
    try {
      console.log(`📊 Fetching stats for officer: ${officerName}`);
      
      // Load all cases assigned to the officer
      const officerCases = await firestoreService.loadCasesByOfficer(officerName);
      
      // Calculate statistics
      const totalCases = officerCases.length;
      const activeCases = officerCases.filter(c => 
        c.status === 'Under Investigation' || c.status === 'Pending'
      ).length;
      const resolvedCases = officerCases.filter(c => c.status === 'Resolved').length;
      const urgentCases = officerCases.filter(c => c.priority === 'High').length;
      const pendingCases = officerCases.filter(c => c.status === 'Pending').length;
      const underInvestigationCases = officerCases.filter(c => c.status === 'Under Investigation').length;
      
      // Get recent cases (last 5)
      const recentCases = officerCases
        .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        .slice(0, 5);
      
      // Calculate completion rate
      const completionRate = totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;
      
      // Calculate average resolution time (days)
      const resolvedCasesWithTimes = officerCases
        .filter(c => c.status === 'Resolved')
        .map(c => this.calculateResolutionTime(c));
      
      const averageResolutionTime = resolvedCasesWithTimes.length > 0
        ? Math.round(resolvedCasesWithTimes.reduce((a, b) => a + b, 0) / resolvedCasesWithTimes.length)
        : 0;
      
      // Calculate today's new cases
      const today = new Date().toISOString().split('T')[0];
      const todaysNewCases = officerCases.filter(c => c.date === today).length;
      
      // Calculate this week's progress (dummy calculation based on resolved cases)
      const thisWeekProgress = Math.min(resolvedCases * 10, 100);
      
      const stats: OfficerStats = {
        totalCases,
        activeCases,
        resolvedCases,
        urgentCases,
        pendingCases,
        underInvestigationCases,
        recentCases,
        completionRate,
        averageResolutionTime,
        todaysNewCases,
        thisWeekProgress
      };
      
      console.log(`✅ Stats calculated for ${officerName}:`, stats);
      return stats;
      
    } catch (error) {
      console.error(`❌ Error fetching stats for officer ${officerName}:`, error);
      throw new Error('Failed to fetch officer statistics');
    }
  }
  
  /**
   * Get global statistics (all officers)
   */
  async getGlobalStats(): Promise<OfficerStats> {
    try {
      console.log('📊 Fetching global police department stats');
      
      // Load all cases from the database
      const allCases = await firestoreService.loadAllCases();
      
      // Calculate global statistics
      const totalCases = allCases.length;
      const activeCases = allCases.filter(c => 
        c.status === 'Under Investigation' || c.status === 'Pending'
      ).length;
      const resolvedCases = allCases.filter(c => c.status === 'Resolved').length;
      const urgentCases = allCases.filter(c => c.priority === 'High').length;
      const pendingCases = allCases.filter(c => c.status === 'Pending').length;
      const underInvestigationCases = allCases.filter(c => c.status === 'Under Investigation').length;
      
      // Get recent cases (last 10 for global view)
      const recentCases = allCases
        .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        .slice(0, 10);
      
      // Calculate completion rate
      const completionRate = totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;
      
      // Calculate average resolution time (days)
      const resolvedCasesWithTimes = allCases
        .filter(c => c.status === 'Resolved')
        .map(c => this.calculateResolutionTime(c));
      
      const averageResolutionTime = resolvedCasesWithTimes.length > 0
        ? Math.round(resolvedCasesWithTimes.reduce((a, b) => a + b, 0) / resolvedCasesWithTimes.length)
        : 0;
      
      // Calculate today's new cases
      const today = new Date().toISOString().split('T')[0];
      const todaysNewCases = allCases.filter(c => c.date === today).length;
      
      // Calculate this week's progress
      const thisWeekProgress = Math.min(resolvedCases * 2, 100);
      
      const stats: OfficerStats = {
        totalCases,
        activeCases,
        resolvedCases,
        urgentCases,
        pendingCases,
        underInvestigationCases,
        recentCases,
        completionRate,
        averageResolutionTime,
        todaysNewCases,
        thisWeekProgress
      };
      
      console.log('✅ Global stats calculated:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Error fetching global stats:', error);
      throw new Error('Failed to fetch global statistics');
    }
  }
  
  /**
   * Calculate resolution time in days for a resolved case
   */
  private calculateResolutionTime(caseData: CaseData): number {
    try {
      const caseDate = new Date(caseData.date);
      const lastUpdate = new Date(caseData.lastUpdate.replace(' ago', ''));
      const diffTime = Math.abs(lastUpdate.getTime() - caseDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      // Fallback to a reasonable default if date parsing fails
      return 7;
    }
  }
  
  /**
   * Get system status information
   */
  async getSystemStatus(): Promise<SystemStatus> {
    try {
      // Test database connectivity
      const databaseStatus = await this.testDatabaseConnection();
      
      // For demo purposes, AI services and voice recognition are always online
      // In production, you would test actual service endpoints
      const aiServicesStatus: 'online' | 'offline' | 'maintenance' = 'online';
      const voiceRecognitionStatus: 'online' | 'offline' | 'maintenance' = 'online';
      
      const systemStatus: SystemStatus = {
        database: databaseStatus,
        aiServices: aiServicesStatus,
        voiceRecognition: voiceRecognitionStatus,
        lastUpdate: new Date().toISOString(),
        uptime: this.calculateUptime()
      };
      
      return systemStatus;
    } catch (error) {
      console.error('❌ Error getting system status:', error);
      return {
        database: 'offline',
        aiServices: 'offline',
        voiceRecognition: 'offline',
        lastUpdate: new Date().toISOString(),
        uptime: '0d 0h 0m'
      };
    }
  }
  
  /**
   * Test database connection
   */
  private async testDatabaseConnection(): Promise<'online' | 'offline' | 'maintenance'> {
    try {
      await firestoreService.loadAllCases();
      return 'online';
    } catch (error) {
      console.error('Database connection test failed:', error);
      return 'offline';
    }
  }
  
  /**
   * Calculate system uptime (mock implementation)
   */
  private calculateUptime(): string {
    // In production, this would calculate actual server uptime
    // For demo, return a reasonable uptime
    const days = Math.floor(Math.random() * 30) + 1;
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${days}d ${hours}h ${minutes}m`;
  }
  
  /**
   * Get case statistics by status
   */
  async getCaseStatsByStatus(officerName?: string): Promise<Record<string, number>> {
    try {
      const cases = officerName 
        ? await firestoreService.loadCasesByOfficer(officerName)
        : await firestoreService.loadAllCases();
      
      const stats = {
        'Pending': 0,
        'Under Investigation': 0,
        'Resolved': 0,
        'Total': cases.length
      };
      
      cases.forEach(caseData => {
        if (stats.hasOwnProperty(caseData.status)) {
          stats[caseData.status]++;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting case stats by status:', error);
      throw error;
    }
  }
  
  /**
   * Get case statistics by priority
   */
  async getCaseStatsByPriority(officerName?: string): Promise<Record<string, number>> {
    try {
      const cases = officerName 
        ? await firestoreService.loadCasesByOfficer(officerName)
        : await firestoreService.loadAllCases();
      
      const stats = {
        'High': 0,
        'Medium': 0,
        'Low': 0,
        'Total': cases.length
      };
      
      cases.forEach(caseData => {
        if (stats.hasOwnProperty(caseData.priority)) {
          stats[caseData.priority]++;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting case stats by priority:', error);
      throw error;
    }
  }
  
  /**
   * Get performance metrics for an officer
   */
  async getOfficerPerformanceMetrics(officerName: string): Promise<{
    casesThisMonth: number;
    casesLastMonth: number;
    growthRate: number;
    averageTimeToResolve: number;
    successRate: number;
  }> {
    try {
      const cases = await firestoreService.loadCasesByOfficer(officerName);
      
      const now = new Date();
      const thisMonth = now.getMonth();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      
      const casesThisMonth = cases.filter(c => {
        const caseDate = new Date(c.date);
        return caseDate.getMonth() === thisMonth;
      }).length;
      
      const casesLastMonth = cases.filter(c => {
        const caseDate = new Date(c.date);
        return caseDate.getMonth() === lastMonth;
      }).length;
      
      const growthRate = casesLastMonth > 0 
        ? Math.round(((casesThisMonth - casesLastMonth) / casesLastMonth) * 100)
        : 0;
      
      const resolvedCases = cases.filter(c => c.status === 'Resolved');
      const averageTimeToResolve = resolvedCases.length > 0
        ? resolvedCases.reduce((acc, c) => acc + this.calculateResolutionTime(c), 0) / resolvedCases.length
        : 0;
      
      const successRate = cases.length > 0 
        ? Math.round((resolvedCases.length / cases.length) * 100)
        : 0;
      
      return {
        casesThisMonth,
        casesLastMonth,
        growthRate,
        averageTimeToResolve: Math.round(averageTimeToResolve),
        successRate
      };
    } catch (error) {
      console.error('❌ Error getting performance metrics:', error);
      throw error;
    }
  }
}

export const officerStatsService = new OfficerStatsService();
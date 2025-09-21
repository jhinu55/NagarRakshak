import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';
import { CaseData } from './firData';
import { OfficerStats } from './officerStatsService';

export interface RealtimeUpdate {
  type: 'case_added' | 'case_updated' | 'case_deleted' | 'case_transferred' | 'stats_updated';
  data: any;
  timestamp: string;
  officerId?: string;
}

export interface RealtimeSubscription {
  id: string;
  unsubscribe: Unsubscribe;
  type: 'cases' | 'stats' | 'notifications';
}

class RealtimeDataService {
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  private updateCallbacks: Map<string, (update: RealtimeUpdate) => void> = new Map();

  /**
   * Subscribe to real-time case updates for a specific officer
   */
  subscribeToCaseUpdates(
    officerName: string, 
    callback: (cases: CaseData[]) => void
  ): string {
    const subscriptionId = `cases_${officerName}_${Date.now()}`;
    
    try {
      console.log(`📡 Setting up real-time subscription for officer: ${officerName}`);
      
      // Query for cases assigned to the officer
      const casesRef = collection(db, 'firs');
      const q = query(
        casesRef,
        where('officer_assigned', '==', officerName),
        orderBy('created_at', 'desc')
      );
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(`🔄 Real-time update received: ${snapshot.docs.length} cases for ${officerName}`);
          
          const cases: CaseData[] = [];
          snapshot.docs.forEach((doc) => {
            try {
              // Transform the FIR data to CaseData format (reusing logic from firestoreService)
              const caseData = this.transformFirestoreDocToCaseData(doc);
              cases.push(caseData);
            } catch (error) {
              console.error('Error transforming case data:', error);
            }
          });
          
          // Call the callback with updated cases
          callback(cases);
          
          // Trigger update notification
          this.triggerUpdateCallback(subscriptionId, {
            type: 'case_updated',
            data: { cases, officerName },
            timestamp: new Date().toISOString(),
            officerId: officerName
          });
        },
        (error) => {
          console.error(`❌ Real-time subscription error for ${officerName}:`, error);
        }
      );
      
      // Store subscription
      this.subscriptions.set(subscriptionId, {
        id: subscriptionId,
        unsubscribe,
        type: 'cases'
      });
      
      console.log(`✅ Real-time subscription established: ${subscriptionId}`);
      return subscriptionId;
      
    } catch (error) {
      console.error('Failed to set up real-time case subscription:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time statistics updates
   */
  subscribeToStatsUpdates(
    officerName: string, 
    callback: (stats: Partial<OfficerStats>) => void
  ): string {
    const subscriptionId = `stats_${officerName}_${Date.now()}`;
    
    try {
      console.log(`📊 Setting up real-time stats subscription for: ${officerName}`);
      
      // Listen to all FIR changes to recalculate stats
      const casesRef = collection(db, 'firs');
      const q = query(casesRef, orderBy('created_at', 'desc'));
      
      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          console.log(`📈 Stats update triggered by ${snapshot.docChanges().length} case changes`);
          
          try {
            // Recalculate stats when any case changes
            const { officerStatsService } = await import('./officerStatsService');
            const updatedStats = await officerStatsService.getOfficerStats(officerName);
            
            callback(updatedStats);
            
            // Trigger update notification
            this.triggerUpdateCallback(subscriptionId, {
              type: 'stats_updated',
              data: updatedStats,
              timestamp: new Date().toISOString(),
              officerId: officerName
            });
            
          } catch (error) {
            console.error('Error recalculating stats:', error);
          }
        },
        (error) => {
          console.error(`❌ Real-time stats subscription error:`, error);
        }
      );
      
      // Store subscription
      this.subscriptions.set(subscriptionId, {
        id: subscriptionId,
        unsubscribe,
        type: 'stats'
      });
      
      console.log(`✅ Real-time stats subscription established: ${subscriptionId}`);
      return subscriptionId;
      
    } catch (error) {
      console.error('Failed to set up real-time stats subscription:', error);
      throw error;
    }
  }

  /**
   * Subscribe to recent case updates (for dashboard recent cases)
   */
  subscribeToRecentCases(
    limit_count: number,
    callback: (cases: CaseData[]) => void
  ): string {
    const subscriptionId = `recent_cases_${Date.now()}`;
    
    try {
      console.log(`📋 Setting up real-time subscription for ${limit_count} recent cases`);
      
      const casesRef = collection(db, 'firs');
      const q = query(
        casesRef,
        orderBy('created_at', 'desc'),
        limit(limit_count)
      );
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(`🔄 Recent cases update: ${snapshot.docs.length} cases`);
          
          const cases: CaseData[] = [];
          snapshot.docs.forEach((doc) => {
            try {
              const caseData = this.transformFirestoreDocToCaseData(doc);
              cases.push(caseData);
            } catch (error) {
              console.error('Error transforming recent case data:', error);
            }
          });
          
          callback(cases);
          
          // Trigger update notification
          this.triggerUpdateCallback(subscriptionId, {
            type: 'case_updated',
            data: { cases },
            timestamp: new Date().toISOString()
          });
        },
        (error) => {
          console.error(`❌ Real-time recent cases subscription error:`, error);
        }
      );
      
      // Store subscription
      this.subscriptions.set(subscriptionId, {
        id: subscriptionId,
        unsubscribe,
        type: 'cases'
      });
      
      return subscriptionId;
      
    } catch (error) {
      console.error('Failed to set up real-time recent cases subscription:', error);
      throw error;
    }
  }

  /**
   * Subscribe to case transfer notifications
   */
  subscribeToTransferNotifications(
    officerName: string,
    callback: (transfers: any[]) => void
  ): string {
    const subscriptionId = `transfers_${officerName}_${Date.now()}`;
    
    try {
      console.log(`🔄 Setting up transfer notifications for: ${officerName}`);
      
      const transfersRef = collection(db, 'transfer_logs');
      const q = query(
        transfersRef,
        where('toOfficer', '==', officerName),
        orderBy('transferredAt', 'desc'),
        limit(10)
      );
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const transfers: any[] = [];
          snapshot.docs.forEach((doc) => {
            transfers.push({ id: doc.id, ...doc.data() });
          });
          
          callback(transfers);
          
          // Trigger update notification for new transfers
          if (snapshot.docChanges().some(change => change.type === 'added')) {
            this.triggerUpdateCallback(subscriptionId, {
              type: 'case_transferred',
              data: { transfers, officerName },
              timestamp: new Date().toISOString(),
              officerId: officerName
            });
          }
        },
        (error) => {
          console.error(`❌ Transfer notifications subscription error:`, error);
        }
      );
      
      // Store subscription
      this.subscriptions.set(subscriptionId, {
        id: subscriptionId,
        unsubscribe,
        type: 'notifications'
      });
      
      return subscriptionId;
      
    } catch (error) {
      console.error('Failed to set up transfer notifications:', error);
      throw error;
    }
  }

  /**
   * Register a callback for general update notifications
   */
  registerUpdateCallback(id: string, callback: (update: RealtimeUpdate) => void): void {
    this.updateCallbacks.set(id, callback);
  }

  /**
   * Unregister an update callback
   */
  unregisterUpdateCallback(id: string): void {
    this.updateCallbacks.delete(id);
  }

  /**
   * Trigger update callbacks
   */
  private triggerUpdateCallback(_subscriptionId: string, update: RealtimeUpdate): void {
    this.updateCallbacks.forEach((callback, id) => {
      try {
        callback(update);
      } catch (error) {
        console.error(`Error in update callback ${id}:`, error);
      }
    });
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      console.log(`🔕 Unsubscribed from real-time updates: ${subscriptionId}`);
    }
  }

  /**
   * Unsubscribe from all real-time updates
   */
  unsubscribeAll(): void {
    console.log(`🔕 Unsubscribing from ${this.subscriptions.size} real-time subscriptions`);
    
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    
    this.subscriptions.clear();
    this.updateCallbacks.clear();
  }

  /**
   * Get active subscription count
   */
  getActiveSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  /**
   * Get active subscriptions info
   */
  getActiveSubscriptions(): { id: string; type: string }[] {
    return Array.from(this.subscriptions.values()).map(sub => ({
      id: sub.id,
      type: sub.type
    }));
  }

  /**
   * Transform Firestore document to CaseData (reusing logic from firestoreService)
   */
  private transformFirestoreDocToCaseData(doc: any): CaseData {
    const data = doc.data();
    
    // Import the transformation logic from firestoreService
    const record = {
      victim_full_name: data.victim_full_name,
      contact_phone: data.contact_phone,
      incident_type: data.incident_type,
      incident_datetime: data.incident_datetime,
      incident_location_address: data.incident_location_address,
      incident_description: data.incident_description,
      suspect_names: data.suspect_names || [],
      witness_names_contacts: data.witness_names_contacts || null,
      property_details: data.property_details,
      contact_email: data.contact_email,
      fir_number: data.fir_number,
      created_at: data.created_at,
      officer_assigned: data.officer_assigned
    };

    // Generate case data using similar logic as firestoreService
    return {
      id: record.fir_number,
      type: record.incident_type,
      status: this.generateStatus(record),
      priority: this.generatePriority(record.incident_type),
      complainant: record.victim_full_name,
      location: record.incident_location_address,
      date: this.formatDate(record.incident_datetime),
      assignedTo: record.officer_assigned || 'Unassigned',
      description: record.incident_description,
      progress: this.generateProgress(record),
      lastUpdate: this.generateLastUpdate(record.created_at),
      fullRecord: record
    };
  }

  // Helper methods (copied from firestoreService for consistency)
  private generateStatus(record: any): string {
    const caseAge = this.getDaysFromCreation(record.created_at);
    const caseType = record.incident_type.toLowerCase();
    
    if (caseType.includes('missing') || caseType.includes('violence') || caseType.includes('assault')) {
      if (caseAge > 7) return 'Under Investigation';
      return 'Pending';
    }
    
    if (caseType.includes('theft') || caseType.includes('fraud')) {
      if (caseAge > 15) return 'Resolved';
      if (caseAge > 5) return 'Under Investigation';
      return 'Pending';
    }
    
    if (caseAge > 20) return 'Resolved';
    if (caseAge > 3) return 'Under Investigation';
    return 'Pending';
  }

  private generatePriority(incidentType: string): string {
    const type = incidentType.toLowerCase();
    
    if (type.includes('missing') || type.includes('violence') || type.includes('assault') || 
        type.includes('harassment') || type.includes('drug') || type.includes('extortion')) {
      return 'High';
    }
    
    if (type.includes('fraud') || type.includes('theft') || type.includes('accident') || 
        type.includes('stalking') || type.includes('dowry')) {
      return 'Medium';
    }
    
    return 'Low';
  }

  private generateProgress(record: any): number {
    const status = this.generateStatus(record);
    const caseAge = this.getDaysFromCreation(record.created_at);
    
    switch (status) {
      case 'Resolved':
        return 100;
      case 'Under Investigation':
        return Math.min(Math.max(30 + (caseAge * 5), 30), 95);
      case 'Pending':
        return Math.min(Math.max(10 + (caseAge * 2), 10), 30);
      default:
        return 0;
    }
  }

  private generateLastUpdate(createdAt: string): string {
    const created = new Date(createdAt);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  }

  private getDaysFromCreation(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }

  private formatDate(datetime: string): string {
    const date = new Date(datetime);
    return date.toISOString().split('T')[0];
  }
}

export const realtimeDataService = new RealtimeDataService();
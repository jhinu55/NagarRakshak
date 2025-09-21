import { User } from '@supabase/supabase-js';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export interface OfficerProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'officer' | 'admin' | 'citizen';
  badge?: string;
  department?: string;
  rank?: string;
  station?: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'on-leave' | 'off-duty';
  lastLogin: string;
  joinDate: string;
  permissions: string[];
  casesAssigned: number;
  casesResolved: number;
  isOnline: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  shift?: {
    start: string;
    end: string;
    type: 'day' | 'night' | 'rotating';
  };
  createdAt: string;
  updatedAt: string;
}

export interface OfficerActivity {
  id: string;
  officerId: string;
  action: string;
  timestamp: string;
  details: string;
  caseId?: string;
}

export interface RolePermissions {
  canViewAllCases: boolean;
  canEditCases: boolean;
  canDeleteCases: boolean;
  canTransferCases: boolean;
  canViewAnalytics: boolean;
  canManageOfficers: boolean;
  canAccessAdmin: boolean;
  canViewSystemStatus: boolean;
}

class OfficerProfileService {
  
  /**
   * Get officer profile from Firestore
   */
  async getOfficerProfile(userId: string): Promise<OfficerProfile | null> {
    try {
      console.log(`👮 Fetching officer profile for user: ${userId}`);
      
      const docRef = doc(db, 'officer_profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as OfficerProfile;
        console.log(`✅ Officer profile found:`, data);
        return data;
      } else {
        console.log(`❌ No officer profile found for user: ${userId}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching officer profile:`, error);
      throw new Error('Failed to fetch officer profile');
    }
  }
  
  /**
   * Create or update officer profile
   */
  async createOrUpdateOfficerProfile(user: User, profileData: Partial<OfficerProfile>): Promise<OfficerProfile> {
    try {
      console.log(`👮 Creating/updating officer profile for: ${user.email}`);
      
      const now = new Date().toISOString();
      const docRef = doc(db, 'officer_profiles', user.id);
      
      // Check if profile exists
      const existingDoc = await getDoc(docRef);
      const isUpdate = existingDoc.exists();
      
      const baseProfile: OfficerProfile = {
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || profileData.fullName || user.email?.split('@')[0] || 'Officer',
        role: profileData.role || 'officer',
        badge: profileData.badge || this.generateBadgeNumber(),
        department: profileData.department || 'General',
        rank: profileData.rank || 'Constable',
        station: profileData.station || 'Central Station',
        phone: profileData.phone || '',
        avatar: profileData.avatar || '',
        status: profileData.status || 'active',
        lastLogin: now,
        joinDate: isUpdate ? existingDoc.data()?.joinDate || now : now,
        permissions: profileData.permissions || this.getDefaultPermissions(profileData.role || 'officer'),
        casesAssigned: profileData.casesAssigned || 0,
        casesResolved: profileData.casesResolved || 0,
        isOnline: true,
        shift: profileData.shift || {
          start: '09:00',
          end: '17:00',
          type: 'day'
        },
        createdAt: isUpdate ? existingDoc.data()?.createdAt || now : now,
        updatedAt: now
      };
      
      // Only add location if it's provided and not undefined
      if (profileData.location) {
        baseProfile.location = profileData.location;
      }
      
      if (isUpdate) {
        await updateDoc(docRef, {
          ...baseProfile,
          lastLogin: now,
          updatedAt: now,
          isOnline: true
        });
        console.log(`✅ Officer profile updated for: ${user.email}`);
      } else {
        await setDoc(docRef, baseProfile);
        console.log(`✅ Officer profile created for: ${user.email}`);
      }
      
      return baseProfile;
    } catch (error) {
      console.error(`❌ Error creating/updating officer profile:`, error);
      throw new Error('Failed to create/update officer profile');
    }
  }
  
  /**
   * Update officer status
   */
  async updateOfficerStatus(userId: string, status: OfficerProfile['status']): Promise<void> {
    try {
      console.log(`🔄 Updating officer status to: ${status}`);
      
      const docRef = doc(db, 'officer_profiles', userId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ Officer status updated to: ${status}`);
    } catch (error) {
      console.error(`❌ Error updating officer status:`, error);
      throw error;
    }
  }
  
  /**
   * Update officer online status
   */
  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      const docRef = doc(db, 'officer_profiles', userId);
      const updateData: any = {
        isOnline,
        updatedAt: new Date().toISOString()
      };
      
      // Only set lastLogin if user is coming online
      if (isOnline) {
        updateData.lastLogin = new Date().toISOString();
      }
      
      await updateDoc(docRef, updateData);
      
      console.log(`✅ Officer online status updated: ${isOnline}`);
    } catch (error) {
      console.error(`❌ Error updating online status:`, error);
      // Don't throw error for online status updates
    }
  }
  
  /**
   * Get all officers in department
   */
  async getAllOfficers(): Promise<OfficerProfile[]> {
    try {
      console.log(`👥 Fetching all officer profiles`);
      
      const officersRef = collection(db, 'officer_profiles');
      const q = query(officersRef, orderBy('rank'), orderBy('fullName'));
      const querySnapshot = await getDocs(q);
      
      const officers: OfficerProfile[] = [];
      querySnapshot.forEach((doc) => {
        officers.push(doc.data() as OfficerProfile);
      });
      
      console.log(`✅ Found ${officers.length} officers`);
      return officers;
    } catch (error) {
      console.error(`❌ Error fetching officers:`, error);
      throw error;
    }
  }
  
  /**
   * Get officers by department
   */
  async getOfficersByDepartment(department: string): Promise<OfficerProfile[]> {
    try {
      console.log(`👥 Fetching officers in department: ${department}`);
      
      const officersRef = collection(db, 'officer_profiles');
      const q = query(
        officersRef, 
        where('department', '==', department),
        orderBy('rank'),
        orderBy('fullName')
      );
      const querySnapshot = await getDocs(q);
      
      const officers: OfficerProfile[] = [];
      querySnapshot.forEach((doc) => {
        officers.push(doc.data() as OfficerProfile);
      });
      
      console.log(`✅ Found ${officers.length} officers in ${department}`);
      return officers;
    } catch (error) {
      console.error(`❌ Error fetching officers by department:`, error);
      throw error;
    }
  }
  
  /**
   * Log officer activity
   */
  async logActivity(officerId: string, action: string, details: string, caseId?: string): Promise<void> {
    try {
      const activityRef = collection(db, 'officer_activities');
      const activity: OfficerActivity = {
        id: '', // Firestore will auto-generate
        officerId,
        action,
        timestamp: new Date().toISOString(),
        details,
        caseId
      };
      
      await setDoc(doc(activityRef), activity);
      console.log(`📝 Activity logged for officer ${officerId}: ${action}`);
    } catch (error) {
      console.error(`❌ Error logging activity:`, error);
      // Don't throw error for activity logging
    }
  }
  
  /**
   * Get officer activities
   */
  async getOfficerActivities(officerId: string, limitCount: number = 10): Promise<OfficerActivity[]> {
    try {
      const activitiesRef = collection(db, 'officer_activities');
      const q = query(
        activitiesRef,
        where('officerId', '==', officerId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      const activities: OfficerActivity[] = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() } as OfficerActivity);
      });
      
      return activities;
    } catch (error) {
      console.error(`❌ Error fetching activities:`, error);
      return [];
    }
  }
  
  /**
   * Get role permissions
   */
  getRolePermissions(role: string): RolePermissions {
    const permissionSets: Record<string, RolePermissions> = {
      admin: {
        canViewAllCases: true,
        canEditCases: true,
        canDeleteCases: true,
        canTransferCases: true,
        canViewAnalytics: true,
        canManageOfficers: true,
        canAccessAdmin: true,
        canViewSystemStatus: true
      },
      officer: {
        canViewAllCases: false,
        canEditCases: true,
        canDeleteCases: false,
        canTransferCases: true,
        canViewAnalytics: true,
        canManageOfficers: false,
        canAccessAdmin: false,
        canViewSystemStatus: false
      },
      citizen: {
        canViewAllCases: false,
        canEditCases: false,
        canDeleteCases: false,
        canTransferCases: false,
        canViewAnalytics: false,
        canManageOfficers: false,
        canAccessAdmin: false,
        canViewSystemStatus: false
      }
    };
    
    return permissionSets[role] || permissionSets.citizen;
  }
  
  /**
   * Generate default permissions for role
   */
  private getDefaultPermissions(role: string): string[] {
    const permissions = this.getRolePermissions(role);
    return Object.entries(permissions)
      .filter(([_, allowed]) => allowed)
      .map(([permission, _]) => permission);
  }
  
  /**
   * Generate badge number
   */
  private generateBadgeNumber(): string {
    const prefix = 'NR';
    const number = Math.floor(Math.random() * 9999) + 1000;
    return `${prefix}${number}`;
  }
  
  /**
   * Get officer by badge number
   */
  async getOfficerByBadge(badgeNumber: string): Promise<OfficerProfile | null> {
    try {
      console.log(`🔍 Searching for officer with badge: ${badgeNumber}`);
      
      const officersRef = collection(db, 'officer_profiles');
      const q = query(officersRef, where('badge', '==', badgeNumber));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return doc.data() as OfficerProfile;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error searching officer by badge:`, error);
      throw error;
    }
  }
  
  /**
   * Update officer location
   */
  async updateOfficerLocation(userId: string, location: OfficerProfile['location']): Promise<void> {
    try {
      const docRef = doc(db, 'officer_profiles', userId);
      const updateData: any = {
        updatedAt: new Date().toISOString()
      };
      
      // Only update location if it's provided
      if (location) {
        updateData.location = location;
      }
      
      await updateDoc(docRef, updateData);
      
      console.log(`📍 Officer location updated`);
    } catch (error) {
      console.error(`❌ Error updating officer location:`, error);
      throw error;
    }
  }
  
  /**
   * Get online officers
   */
  async getOnlineOfficers(): Promise<OfficerProfile[]> {
    try {
      const officersRef = collection(db, 'officer_profiles');
      const q = query(
        officersRef,
        where('isOnline', '==', true),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      
      const officers: OfficerProfile[] = [];
      querySnapshot.forEach((doc) => {
        officers.push(doc.data() as OfficerProfile);
      });
      
      return officers;
    } catch (error) {
      console.error(`❌ Error fetching online officers:`, error);
      return [];
    }
  }
}

export const officerProfileService = new OfficerProfileService();
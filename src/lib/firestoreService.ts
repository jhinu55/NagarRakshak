// Firestore service for FIR data management
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  deleteDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { FIRRecord, CaseData } from './firData';

// Collection names in Firestore
const COLLECTION_NAME = 'firs';
const DELETED_COLLECTION_NAME = 'deleted_firs';

// Test Firestore connection and permissions
const testFirestoreAccess = async () => {
  try {
    console.log('🔍 Testing Firestore access to firs collection...');
    const casesRef = collection(db, COLLECTION_NAME);
    const q = query(casesRef);
    await getDocs(q);
    console.log('✅ Firestore firs collection access successful');
    return true;
  } catch (error: any) {
    console.error('❌ Firestore firs collection access failed:', error.code, error.message);
    
    if (error.code === 'permission-denied') {
      console.log('🔐 Fix: Update Firestore security rules to allow read/write');
      console.log('📝 Go to Firebase Console → Firestore → Rules');
    } else if (error.code === 'not-found') {
      console.log('📂 Collection "firs" not found - you may need to create it first');
    }
    return false;
  }
};

// Convert Firestore document to CaseData
function firestoreDocToCaseData(doc: any): CaseData {
  const data = doc.data();
  const record: FIRRecord = {
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
    officer_assigned: data.officer_assigned // Include officer_assigned field
  };

  return transformFIRToCase(record);
}

// Transform FIR record to case data format (copied from firData.ts)
function transformFIRToCase(record: FIRRecord): CaseData {
  return {
    id: record.fir_number,
    type: record.incident_type,
    status: generateStatus(record),
    priority: generatePriority(record.incident_type),
    complainant: record.victim_full_name,
    location: record.incident_location_address,
    date: formatDate(record.incident_datetime),
    assignedTo: record.officer_assigned || generateAssignedOfficer(record.fir_number),
    description: record.incident_description,
    progress: generateProgress(record),
    lastUpdate: generateLastUpdate(record.created_at),
    fullRecord: record
  };
}

// Generate realistic status based on case type and date
function generateStatus(record: FIRRecord): string {
  const caseAge = getDaysFromCreation(record.created_at);
  const caseType = record.incident_type.toLowerCase();
  
  // High priority cases tend to be resolved faster
  if (caseType.includes('missing') || caseType.includes('violence') || caseType.includes('assault')) {
    if (caseAge > 7) return 'Under Investigation';
    return 'Pending';
  }
  
  if (caseType.includes('theft') || caseType.includes('fraud')) {
    if (caseAge > 15) return 'Resolved';
    if (caseAge > 5) return 'Under Investigation';
    return 'Pending';
  }
  
  // Default distribution
  if (caseAge > 20) return 'Resolved';
  if (caseAge > 3) return 'Under Investigation';
  return 'Pending';
}

// Generate priority based on incident type
function generatePriority(incidentType: string): string {
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

// Generate assigned officer based on FIR number
function generateAssignedOfficer(firNumber: string): string {
  const officers = [
    'Rajesh Singh', 'Priya Patel', 'Amit Kumar', 'Sunita Sharma', 
    'Vikram Verma', 'Anjali Gupta', 'Rohit Yadav', 'Kavita Joshi'
  ];
  
  const index = parseInt(firNumber.slice(-2)) % officers.length;
  return officers[index];
}

// Generate progress based on status and case age
function generateProgress(record: FIRRecord): number {
  const status = generateStatus(record);
  const caseAge = getDaysFromCreation(record.created_at);
  
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

// Generate last update time
function generateLastUpdate(createdAt: string): string {
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

// Helper function to get days since creation
function getDaysFromCreation(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

// Format date for display
function formatDate(datetime: string): string {
  const date = new Date(datetime);
  return date.toISOString().split('T')[0];
}

// Firestore service functions
export const firestoreService = {
  // Load all FIR cases from Firestore
  async loadAllCases(): Promise<CaseData[]> {
    // Test access first
    const hasAccess = await testFirestoreAccess();
    if (!hasAccess) {
      throw new Error('Failed to access Firestore - check permissions');
    }

    try {
      console.log('📊 Loading cases from Firestore collection:', COLLECTION_NAME);
      const casesRef = collection(db, COLLECTION_NAME);
      const q = query(casesRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const cases: CaseData[] = [];
      querySnapshot.forEach((doc) => {
        cases.push(firestoreDocToCaseData(doc));
      });
      
      console.log(`✅ Successfully loaded ${cases.length} cases from Firestore`);
      return cases;
    } catch (error) {
      console.error('❌ Error loading cases from Firestore:', error);
      throw new Error('Failed to load cases from database');
    }
  },

  // Load FIR cases assigned to a specific officer
  async loadCasesByOfficer(officerName: string): Promise<CaseData[]> {
    // Test access first
    const hasAccess = await testFirestoreAccess();
    if (!hasAccess) {
      throw new Error('Failed to access Firestore - check permissions');
    }

    try {
      console.log('👮 Loading cases assigned to officer:', officerName, 'from Firestore collection:', COLLECTION_NAME);
      
      // Load ALL cases first since Firestore doesn't support case-insensitive queries
      const casesRef = collection(db, COLLECTION_NAME);
      const q = query(casesRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      console.log(`📋 Query returned ${querySnapshot.size} total documents`);
      
      const cases: CaseData[] = [];
      querySnapshot.forEach((doc) => {
        const caseData = firestoreDocToCaseData(doc);
        const assignedOfficer = caseData.assignedTo || '';
        
        // Case-insensitive comparison
        if (assignedOfficer.toLowerCase() === officerName.toLowerCase()) {
          console.log(`📄 Case ${caseData.id}: assigned to "${assignedOfficer}" - MATCHES "${officerName}"`);
          cases.push(caseData);
        } else {
          console.log(`📄 Case ${caseData.id}: assigned to "${assignedOfficer}" - no match`);
        }
      });
      
      console.log(`✅ Successfully loaded ${cases.length} cases assigned to "${officerName}" from Firestore`);
      return cases;
    } catch (error) {
      console.error('❌ Error loading cases from Firestore:', error);
      throw new Error('Failed to load cases from database');
    }
  },

  // Get a specific case by ID
  async getCaseById(caseId: string): Promise<CaseData | null> {
    try {
      console.log('🔍 Fetching case from Firestore:', caseId);
      const casesRef = collection(db, COLLECTION_NAME);
      const q = query(casesRef, where('fir_number', '==', caseId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('❌ Case not found in Firestore:', caseId);
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const caseData = firestoreDocToCaseData(doc);
      console.log('✅ Case found in Firestore:', caseId);
      return caseData;
    } catch (error) {
      console.error('❌ Error getting case by ID:', error);
      return null;
    }
  },

  // Delete a case from Firestore (move to deleted_firs collection)
  async deleteCase(caseId: string, reason: string): Promise<void> {
    try {
      console.log('🗑️ Deleting case from Firestore:', caseId);
      
      // Find the document by fir_number
      const casesRef = collection(db, COLLECTION_NAME);
      const q = query(casesRef, where('fir_number', '==', caseId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error(`Case ${caseId} not found in Firestore`);
      }
      
      const docToDelete = querySnapshot.docs[0];
      const originalData = docToDelete.data();
      
      // Create deletion record for deleted_firs collection
      const deletedRecord = {
        ...originalData,
        deletion_reason: reason,
        deleted_at: new Date().toISOString(),
        deleted_by: 'current_officer', // In production, get from auth context
        original_document_id: docToDelete.id
      };
      
      // Add to deleted_firs collection
      await addDoc(collection(db, DELETED_COLLECTION_NAME), deletedRecord);
      console.log('📝 Case moved to deleted_firs collection:', caseId);
      
      // Delete the case document from main collection
      await deleteDoc(docToDelete.ref);
      console.log('✅ Case deleted successfully from Firestore:', caseId);
      
    } catch (error) {
      console.error('❌ Error deleting case from Firestore:', error);
      throw error;
    }
  },

  // Transfer a case to another officer
  async transferCase(caseId: string, newOfficer: string, reason: string, currentOfficer?: string): Promise<void> {
    try {
      console.log('🔄 Transferring case in Firestore:', caseId, 'to', newOfficer);
      
      // Find the document by fir_number
      const casesRef = collection(db, COLLECTION_NAME);
      const q = query(casesRef, where('fir_number', '==', caseId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error(`Case ${caseId} not found in Firestore`);
      }
      
      const docToUpdate = querySnapshot.docs[0];
      const currentData = docToUpdate.data();
      
      // Create transfer log entry
      const transferLog = {
        caseId: caseId,
        fromOfficer: currentOfficer || currentData.officer_assigned || 'Unknown',
        toOfficer: newOfficer,
        reason: reason,
        transferredAt: new Date().toISOString(),
        transferredBy: 'current_officer', // In production, get from auth context
        caseType: currentData.incident_type
      };
      
      // Add to transfer logs collection (for audit trail)
      await addDoc(collection(db, 'transfer_logs'), transferLog);
      console.log('📝 Transfer log created:', caseId);
      
      // Update the case with new officer
      await updateDoc(docToUpdate.ref, {
        officer_assigned: newOfficer,
        last_updated: new Date().toISOString(),
        transfer_history: currentData.transfer_history ? 
          [...currentData.transfer_history, transferLog] : 
          [transferLog]
      });
      
      console.log('✅ Case transferred successfully in Firestore:', caseId, 'to', newOfficer);
      
    } catch (error) {
      console.error('❌ Error transferring case in Firestore:', error);
      throw error;
    }
  },

  // Add a new case to Firestore
  async addCase(firRecord: FIRRecord): Promise<string> {
    try {
      console.log('➕ Adding new case to Firestore:', firRecord.fir_number);
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...firRecord,
        created_at: firRecord.created_at || new Date().toISOString(),
        officer_assigned: firRecord.officer_assigned || generateAssignedOfficer(firRecord.fir_number),
        last_updated: new Date().toISOString()
      });
      
      console.log('✅ Case added successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error adding case to Firestore:', error);
      throw new Error('Failed to add case');
    }
  },

  // Get deleted cases (for admin view)
  async getDeletedCases(): Promise<any[]> {
    try {
      console.log('📊 Loading deleted cases from Firestore collection:', DELETED_COLLECTION_NAME);
      const deletedRef = collection(db, DELETED_COLLECTION_NAME);
      const q = query(deletedRef, orderBy('deleted_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const deletedCases: any[] = [];
      querySnapshot.forEach((doc) => {
        deletedCases.push({ id: doc.id, ...doc.data() });
      });
      
      console.log(`✅ Successfully loaded ${deletedCases.length} deleted cases from Firestore`);
      return deletedCases;
    } catch (error) {
      console.error('❌ Error loading deleted cases from Firestore:', error);
      throw new Error('Failed to load deleted cases');
    }
  },

  // Get all unique officer names from the FIR database
  async getAllOfficerNames(): Promise<string[]> {
    try {
      console.log('👥 Extracting all unique officer names from Firestore database...');
      
      const casesRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(casesRef);
      
      const officerNames = new Set<string>();
      const duplicateTracker = new Map<string, string>(); // lowercase -> original case
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const officerAssigned = data.officer_assigned;
        
        if (officerAssigned && typeof officerAssigned === 'string') {
          const lowerCaseName = officerAssigned.toLowerCase();
          
          // Only add if we haven't seen this name before (case-insensitive)
          if (!duplicateTracker.has(lowerCaseName)) {
            duplicateTracker.set(lowerCaseName, officerAssigned);
            officerNames.add(officerAssigned);
            console.log(`👮 Found officer in database: "${officerAssigned}"`);
          }
        }
      });
      
      const uniqueOfficers = Array.from(officerNames).sort();
      console.log(`✅ Extracted ${uniqueOfficers.length} unique officers from database:`, uniqueOfficers);
      
      return uniqueOfficers;
    } catch (error) {
      console.error('❌ Error extracting officer names from database:', error);
      throw new Error('Failed to extract officer names from database');
    }
  },

  async updateCaseStatus(caseId: string, status: string): Promise<void> {
    try {
      console.log('🔄 Updating case status in Firestore:', caseId, 'to', status);
      
      // Find the document by fir_number
      const casesRef = collection(db, COLLECTION_NAME);
      const q = query(casesRef, where('fir_number', '==', caseId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error(`Case ${caseId} not found in Firestore`);
      }
      
      const docToUpdate = querySnapshot.docs[0];
      
      // Update the case status
      await updateDoc(docToUpdate.ref, {
        status: status,
        updated_at: new Date()
      });
      
      console.log(`✅ Case ${caseId} status updated to ${status}`);
    } catch (error) {
      console.error('❌ Error updating case status:', error);
      throw error;
    }
  }
};
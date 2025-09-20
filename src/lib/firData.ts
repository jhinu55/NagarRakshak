// Utility functions for managing FIR data
import { firestoreService } from './firestoreService';

export interface FIRRecord {
  victim_full_name: string;
  contact_phone: string;
  incident_type: string;
  incident_datetime: string;
  incident_location_address: string;
  incident_description: string;
  suspect_names: string[];
  witness_names_contacts: string | null;
  property_details: string;
  contact_email: string;
  fir_number: string;
  created_at: string;
  officer_assigned?: string; // New field for assigned officer
}

export interface FIRData {
  [key: string]: FIRRecord;
}

export interface CaseData {
  id: string;
  type: string;
  status: string;
  priority: string;
  complainant: string;
  location: string;
  date: string;
  assignedTo: string;
  description: string;
  progress: number;
  lastUpdate: string;
  fullRecord: FIRRecord;
}

// Function to load all FIR data from Firestore
export async function loadFIRData(officerName?: string): Promise<CaseData[]> {
  console.log('🚀 Starting FIR data loading process...');
  
  try {
    console.log('🔥 Attempting to load FIR data from Firestore...');
    console.log('📡 Firebase connection status: Checking...');
    
    const cases = officerName 
      ? await firestoreService.loadCasesByOfficer(officerName)
      : await firestoreService.loadAllCases();
    
    console.log('✅ Firebase connection: SUCCESSFUL');
    console.log(`📊 Loaded ${cases.length} cases from Firestore database${officerName ? ` for ${officerName}` : ''}`);
    console.log('💾 Data source: Firebase Firestore');
    
    return cases;
  } catch (error: any) {
    console.log('❌ Firebase connection: FAILED');
    console.error('🔥 Firestore error details:', {
      code: error.code,
      message: error.message,
      name: error.name
    });
    
    // Provide specific error guidance
    if (error.message.includes('permission')) {
      console.log('🔐 Permission Issue: Update Firestore security rules');
      console.log('📝 Solution: Go to Firebase Console → Firestore → Rules');
    } else if (error.message.includes('not-found')) {
      console.log('📂 Collection Issue: Create "firs" collection in Firestore');
    } else if (error.message.includes('network')) {
      console.log('🌐 Network Issue: Check internet connection');
    }
    
    // Fallback to JSON files if Firestore fails
    console.log('📁 Falling back to JSON file data source...');
    console.log('💾 Data source: Local JSON files');
    
    const allCases = await loadFIRDataFromJSON();
    
    // Filter by officer if specified (case-insensitive)
    if (officerName) {
      const filteredCases = allCases.filter(case_ => {
        const assignedOfficer = case_.assignedTo || '';
        const isMatch = assignedOfficer.toLowerCase() === officerName.toLowerCase();
        console.log(`🔍 Checking case ${case_.id}: assigned to "${assignedOfficer}" vs looking for "${officerName}" - ${isMatch ? 'MATCH' : 'no match'}`);
        return isMatch;
      });
      console.log(`✅ Filtered ${filteredCases.length} cases for officer "${officerName}" from JSON fallback`);
      return filteredCases;
    }
    
    return allCases;
  }
}

// Fallback function to load from JSON files (original implementation)
async function loadFIRDataFromJSON(): Promise<CaseData[]> {
  const firDataFiles = [
    'theft_mobile_phone.json',
    'domestic_violence_assault.json',
    'vehicle_theft_motorcycle.json',
    'cybercrime_online_fraud.json',
    'house_breakin_burglary.json',
    'sexual_harassment_public.json',
    'road_accident_hitrun.json',
    'dowry_harassment_case.json',
    'cheque_bounce_fraud.json',
    'chain_snatching_robbery.json',
    'atm_card_fraud.json',
    'eve_teasing_harassment.json',
    'property_dispute_encroachment.json',
    'credit_card_fraud.json',
    'assault_physical_violence.json',
    'stalking_harassment.json',
    'shop_breakin_theft.json',
    'drug_peddling_school.json',
    'extortion_protection_money.json',
    'missing_person_teenager.json'
  ];

  const cases: CaseData[] = [];
  
  for (const fileName of firDataFiles) {
    try {
      const response = await fetch(`/data/${fileName}`);
      if (!response.ok) {
        console.warn(`Failed to load ${fileName}:`, response.statusText);
        continue;
      }
      
      const firData: FIRData = await response.json();
      const record = Object.values(firData)[0]; // Get the first (and only) record
      
      if (record) {
        const caseData = transformFIRToCase(record);
        cases.push(caseData);
      }
    } catch (error) {
      console.error(`Error loading ${fileName}:`, error);
    }
  }
  
  return cases.sort((a, b) => a.id.localeCompare(b.id));
}

// Transform FIR record to case data format
function transformFIRToCase(record: FIRRecord): CaseData {
  return {
    id: record.fir_number,
    type: record.incident_type,
    status: generateStatus(record),
    priority: generatePriority(record.incident_type),
    complainant: record.victim_full_name,
    location: record.incident_location_address,
    date: formatDate(record.incident_datetime),
    assignedTo: record.officer_assigned || generateAssignedOfficer(record.fir_number), // Prioritize database value
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

// Generate assigned officer based on FIR number (minimal fallback only when officer_assigned is missing)
function generateAssignedOfficer(firNumber: string): string {
  // This should rarely be used in production - all FIRs should have officer_assigned
  console.log('⚠️ Warning: No officer assigned in database for FIR', firNumber);
  console.log('💡 This indicates missing data - officer_assigned field should be set');
  
  // Minimal fallback - just return a generic assignment
  return 'Unassigned Officer';
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

// Get case by ID from Firestore
export async function getCaseById(id: string): Promise<CaseData | null> {
  try {
    return await firestoreService.getCaseById(id);
  } catch (error) {
    console.error('Error getting case by ID:', error);
    return null;
  }
}

// Delete case from Firestore
export async function deleteCase(caseId: string, reason: string): Promise<void> {
  try {
    await firestoreService.deleteCase(caseId, reason);
    console.log(`Case ${caseId} deleted successfully from Firestore`);
  } catch (error) {
    console.error('Error deleting case from Firestore:', error);
    throw error;
  }
}

// Filter cases by various criteria
export function filterCases(
  cases: CaseData[], 
  searchTerm: string, 
  statusFilter: string, 
  priorityFilter: string
): CaseData[] {
  return cases.filter(case_ => {
    const matchesSearch = case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.complainant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || case_.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
}

// Transfer case to another officer
export async function transferCase(caseId: string, newOfficer: string, reason: string, currentOfficer?: string): Promise<void> {
  try {
    await firestoreService.transferCase(caseId, newOfficer, reason, currentOfficer);
    console.log(`Case ${caseId} transferred successfully to ${newOfficer}`);
  } catch (error) {
    console.error('Error transferring case:', error);
    throw error;
  }
}

// Get deleted cases (for admin purposes)
export async function getDeletedCases(): Promise<any[]> {
  try {
    return await firestoreService.getDeletedCases();
  } catch (error) {
    console.error('Error getting deleted cases:', error);
    throw error;
  }
}

// Get all unique officer names from the database (NO hardcoded fallback)
export async function getAllOfficerNames(): Promise<string[]> {
  try {
    console.log('👥 Fetching all officer names from database...');
    const officers = await firestoreService.getAllOfficerNames();
    console.log(`✅ Retrieved ${officers.length} officers from database`);
    return officers;
  } catch (error) {
    console.error('❌ Error getting officer names from database:', error);
    // No fallback - if database fails, return empty array
    console.log('⚠️ No fallback list - returning empty array');
    return [];
  }
}
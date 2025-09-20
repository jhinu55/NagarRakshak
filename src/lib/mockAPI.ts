// Mock API for case deletion
// In a real application, this would be implemented as a backend API endpoint

interface DeleteRequest {
  reason: string;
  fileName: string;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

// Simulate file deletion (for demonstration purposes)
export async function mockDeleteAPI(caseId: string, request: DeleteRequest): Promise<DeleteResponse> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // In a real implementation, this would:
      // 1. Authenticate the user (police officer)
      // 2. Log the deletion request with timestamp and user ID
      // 3. Delete the actual file from the server
      // 4. Update the database
      // 5. Send audit notifications
      
      console.log(`Mock API: Deleting case ${caseId}`);
      console.log(`File: ${request.fileName}`);
      console.log(`Reason: ${request.reason}`);
      console.log(`Timestamp: ${new Date().toISOString()}`);
      
      // Simulate success
      resolve({
        success: true,
        message: `Case ${caseId} has been successfully deleted from the system.`
      });
    }, 1000); // 1 second delay to simulate network request
  });
}

// For development purposes, you can manually delete files using this function
export function manualFileDelete(fileName: string): void {
  console.log(`To manually delete the file, run the following command in your terminal:`);
  console.log(`rm /home/jhinu/Desktop/NagarRakshak/public/data/${fileName}`);
  console.log(`Or use the file manager to delete: public/data/${fileName}`);
}

// Audit log interface for tracking deletions
export interface AuditLog {
  caseId: string;
  fileName: string;
  reason: string;
  deletedBy: string; // Police officer ID/name
  deletedAt: string; // ISO timestamp
  ipAddress?: string;
  userAgent?: string;
}

// Function to create audit log entry
export function createAuditLog(
  caseId: string, 
  fileName: string, 
  reason: string, 
  officerId: string = 'current_officer'
): AuditLog {
  return {
    caseId,
    fileName,
    reason,
    deletedBy: officerId,
    deletedAt: new Date().toISOString(),
    ipAddress: 'localhost', // In real app, get from request
    userAgent: navigator.userAgent
  };
}
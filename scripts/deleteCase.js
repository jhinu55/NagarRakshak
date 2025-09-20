#!/usr/bin/env node

/**
 * File Deletion Script for NagarRakshak Case Management
 * 
 * This script can be used to actually delete case files from the file system.
 * In a production environment, this would be part of the backend API.
 * 
 * Usage: node scripts/deleteCase.js <case-id> <reason>
 * Example: node scripts/deleteCase.js NR-2025-00001 "Case resolved and archived"
 */

const fs = require('fs');
const path = require('path');

// File mapping (same as in firData.ts)
const fileMapping = {
  'NR-2025-00001': 'theft_mobile_phone.json',
  'NR-2025-00002': 'domestic_violence_assault.json',
  'NR-2025-00003': 'vehicle_theft_motorcycle.json',
  'NR-2025-00004': 'cybercrime_online_fraud.json',
  'NR-2025-00005': 'house_breakin_burglary.json',
  'NR-2025-00006': 'sexual_harassment_public.json',
  'NR-2025-00007': 'road_accident_hitrun.json',
  'NR-2025-00008': 'dowry_harassment_case.json',
  'NR-2025-00009': 'cheque_bounce_fraud.json',
  'NR-2025-00010': 'chain_snatching_robbery.json',
  'NR-2025-00011': 'atm_card_fraud.json',
  'NR-2025-00012': 'eve_teasing_harassment.json',
  'NR-2025-00013': 'property_dispute_encroachment.json',
  'NR-2025-00014': 'credit_card_fraud.json',
  'NR-2025-00015': 'assault_physical_violence.json',
  'NR-2025-00016': 'stalking_harassment.json',
  'NR-2025-00017': 'shop_breakin_theft.json',
  'NR-2025-00018': 'drug_peddling_school.json',
  'NR-2025-00019': 'extortion_protection_money.json',
  'NR-2025-00020': 'missing_person_teenager.json'
};

function deleteCase(caseId, reason) {
  const fileName = fileMapping[caseId];
  
  if (!fileName) {
    console.error(`❌ Error: Case ID ${caseId} not found`);
    process.exit(1);
  }
  
  const filePath = path.join(__dirname, '..', 'public', 'data', fileName);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File ${fileName} does not exist at ${filePath}`);
    process.exit(1);
  }
  
  try {
    // Create audit log
    const auditLog = {
      caseId,
      fileName,
      reason,
      deletedBy: process.env.USER || 'system',
      deletedAt: new Date().toISOString(),
      filePath
    };
    
    // Save audit log
    const auditLogPath = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(auditLogPath)) {
      fs.mkdirSync(auditLogPath, { recursive: true });
    }
    
    const auditFileName = `deletion_${caseId}_${Date.now()}.json`;
    fs.writeFileSync(
      path.join(auditLogPath, auditFileName),
      JSON.stringify(auditLog, null, 2)
    );
    
    // Delete the case file
    fs.unlinkSync(filePath);
    
    console.log(`✅ Successfully deleted case ${caseId}`);
    console.log(`📁 File removed: ${fileName}`);
    console.log(`📝 Reason: ${reason}`);
    console.log(`📋 Audit log saved: logs/${auditFileName}`);
    
  } catch (error) {
    console.error(`❌ Error deleting case: ${error.message}`);
    process.exit(1);
  }
}

function showUsage() {
  console.log('Usage: node scripts/deleteCase.js <case-id> <reason>');
  console.log('');
  console.log('Available Case IDs:');
  Object.keys(fileMapping).forEach(caseId => {
    console.log(`  ${caseId} - ${fileMapping[caseId]}`);
  });
  console.log('');
  console.log('Example:');
  console.log('  node scripts/deleteCase.js NR-2025-00001 "Case resolved and archived"');
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Error: Missing arguments');
  console.log('');
  showUsage();
  process.exit(1);
}

const caseId = args[0];
const reason = args.slice(1).join(' ');

if (reason.length < 10) {
  console.error('❌ Error: Reason must be at least 10 characters long');
  process.exit(1);
}

deleteCase(caseId, reason);
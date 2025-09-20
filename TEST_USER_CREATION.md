# Test User Creation for Officer Filtering

## Create Test User: Siaa Jain

### Step 1: Sign Up as Siaa Jain Officer

Navigate to: http://localhost:5174/signup

**Officer Account Details:**
- First Name: `Siaa`
- Last Name: `Jain`  
- Email: `siaa.jain@police.gov.in`
- Phone: `+91-9876543210`
- Password: `SiaaJain123!`
- Role: `officer`

This will create a user with:
- `fullName`: "Siaa Jain"
- `role`: "officer"
- `email`: "siaa.jain@police.gov.in"

### Step 2: Verify Authentication

Login with:
- Email: `siaa.jain@police.gov.in`
- Password: `SiaaJain123!`

### Step 3: Check Case Assignment

The system should:
1. Extract officer name: "Siaa Jain" from `user.fullName`
2. Query Firestore for cases where `officer_assigned == "Siaa Jain"`
3. Display only matching cases

### Step 4: Database Population

If no cases are assigned to "Siaa Jain", the system will show:
- "No cases assigned" message
- Empty case list
- Console logs showing 0 cases loaded

### Step 5: Create Test Cases (Optional)

To test with actual data, cases need to be created in Firestore with:
```json
{
  "fir_number": "FIR2024001",
  "officer_assigned": "Siaa Jain",
  "victim_full_name": "Test Victim",
  "incident_type": "Test Case",
  // ... other required fields
}
```

### Step 6: Verification

Expected console output:
```
👮 Current officer from auth: Siaa Jain
📧 User email: siaa.jain@police.gov.in  
👤 User fullName: Siaa Jain
👮 Loading cases assigned to officer: Siaa Jain
🔍 Query filter: officer_assigned == Siaa Jain
📋 Query returned X documents
✅ Successfully loaded X cases assigned to "Siaa Jain"
```

### Alternative Test Users

You can also create accounts for existing officers:

**Officer Singh:**
- Email: `officer.singh@police.gov.in`
- Full Name: "Officer Singh"

**Officer Patel:**  
- Email: `officer.patel@police.gov.in`
- Full Name: "Officer Patel"

### Quick Test Commands

Open browser console and check:
1. Authentication status: `console.log(user)`
2. Case filtering: Look for console logs during case loading
3. Network requests: Check Firestore queries in Network tab
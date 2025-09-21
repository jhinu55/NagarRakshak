import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const createSampleFIRData = async () => {
  console.log('🚀 Creating sample FIR data...');
  
  const sampleFIRs = [
    {
      victim_full_name: "Rajesh Kumar",
      contact_phone: "+91-9876543210",
      incident_type: "Mobile Theft",
      incident_datetime: "2024-03-20T14:30:00.000Z",
      incident_location_address: "Bus Stand, Panaji, Goa",
      incident_description: "My mobile phone was stolen while boarding a bus at Panaji bus stand. The phone is an iPhone 14 Pro worth Rs. 1,20,000.",
      suspect_names: ["Unknown person in red shirt"],
      witness_names_contacts: "Priya Sharma: +91-9876543211",
      property_details: "iPhone 14 Pro, Black, 128GB, IMEI: 123456789012345",
      contact_email: "rajesh.kumar@example.com",
      fir_number: "FIR2024001",
      created_at: "2024-03-20T14:30:00.000Z",
      officer_assigned: "Inspector Amit Verma"
    },
    {
      victim_full_name: "Sunita Patel",
      contact_phone: "+91-9876543212",
      incident_type: "House Break-in",
      incident_datetime: "2024-03-21T02:15:00.000Z",
      incident_location_address: "123 MG Road, Margao, Goa",
      incident_description: "Someone broke into my house during the night and stole jewelry and cash. The front door lock was broken.",
      suspect_names: ["Unknown"],
      witness_names_contacts: null,
      property_details: "Gold jewelry worth Rs. 2,50,000, Cash Rs. 15,000",
      contact_email: "sunita.patel@example.com",
      fir_number: "FIR2024002",
      created_at: "2024-03-21T08:30:00.000Z",
      officer_assigned: "Sub Inspector Priya Singh"
    },
    {
      victim_full_name: "Arjun Menon",
      contact_phone: "+91-9876543213",
      incident_type: "Vehicle Theft",
      incident_datetime: "2024-03-19T22:00:00.000Z",
      incident_location_address: "Parking near Calangute Beach, Goa",
      incident_description: "My motorcycle was stolen from the parking area near Calangute Beach. It's a Honda Activa 6G.",
      suspect_names: ["Two young men in black clothes"],
      witness_names_contacts: "Security guard: Ramesh +91-9876543214",
      property_details: "Honda Activa 6G, Red color, Registration: GA-07-AB-1234",
      contact_email: "arjun.menon@example.com",
      fir_number: "FIR2024003",
      created_at: "2024-03-19T23:30:00.000Z",
      officer_assigned: "Constable Kavita Joshi"
    },
    {
      victim_full_name: "Maria Fernandes",
      contact_phone: "+91-9876543214",
      incident_type: "Online Fraud",
      incident_datetime: "2024-03-22T10:00:00.000Z",
      incident_location_address: "Online Transaction",
      incident_description: "I received a fake call claiming to be from my bank asking for OTP. They transferred Rs. 45,000 from my account.",
      suspect_names: ["Unknown caller claiming to be from SBI"],
      witness_names_contacts: null,
      property_details: "Bank fraud, Rs. 45,000 transferred without authorization",
      contact_email: "maria.fernandes@example.com",
      fir_number: "FIR2024004",
      created_at: "2024-03-22T11:00:00.000Z",
      officer_assigned: "Inspector Rohit Yadav"
    },
    {
      victim_full_name: "Deepak Sharma",
      contact_phone: "+91-9876543215",
      incident_type: "Chain Snatching",
      incident_datetime: "2024-03-18T19:30:00.000Z",
      incident_location_address: "Near Mapusa Market, Goa",
      incident_description: "While walking near Mapusa market, two men on a motorcycle snatched my wife's gold chain and escaped.",
      suspect_names: ["Two men on black motorcycle without number plate"],
      witness_names_contacts: "Shop owner: Suresh +91-9876543216",
      property_details: "22kt Gold chain, 25 grams, worth Rs. 1,25,000",
      contact_email: "deepak.sharma@example.com",
      fir_number: "FIR2024005",
      created_at: "2024-03-18T20:00:00.000Z",
      officer_assigned: "Sub Inspector Anjali Gupta"
    }
  ];

  try {
    const firsCollection = collection(db, 'firs');
    
    for (const firData of sampleFIRs) {
      await addDoc(firsCollection, firData);
      console.log(`✅ Created FIR: ${firData.fir_number}`);
    }
    
    console.log(`🎉 Successfully created ${sampleFIRs.length} sample FIR records!`);
    return true;
  } catch (error) {
    console.error('❌ Error creating sample FIR data:', error);
    throw error;
  }
};

export const createSampleUsers = async () => {
  console.log('👥 Note: User creation should be done through Supabase Auth');
  console.log('🔗 Go to your Supabase dashboard to create users manually');
  console.log('📝 Or use the user creation tool in your app');
};
export const patientMock = {
  id: "P-1001",
  name: "Rahul Sharma",
  age: 34,
  gender: "Male",
  bloodGroup: "O+",
  history: [
    { date: "2025-11-12", condition: "Viral Fever", doctor: "Dr. Anita Desai" },
    { date: "2024-03-05", condition: "Mild Asthma", doctor: "Dr. Vikram Singh" }
  ],
  allergies: ["Penicillin", "Dust Mites"],
  chatHistory: [
    { sender: "ai", text: "Hello Rahul! How can I help you today?" },
    { sender: "patient", text: "I've had a high fever since yesterday and severe body ache." },
    { sender: "ai", text: "I understand. Do you also have a headache or any rash?" },
    { sender: "patient", text: "Yes, a terrible headache, especially behind the eyes." },
    { sender: "ai", text: "Based on your symptoms (high fever, body ache, retro-orbital pain), there is a possibility of Dengue or Viral illness. I recommend seeing a doctor." }
  ],
  suggestedDiagnosis: [
    { condition: "Dengue Fever", confidence: 78 },
    { condition: "Viral Infection", confidence: 20 }
  ],
  hospitals: [
    { id: 1, name: "City General Hospital", distance: "2.5 km", waitTime: "15 mins", slots: ["10:30 AM", "11:00 AM", "01:00 PM"], department: "General Medicine" },
    { id: 2, name: "Apex Care Clinic", distance: "4.1 km", waitTime: "5 mins", slots: ["09:45 AM", "02:00 PM"], department: "General Medicine" },
    { id: 3, name: "Sunrise Hospital", distance: "6.0 km", waitTime: "0 mins", slots: ["Immediate", "10:00 AM"], department: "Emergency / Fever Clinic" }
  ]
};

export const doctorMock = {
  id: "D-202",
  name: "Dr. Anita Desai",
  specialization: "General Medicine",
  queue: [
    { id: "P-1001", name: "Rahul Sharma", time: "10:30 AM", status: "Waiting", urgency: "High", predicted: "Dengue (78%)" },
    { id: "P-1002", name: "Priya Patel", time: "11:00 AM", status: "Scheduled", urgency: "Normal", predicted: "Migraine (85%)" },
    { id: "P-1003", name: "Amit Kumar", time: "11:30 AM", status: "Scheduled", urgency: "Normal", predicted: "Gastroenteritis (60%)" }
  ],
  currentCase: {
    patient: patientMock,
    aiExplanation: "The combination of high fever (>102F), severe myalgia (body ache), and distinct retro-orbital pain strongly correlates with classic Dengue presentation in this region, given current seasonal trends. Confidence is high (78%). Warning: Patient allergic to Penicillin."
  }
};

export const hospitalMock = {
  name: "City General Hospital",
  stats: {
    totalBeds: 250,
    occupiedBeds: 185,
    icuBeds: 30,
    icuOccupied: 28,
    activeDoctors: 45,
    waitingPatients: 12
  },
  diseaseTrends: [
    { condition: "Dengue Fever", count: 45, trend: "up", percentage: "+12%" },
    { condition: "Viral Flu", count: 120, trend: "stable", percentage: "+1%" },
    { condition: "Typhoid", count: 18, trend: "down", percentage: "-5%" },
    { condition: "Gastroenteritis", count: 35, trend: "up", percentage: "+8%" }
  ]
};

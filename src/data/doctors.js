// Centralized doctors data for reuse across pages
export const doctors = [
  { id: 'dr-raj', name: 'Dr. Raj Verma', specialty: 'Cardiology', rating: 4.8, experience: 12, nextAvailable: 'Tomorrow 10:30 AM', bio: 'Specialist in heart health, ECG interpretation, and preventive cardiology.' },
  { id: 'dr-mehta', name: 'Dr. A. Mehta', specialty: 'Dermatology', rating: 4.6, experience: 9, nextAvailable: 'Today 4:00 PM', bio: 'Focused on acne, eczema, psoriasis, and cosmetic dermatology.' },
  { id: 'dr-sharma', name: 'Dr. Neha Sharma', specialty: 'General Medicine', rating: 4.7, experience: 11, nextAvailable: 'Today 2:15 PM', bio: 'Primary care physician for fever, cough, infections, and routine checkups.' },
  { id: 'dr-kapoor', name: 'Dr. V. Kapoor', specialty: 'Orthopedics', rating: 4.5, experience: 10, nextAvailable: 'Thu 11:00 AM', bio: 'Treats joint pain, back pain, fractures, and sports injuries.' },
  { id: 'dr-iyer', name: 'Dr. S. Iyer', specialty: 'Psychiatry', rating: 4.9, experience: 14, nextAvailable: 'Wed 6:45 PM', bio: 'Expert in anxiety, depression, and sleep-related issues.' },
  { id: 'dr-rao', name: 'Dr. Anita Rao', specialty: 'ENT', rating: 4.6, experience: 8, nextAvailable: 'Today 5:30 PM', bio: 'Cares for sore throat, ear pain, sinus congestion, and seasonal allergies.' },
  { id: 'dr-gupta', name: 'Dr. Sameer Gupta', specialty: 'Pediatrics', rating: 4.7, experience: 10, nextAvailable: 'Tomorrow 9:45 AM', bio: 'Treats colds, fever, nutrition issues, and routine child wellness.' },
  { id: 'dr-nair', name: 'Dr. Kavita Nair', specialty: 'Gastroenterology', rating: 4.5, experience: 9, nextAvailable: 'Fri 3:20 PM', bio: 'Focused on acidity, indigestion, IBS, and food intolerance management.' },
  { id: 'dr-das', name: 'Dr. Rohan Das', specialty: 'Ophthalmology', rating: 4.6, experience: 11, nextAvailable: 'Sat 1:15 PM', bio: 'Manages eye strain, dry eyes, conjunctivitis, and routine vision care.' },
  { id: 'dr-kulkarni', name: 'Dr. Priya Kulkarni', specialty: 'Dentistry', rating: 4.5, experience: 12, nextAvailable: 'Mon 12:00 PM', bio: 'Treats toothache, cavities, sensitivity, and preventive dental care.' },
  { id: 'dr-sinha', name: 'Dr. Arjun Sinha', specialty: 'General Medicine', rating: 4.6, experience: 7, nextAvailable: 'Today 6:10 PM', bio: 'Common colds, flu-like symptoms, headaches, and minor infections.' },
  { id: 'dr-bose', name: 'Dr. Leena Bose', specialty: 'Dermatology', rating: 4.7, experience: 10, nextAvailable: 'Thu 4:40 PM', bio: 'Rashes, hives, fungal infections, and everyday skin concerns.' },
]

export const doctorsById = Object.fromEntries(doctors.map((d) => [d.id, d]))
import { createContext, useContext, useMemo, useState } from 'react'

const I18nContext = createContext(null)

const dict = {
  en: {
    navbar: {
      records: 'Records',
      appointments: 'Appointments',
      doctors: 'Doctors',
      symptomChecker: 'Symptom Checker',
      consultations: 'Consultations',
      prescriptions: 'Prescriptions',
      notifications: 'Notifications',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      login: 'Login',
      register: 'Register',
      language: 'Language',
    },
    doctors: {
      title: 'Doctors',
      filterBy: 'Filtered by specialty',
      browse: 'Browse specialists and book your consultation.',
      viewProfile: 'View Profile',
      book: 'Book Appointment',
      schedule: 'Schedule Consultation',
      startVideo: 'Start Secure Video Consult',
      backToList: 'Back to list',
      notFoundTitle: 'Doctor Not Found',
      notFoundHelp: 'Please return to the list and choose another doctor.',
    },
    symptom: {
      title: 'Symptom Checker',
      describe: 'Describe your symptoms to get a recommended specialty and severity.',
      field: 'Symptoms',
      analyze: 'Analyze',
      clear: 'Clear',
      suggested: 'Suggested Care',
      recommended: 'Recommended specialty',
      severity: 'Severity',
      unlocked: 'Consultation access unlocked. We recommend speaking to a doctor.',
      low: 'Consider self‑care or a routine check. You can still consult a doctor.',
      browseDoctors: 'Browse Doctors',
      bookAppointment: 'Book Appointment',
      startConsult: 'Start Video Consult',
    },
    chat: {
      title: 'Health Assistant',
      placeholder: 'Describe your symptoms or ask a question…',
      hello: 'Hi! I can suggest a specialty and help you consult a doctor.',
      typePrompt: 'Tell me your symptoms to begin.',
      recommended: 'Recommended specialty',
      severity: 'Severity',
      actions: 'Actions',
      browseDoctors: 'Browse Doctors',
      bookAppointment: 'Book Appointment',
      startConsult: 'Start Video Consult',
    },
  },
  hi: {
    navbar: {
      records: 'रिकॉर्ड्स',
      appointments: 'अपॉइंटमेंट्स',
      doctors: 'डॉक्टर्स',
      symptomChecker: 'लक्षण जाँच',
      consultations: 'कंसल्टेशन',
      prescriptions: 'प्रिस्क्रिप्शन',
      notifications: 'सूचनाएं',
      signIn: 'साइन इन',
      signUp: 'रजिस्टर',
      login: 'लॉगिन',
      register: 'रजिस्टर',
      language: 'भाषा',
    },
    doctors: {
      title: 'डॉक्टर्स',
      filterBy: 'विशेषता के अनुसार फ़िल्टर',
      browse: 'विशेषज्ञों को ब्राउज़ करें और अपनी कंसल्टेशन बुक करें।',
      viewProfile: 'प्रोफ़ाइल देखें',
      book: 'अपॉइंटमेंट बुक करें',
      schedule: 'कंसल्टेशन शेड्यूल करें',
      startVideo: 'वीडियो कंसल्ट शुरू करें',
      backToList: 'सूची पर वापस जाएँ',
      notFoundTitle: 'डॉक्टर नहीं मिला',
      notFoundHelp: 'कृपया सूची पर वापस जाएँ और कोई अन्य डॉक्टर चुनें।',
    },
    symptom: {
      title: 'लक्षण जाँच',
      describe: 'अनुशंसित विशेषज्ञता और गंभीरता के लिए अपने लक्षण लिखें।',
      field: 'लक्षण',
      analyze: 'विश्लेषण करें',
      clear: 'हटाएँ',
      suggested: 'सुझाया गया देखभाल',
      recommended: 'अनुशंसित विशेषज्ञता',
      severity: 'गंभीरता',
      unlocked: 'कंसल्टेशन एक्सेस उपलब्ध है। डॉक्टर से बात करने की सलाह है।',
      low: 'स्व-देखभाल या नियमित जाँच पर विचार करें। आप डॉक्टर से बात कर सकते हैं।',
      browseDoctors: 'डॉक्टर्स देखें',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      startConsult: 'वीडियो कंसल्ट शुरू करें',
    },
    chat: {
      title: 'हेल्थ असिस्टेंट',
      placeholder: 'अपने लक्षण लिखें या कोई सवाल पूछें…',
      hello: 'नमस्ते! मैं विशेषज्ञता सुझा सकता हूँ और डॉक्टर से बात करने में मदद करूँगा।',
      typePrompt: 'शुरू करने के लिए अपने लक्षण बताएं।',
      recommended: 'अनुशंसित विशेषज्ञता',
      severity: 'गंभीरता',
      actions: 'क्रियाएँ',
      browseDoctors: 'डॉक्टर्स देखें',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      startConsult: 'वीडियो कंसल्ट शुरू करें',
    },
  },
}

function get(dictObj, path) {
  return path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dictObj)
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('en')
  const value = useMemo(() => ({
    lang,
    setLang,
    t: (key) => get(dict[lang], key) ?? get(dict.en, key) ?? key,
  }), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
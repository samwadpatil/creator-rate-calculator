import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, limit, query, orderBy, serverTimestamp, increment, doc, setDoc } from "firebase/firestore";

// These are your real Firebase configuration details from your screenshot!
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyCRI14NFO02vk2qNajNOnFc_ul7AKZJdI",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "creator-calculator-409e3.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "creator-calculator-409e3",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "creator-calculator-409e3.firebasestorage.app",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "659074296879",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:659074296879:web:93e80b6f1026fb4c5d2ada",
  measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || "G-6DN2Z72N9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Graceful tracker helper
export async function trackVisitInFirestore() {
  try {
    // Increment a total visits counter document
    const statsRef = doc(db, "analytics", "overview");
    await setDoc(statsRef, {
      totalVisits: increment(1)
    }, { merge: true });
    console.log("Visit tracked successfully in Firestore!");
  } catch (err) {
    console.warn("Firestore trackVisit skipped (make sure Firestore Database is created in your Firebase Console):", err);
  }
}

export async function trackCalculationInFirestore(followers: number, niche: string, dealValue: number, currency: string) {
  try {
    // 1. Log the calculation to a recent list
    const calculationsRef = collection(db, "calculations");
    await addDoc(calculationsRef, {
      followers,
      niche,
      dealValue,
      currency,
      timestamp: serverTimestamp()
    });

    // 2. Increment stats
    const statsRef = doc(db, "analytics", "overview");
    const valInINR = currency === "USD" ? dealValue * 83 : dealValue;
    await setDoc(statsRef, {
      totalCalculations: increment(1),
      totalDealValueINR: increment(Math.round(valInINR))
    }, { merge: true });

    // 3. Increment niche-specific counter
    const nicheRef = doc(db, "niches", niche);
    await setDoc(nicheRef, {
      count: increment(1)
    }, { merge: true });

    console.log("Calculation logged successfully in Firestore!");
  } catch (err) {
    console.warn("Firestore trackCalculation skipped (make sure Firestore Database is created in your Firebase Console):", err);
  }
}

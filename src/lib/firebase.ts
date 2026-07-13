import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User
} from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, increment, doc, setDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase using the real provisioned credentials
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore with specified database ID, or default if empty
const configWithDb = firebaseConfig as { firestoreDatabaseId?: string };
export const db = configWithDb.firestoreDatabaseId 
  ? getFirestore(app, configWithDb.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Graceful tracker helper
export async function trackVisitInFirestore() {
  if (!auth.currentUser) {
    console.log("Skipping trackVisitInFirestore: User not authenticated.");
    return;
  }
  const pathForWrite = "analytics/overview";
  try {
    const statsRef = doc(db, "analytics", "overview");
    await setDoc(statsRef, {
      totalVisits: increment(1)
    }, { merge: true });
    console.log("Visit tracked successfully in Firestore!");
  } catch (err) {
    console.warn("Firestore trackVisit skipped:", err);
    try {
      handleFirestoreError(err, OperationType.WRITE, pathForWrite);
    } catch (loggedErr) {
      // Keep it graceful for non-blocking tracker
    }
  }
}

export async function trackCalculationInFirestore(followers: number, niche: string, dealValue: number, currency: string) {
  if (!auth.currentUser) {
    console.log("Skipping trackCalculationInFirestore: User not authenticated.");
    return;
  }
  const calcPath = "calculations";
  const statsPath = "analytics/overview";
  const nichePath = `niches/${niche}`;

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

    // 2. Increment global stats
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
    console.warn("Firestore trackCalculation skipped:", err);
    try {
      handleFirestoreError(err, OperationType.WRITE, `${calcPath} or ${statsPath} or ${nichePath}`);
    } catch (loggedErr) {
      // Keep it graceful for non-blocking tracker
    }
  }
}

// Appointment Interface
export interface AppointmentData {
  creatorName: string;
  brandName: string;
  followers: number;
  niche: string;
  dealValue: number;
  currency: string;
  appointmentDate: string;
  appointmentTime: string;
  topic: string;
  notes: string;
}

// Book appointment in Firestore
export async function bookAppointmentInFirestore(userId: string, email: string, appointment: AppointmentData) {
  const pathForWrite = "appointments";
  try {
    const appointmentsRef = collection(db, "appointments");
    const docRef = await addDoc(appointmentsRef, {
      userId,
      email,
      ...appointment,
      createdAt: serverTimestamp()
    });
    console.log("Appointment booked successfully in Firestore with ID: ", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("Firestore bookAppointment error: ", err);
    handleFirestoreError(err, OperationType.WRITE, pathForWrite);
  }
}


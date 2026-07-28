import * as admin from 'firebase-admin';

// Sanitizer function for OpenSSL DECODER routines error
function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  
  return key
    // Remove outer double or single quotes if stored with them
    .replace(/^["']|["']$/g, '')
    // Replace escaped newlines with actual newline characters
    .replace(/\\n/g, '\n');
}

const projectId = 
  process.env.FIREBASE_ADMIN_PROJECT_ID || 
  process.env.FIREBASE_PROJECT_ID || 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
  "imtiyaz-surjapuri";

const clientEmail = 
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 
  process.env.FIREBASE_CLIENT_EMAIL || 
  "firebase-adminsdk-fbsvc@imtiyaz-surjapuri.iam.gserviceaccount.com";

const rawPrivateKey = 
  process.env.FIREBASE_ADMIN_PRIVATE_KEY || 
  process.env.FIREBASE_PRIVATE_KEY;

const privateKey = formatPrivateKey(rawPrivateKey);

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (e) {
      console.error("Firebase admin initialization failed:", e);
      admin.initializeApp({ projectId });
    }
  } else {
    admin.initializeApp({ projectId });
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const db = adminDb;

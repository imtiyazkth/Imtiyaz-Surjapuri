import * as admin from 'firebase-admin';

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

const privateKey = rawPrivateKey 
  ? rawPrivateKey.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    admin.initializeApp({
      projectId: projectId,
    });
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const db = adminDb;

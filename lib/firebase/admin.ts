import * as admin from "firebase-admin";

function formatPrivateKey(key: string | undefined) {
  if (!key) return undefined;
  // Handle double escaped newlines and literal quotes
  return key.replace(/\\n/g, "\n").replace(/^"|"$/g, "");
}

if (!admin.apps.length) {
  try {
    const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    const privateKey = formatPrivateKey(rawKey);
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_ADMIN_PROJECT_ID || "imtiyaz-site";

    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      admin.initializeApp({
        projectId,
      });
    }
  } catch (error) {
    console.error("Firebase Admin Init Error:", error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const db = adminDb;

import { adminDb } from "@/lib/firebase/admin";
import type { Category } from "@/types/category";

const COLLECTION = "categories";

export async function getAllCategories(visibleOnly = true): Promise<Category[]> {
  let q = adminDb.collection(COLLECTION).orderBy("order", "asc");

  if (visibleOnly) {
    q = adminDb
      .collection(COLLECTION)
      .where("visible", "==", true)
      .orderBy("order", "asc");
  }

  const snap = await q.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const snap = await adminDb
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Category;
}

export async function createCategory(
  data: Omit<Category, "id">
): Promise<string> {
  const ref = await adminDb.collection(COLLECTION).add(data);
  return ref.id;
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update(data);
}

export async function deleteCategory(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}

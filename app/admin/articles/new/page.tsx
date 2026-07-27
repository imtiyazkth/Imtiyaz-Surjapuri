import type { Metadata } from "next";
import { getAllCategories } from "@/lib/db/categories";
import ArticleEditor from "@/components/admin/ArticleEditor";

export const metadata: Metadata = { title: "New Article" };

export default async function NewArticlePage() {
  const categories = await getAllCategories(false);
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-6">
        New Article
      </h1>
      <ArticleEditor categories={categories} />
    </div>
  );
}

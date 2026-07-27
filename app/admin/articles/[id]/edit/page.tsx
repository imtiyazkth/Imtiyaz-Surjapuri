import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/db/articles";
import { getAllCategories } from "@/lib/db/categories";
import ArticleEditor from "@/components/admin/ArticleEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Edit Article" };
export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticleById(id),
    getAllCategories(false),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-6">
        Edit Article
      </h1>
      <ArticleEditor article={article} categories={categories} />
    </div>
  );
}

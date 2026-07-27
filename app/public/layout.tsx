import { getAllCategories } from "@/lib/db/categories";
import { getBreakingArticles } from "@/lib/db/articles";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import BreakingTicker from "@/components/layout/BreakingTicker";
import Footer from "@/components/layout/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, breakingArticles] = await Promise.all([
    getAllCategories(true),
    getBreakingArticles(6),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <Navbar categories={categories} />
      {breakingArticles.length > 0 && (
        <BreakingTicker articles={breakingArticles} />
      )}
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </div>
  );
}

// Public route group layout — wraps /articles, /categories, /search, /tags
// Header, Navbar, Footer are rendered inside each page's own client component
// OR we use a minimal shell here without Firestore calls
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)" }}>
      <TopBar />
      <Header />
      {/* Navbar is rendered in each page to allow category-specific highlighting */}
      <main style={{ flex:1 }}>{children}</main>
      <Footer />
    </div>
  );
}

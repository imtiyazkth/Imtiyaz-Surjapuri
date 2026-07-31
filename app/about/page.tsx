import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "About — ImtiyazSurjapuri.com",
  description: "About Imtiyaz Surjapuri — Independent journalist, analyst, and commentator.",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)" }}>
      <TopBar />
      <Header />

      <main style={{ flex:1 }}>
        <div className="main-container" style={{ maxWidth:"800px" }}>

          {/* Hero */}
          <div style={{
            textAlign:"center", padding:"48px 24px 40px",
            marginBottom:"40px",
            background:"var(--bg-card)",
            border:"1px solid var(--border)",
            borderRadius:"20px"
          }}>
            <div style={{
              width:"100px", height:"100px", borderRadius:"50%",
              background:"linear-gradient(135deg, var(--brand-red), #7c3aed)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 20px", fontSize:"2.5rem"
            }}>
              🖊
            </div>
            <h1 style={{
              fontFamily:"var(--font-playfair)", fontWeight:800,
              fontSize:"2rem", color:"var(--text-1)", marginBottom:"8px"
            }}>
              Imtiyaz Surjapuri
            </h1>
            <p style={{
              fontSize:"1rem", color:"var(--brand-red)",
              fontWeight:600, marginBottom:"16px"
            }}>
              Independent Journalist · Analyst · Commentator
            </p>
            <p style={{
              fontSize:"0.95rem", color:"var(--text-2)",
              lineHeight:1.7, maxWidth:"520px", margin:"0 auto"
            }}>
              Speaking truth without fear. Covering political affairs,
              social issues, economy, and the world from an independent perspective.
            </p>

            {/* Social links */}
            <div style={{
              display:"flex", gap:"12px", justifyContent:"center",
              marginTop:"24px", flexWrap:"wrap"
            }}>
              {[
                { href:"https://www.facebook.com/ImtiyaSurjapuri",   label:"Facebook",  color:"#1877F2" },
                { href:"https://www.instagram.com/ImtiyazSurjapuri", label:"Instagram", color:"#E1306C" },
                { href:"https://x.com/Imtiyazkth",                   label:"X",         color:"#000"    },
                { href:"https://youtube.com/@imtiyazvedio",           label:"YouTube",   color:"#FF0000" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    padding:"8px 18px", borderRadius:"20px",
                    background: s.color, color:"#fff",
                    fontSize:"0.82rem", fontWeight:700,
                    textDecoration:"none"
                  }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* About content */}
          <div className="article-body" style={{ maxWidth:"none" }}>
            <h2>About This Website</h2>
            <p>
              <strong>ImtiyazSurjapuri.com</strong> is an independent news and analysis
              platform covering politics, social affairs, economy, education, and world events.
              The site aims to provide in-depth analysis and commentary that goes beyond
              surface-level reporting.
            </p>

            <h2>Editorial Values</h2>
            <ul>
              <li><strong>Independence:</strong> No corporate or political affiliation. Opinions are my own.</li>
              <li><strong>Accuracy:</strong> Every claim is researched and sourced to the best of our ability.</li>
              <li><strong>Transparency:</strong> When opinions are expressed, they are clearly labeled as such.</li>
              <li><strong>Accountability:</strong> Corrections are issued promptly when errors are found.</li>
            </ul>

            <h2>Coverage Areas</h2>
            <ul>
              <li>🏛 Political Affairs — India, South Asia, and global politics</li>
              <li>👥 Social Issues — Community, rights, and social justice</li>
              <li>📈 Economy — Markets, policy, and economic analysis</li>
              <li>🎓 Education — Policy, access, and opportunities</li>
              <li>🌍 World Affairs — International news and analysis</li>
              <li>💻 Technology — Digital India, AI, and innovation</li>
            </ul>

            <h2>Contact & Collaboration</h2>
            <p>
              For story tips, feedback, interview requests, or collaboration:
            </p>
            <p>
              📧 <a href="mailto:supportsurjapuri@gmail.com">supportsurjapuri@gmail.com</a>
              <br />
              🌐 <Link href="/contact">Contact Page</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

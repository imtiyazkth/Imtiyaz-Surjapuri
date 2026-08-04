import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Use — iSurjapuri",
  description: "Terms of Use for iSurjapuri",
};

export default function TermsPage() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)" }}>
      <TopBar />
      <Header />

      <main style={{ flex:1 }}>
        <div className="main-container" style={{ maxWidth:"800px" }}>
          <div style={{ marginBottom:"32px" }}>
            <h1 style={{
              fontFamily:"var(--font-playfair)", fontWeight:800,
              fontSize:"2rem", color:"var(--text-1)", marginBottom:"8px"
            }}>
              Terms of Use
            </h1>
            <p style={{ fontSize:"0.82rem", color:"var(--text-3)" }}>
              Last updated: July 2026
            </p>
          </div>

          <div className="article-body" style={{ maxWidth:"none" }}>
            <p>
              By accessing and using <strong>iSurjapuri</strong> (the &quot;Site&quot;),
              you agree to be bound by these Terms of Use. If you do not agree,
              please do not use this Site.
            </p>

            <h2>1. Content Ownership</h2>
            <p>
              All articles, analyses, commentary, images, and other content published on this
              Site are the intellectual property of <strong>Imtiyaz Surjapuri</strong> unless
              otherwise stated. Content is protected under applicable copyright laws.
            </p>
            <p>You may:</p>
            <ul>
              <li>Share links to articles on social media with proper attribution.</li>
              <li>Quote brief excerpts (max 100 words) with a link back to the original.</li>
            </ul>
            <p>You may <strong>not</strong>:</p>
            <ul>
              <li>Reproduce full articles without written permission.</li>
              <li>Use content for commercial purposes without authorization.</li>
              <li>Claim authorship of any content from this Site.</li>
            </ul>

            <h2>2. Disclaimer</h2>
            <p>
              Content on this Site represents the personal opinions and analysis of the author.
              It is provided for informational purposes only and does not constitute legal,
              financial, medical, or professional advice.
            </p>
            <p>
              While we strive for accuracy, we make no guarantees about the completeness
              or reliability of any information. Readers are encouraged to verify facts
              independently before making decisions.
            </p>

            <h2>3. External Links</h2>
            <p>
              This Site may contain links to third-party websites. These links are provided
              for convenience only. We have no control over and assume no responsibility
              for the content, privacy policies, or practices of any third-party sites.
            </p>

            <h2>4. User Conduct</h2>
            <p>When using this Site, you agree not to:</p>
            <ul>
              <li>Attempt to gain unauthorized access to any part of the Site.</li>
              <li>Use automated tools to scrape or harvest content.</li>
              <li>Transmit any malicious code or interfere with Site operations.</li>
              <li>Use the Site for any unlawful purpose.</li>
            </ul>

            <h2>5. Comments and User Submissions</h2>
            <p>
              If comment features are enabled in the future, users are responsible
              for the content they submit. We reserve the right to remove any
              content that violates these terms or applicable law.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, iSurjapuri and its
              author shall not be liable for any direct, indirect, incidental, or
              consequential damages arising from your use of this Site.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time.
              Continued use of the Site after changes are posted constitutes
              your acceptance of the revised Terms.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              applicable laws. Any disputes shall be resolved through appropriate
              legal channels.
            </p>

            <h2>9. Contact</h2>
            <p>
              For questions about these Terms, please contact:
              <br />
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

import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy — ImtiyazSurjapuri.com",
  description: "Privacy Policy for ImtiyazSurjapuri.com",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p style={{ fontSize:"0.82rem", color:"var(--text-3)" }}>
              Last updated: July 2026
            </p>
          </div>

          <div className="article-body" style={{ maxWidth:"none" }}>
            <p>
              Welcome to <strong>ImtiyazSurjapuri.com</strong>. Your privacy is important to us.
              This Privacy Policy explains how we collect, use, and protect your information
              when you visit our website.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We collect minimal information necessary to operate the site:</p>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, time spent, and browser type — collected anonymously via analytics.</li>
              <li><strong>Contact Form:</strong> If you submit a message via our contact form, we collect your name and email address to respond to you.</li>
              <li><strong>Cookies:</strong> We use cookies for site functionality (e.g., dark mode preference). No tracking cookies are placed without consent.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To provide and improve our content and services.</li>
              <li>To respond to your messages and inquiries.</li>
              <li>To analyze site usage and improve user experience.</li>
              <li>We do <strong>not</strong> sell, trade, or share your personal information with third parties.</li>
            </ul>

            <h2>3. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Firebase (Google):</strong> Database and authentication backend. Subject to <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a>.</li>
              <li><strong>Vercel:</strong> Hosting and deployment. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel&apos;s Privacy Policy</a>.</li>
              <li><strong>YouTube:</strong> Embedded videos use YouTube&apos;s privacy-enhanced mode (youtube-nocookie.com).</li>
            </ul>

            <h2>4. Cookies</h2>
            <p>
              Our site uses cookies only for essential functionality:
            </p>
            <ul>
              <li><strong>Theme preference</strong> (dark/light mode) — stored in localStorage.</li>
              <li><strong>Admin session</strong> — HTTP-only secure cookie for authenticated administrators only. Not applicable to regular visitors.</li>
            </ul>
            <p>You can disable cookies in your browser settings. Some features may not function properly if cookies are disabled.</p>

            <h2>5. Data Retention</h2>
            <p>
              Contact form messages are retained for up to 90 days and then deleted.
              Analytics data is anonymous and retained for up to 12 months.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request deletion of any personal data you have submitted.</li>
              <li>Opt out of analytics tracking by using browser Do Not Track settings.</li>
              <li>Contact us with any privacy concerns.</li>
            </ul>

            <h2>7. Children&apos;s Privacy</h2>
            <p>
              This website is not directed at children under 13 years of age.
              We do not knowingly collect personal information from children.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time.
              Changes will be posted on this page with an updated date.
              Continued use of the site constitutes acceptance of any changes.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
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

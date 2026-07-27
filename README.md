# ImtiyazSurjapuri.com

> A secure, modern news/blog platform built with Next.js, Firebase, and Tailwind CSS.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | Next.js 16 (App Router), TypeScript |
| Styling      | Tailwind CSS v4                     |
| Database     | Cloud Firestore                     |
| Auth         | Firebase Authentication             |
| Storage      | Firebase Storage                    |
| Deployment   | Vercel (recommended) or Firebase Hosting |
| Version control | GitHub (via Termux on Android)   |

---

## Initial Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/imtiyazsurjapuri-com.git
cd imtiyazsurjapuri-com
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your real Firebase credentials
nano .env.local
```

### 4. Run development server

```bash
npm run dev
# Open http://localhost:3000
```

---

## Firebase Setup (One-time)

### Step 1 — Create Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `imtiyazsurjapuri-com`
3. Disable Google Analytics (optional for free tier)

### Step 2 — Enable services

- **Authentication**: Enable → Email/Password provider
- **Firestore**: Create database → **Production mode** → choose region (asia-south1 for India/Qatar)
- **Storage**: Get started → Production mode

### Step 3 — Deploy security rules and indexes

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # select your project
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### Step 4 — Create admin user

1. Firebase Console → Authentication → Users → **Add user**
2. Enter your email and password
3. Copy the **UID** shown
4. Edit `scripts/migrate-from-sheet.ts` → replace `REPLACE_WITH_YOUR_FIREBASE_AUTH_UID`
5. Run: `npx tsx scripts/migrate-from-sheet.ts`

### Step 5 — Get credentials for .env.local

**Client credentials** (Project Settings → Your Apps → SDK setup):
- Copy `NEXT_PUBLIC_FIREBASE_*` values

**Admin credentials** (Project Settings → Service Accounts → Generate new private key):
- Download JSON file
- Copy `project_id`, `client_email`, `private_key` into `.env.local`

---

## Deployment — Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard:
# Settings → Environment Variables → add all from .env.local

# Deploy to production
vercel --prod
```

Then add your custom domain in Vercel → Settings → Domains.

---

## Deployment — Firebase Hosting (Alternative)

```bash
npm run build
firebase deploy --only hosting
```

Note: Firebase Hosting has limited support for Next.js server features.
**Vercel is strongly recommended** for full Next.js compatibility.

---

## Using from Termux (Android)

### Initial Termux setup

```bash
pkg update && pkg upgrade
pkg install git nodejs-lts
npm install -g firebase-tools
```

### Clone and set up

```bash
git clone https://github.com/YOUR_USERNAME/imtiyazsurjapuri-com.git
cd imtiyazsurjapuri-com
npm install
cp .env.example .env.local
nano .env.local   # fill in your credentials
```

### Daily Git workflow

```bash
# Make changes, then:
git add .
git commit -m "feat: add new article about topic"
git push origin main
# Vercel auto-deploys on push ✅
```

### Firebase login from Termux

```bash
firebase login --no-localhost
# Follow the URL shown → authenticate → paste token back
```

### Run migration from Termux

```bash
npx tsx scripts/migrate-from-sheet.ts
```

---

## Admin Panel

Visit: `https://yoursite.com/admin/login`

**Admin capabilities:**
- Create / edit / delete articles
- Rich text editor with image upload
- Embed YouTube videos
- Add social links per article
- Assign categories and tags
- Save drafts or publish immediately
- Toggle featured / breaking / trending flags

**Security:**
- HTTP-only session cookies (XSS-proof)
- Firebase Admin SDK session verification on every request
- Firestore rules deny all public writes
- Images validated server-side before upload

---

## Folder Structure

```
app/
  public/          → Public-facing pages (ISR)
  admin/           → Admin dashboard (auth-gated)
  api/             → Server-side API routes
components/
  article/         → Article cards, share buttons, like button
  admin/           → Editor, sidebar, table components
  layout/          → Header, navbar, footer, ticker
  seo/             → JSON-LD schema
lib/
  firebase/        → Client and Admin SDK init
  db/              → Firestore query helpers
  auth/            → Session and route guards
types/             → TypeScript interfaces
scripts/           → One-time migration scripts
```

---

## Google AdSense Readiness

- ✅ Original content (personal articles)
- ✅ About and Contact pages required
- ✅ Privacy Policy page (add at /privacy)
- ✅ No layout shift (next/image with dimensions)
- ✅ Mobile responsive
- ✅ HTTPS via Vercel
- ✅ Fast Core Web Vitals (ISR + CDN)
- ✅ Semantic HTML structure
- When approved: add `NEXT_PUBLIC_ADSENSE_ID` to Vercel environment variables

---

## Git Commit Style

```
feat: add new article editor tab
fix: correct like button counter
style: update hero grid spacing
docs: update README deployment guide
chore: upgrade firebase to v11.1
```

---

## File Count Summary

| Area         | Files |
|--------------|-------|
| Pages        | 12    |
| Components   | 20    |
| API Routes   | 8     |
| Lib/Utils    | 10    |
| Config/Rules | 8     |
| Scripts      | 1     |
| **Total**    | **59**|

---

*Built with security, performance, and mobile-first workflow in mind.*

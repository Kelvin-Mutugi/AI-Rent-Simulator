# AiPayingRent — 5 Minute YouTube Script

## 0:00 – 0:20 — Hook & Intro

**Spoken:**
"Hi, I’m [Your Name]. This is AiPayingRent — a simple app that automates rent payments and helps tenants and landlords avoid late fees. In the next five minutes I’ll show you the app, how it works, and what’s under the hood."

**On-screen / B‑roll:**

- App logo/title card
- Quick animated text: **Automate rent • Avoid late fees • Save time**

---

## 0:20 – 1:10 — Live Demo: Key Flow

**Spoken:**
"Let’s jump in. Here’s the homepage. I’ll quickly set up a tenant, connect a payment method, and schedule a monthly rent payment. The interface is clean — click, confirm, and the app does the rest."

**On‑screen / B‑roll:**

- Screen capture of `index.html` UI
- Cursor steps: add tenant → connect payment → schedule payment
- Overlay text: **Set up • Connect • Schedule**

**Editor note:** Speed up the setup to fit within 30 seconds; add callout arrows and short captions.

---

## 1:10 – 2:00 — Feature Highlights

**Spoken:**
"AiPayingRent includes: automated recurring payments, reminders, split rent between roommates, and predictive notifications to avoid insufficient funds. Everything runs locally in the UI and calls the payment API when you confirm a transaction."

**On‑screen / B‑roll:**

- Feature bullets popping in
- Quick demo of roommate split and reminder notification

---

## 2:00 – 3:00 — Tech Overview & Files

**Spoken:**
"Under the hood it’s a lightweight web app. The frontend files are `index.html`, `styles.css`, and `script.js`. `script.js` handles user interactions, validation, scheduling, and API calls. The backend (or payment provider) handles actual transactions."

**On‑screen / B‑roll:**

- Show project folder in editor: `index.html`, `script.js`, `styles.css`
- Zoom into `script.js` and highlight key functions

**Editor note:** Show code snippets for ~7–10 seconds each; highlight function names.

---

## 3:00 – 4:00 — Quick Code Walkthrough (narrated)

**Spoken:**
"Here are the important parts: an event listener for the schedule button, validation to check amounts and dates, a scheduler function that sets up recurring payments, and a fetch request to your payment API. Keep sensitive keys out of client code — use a backend or serverless function for production."

**On‑screen / B‑roll:**

- Highlight `addEventListener` lines
- Show pseudo `schedulePayment()` and `fetch('/api/pay')` callout
- Add a warning badge: **Never store API keys in client code**

---

## 4:00 – 4:35 — Use Cases & Benefits

**Spoken:**
"AiPayingRent is ideal for tenants, landlords, and property managers. It saves time, reduces missed payments, and provides simple analytics so you can see payment history and trends at a glance."

**On‑screen / B‑roll:**

- Icons for Tenant / Landlord / Manager
- Overlay: **Save time • Avoid fees • Track payments**

---

## 4:35 – 5:00 — Wrap Up & CTA

**Spoken:**
"Thanks for watching. If you want the code, check the GitHub repo (link below), try it locally, and let me know what features you’d like next. If you found this helpful, like, subscribe, and hit the bell for more dev demos."

**On‑screen / B‑roll:**

- End card with repo link, subscribe button, and quick steps: **Try • Fork • Contribute**
- Suggested description line and hashtags: #webdev #javascript #fintech #openSource

---

## Editing & SEO Tips

- Thumbnail idea: big bold title “Automate Rent Payments” + app screenshot ✅
- Description snippet: short repo link, quick install/run steps, contact info
- Suggested tags: `AiPayingRent`, `rent automation`, `javascript`, `beginner-friendly`

---

## Optional Additions (if you want them added to the file):

1. Adapt script to your voice & style
2. Generate a short video description and 3 clip timestamps for editing

---

_File created: `youtube-script.md` — edit as needed and let me know if you want a different format (plain `.txt`, `.md`, or `.docx`)._

# StandexAI Platform — Demo Guide

Use this as a script or checklist when recording a video demo of the platform. Go in order; pause on each section so viewers can read key text.

---

## Before you start

- Be signed in (or start from homepage and sign in).
- Use a single dataset for the whole demo (e.g. **Payments** or **CRM**) so the story is consistent.
- Keep the browser window at a fixed size (e.g. 1280×720 or 1920×1080).

---

## 1. Homepage (30–45 sec)

**URL:** `/`

**What to do:**

1. **Show the value prop**  
   Let the hero and headline sit on screen: “AI data readiness” / “Readiness Score” messaging.

2. **Point out the live ticker**  
   “We surface live events where AI models flag data issues — by model and severity.”

3. **Show the demo comparison**  
   Use the dataset selector (Payments, CRM, Finance). Click one and briefly show:  
   - Side‑by‑side model scores (GPT, Claude, Gemini).  
   - The single **Readiness Score** and tier (Excellent / Moderate / Critical).

4. **Go into the product**  
   Click **“Open Portal”** (or sign-in CTA) to open the console.

**Say something like:**  
“This is the public face of StandexAI. Visitors see live data risk and can try a dataset; signing in takes them into the full platform.”

---

## 2. Dashboard (45–60 sec)

**URL:** `/console`

**What to do:**

1. **Innovation strip**  
   Read or paraphrase the line: “Innovation by design. Monitor → Score → Correct → Certify in one defensible pipeline.”

2. **Pipeline cards**  
   Walk through the three cards:  
   - **Data Diagnostics** — “Profile: run live cross‑model diagnostics.”  
   - **Readiness Ledger** — “Score & Certify: full breakdown and certificates.”  
   - **Prompt Lab** — “Model & Align: define dataset truth, then verify with readiness scoring.”

3. **Live Readiness Scores**  
   Point at the table (e.g. Payments 47, CRM 87, Finance 94, Ops 61) and say:  
   “These are live readiness scores; the ledger holds the full history.”

4. **Right column**  
   - **Live Diagnostics Feed** — “Real-time feed of model issues by dataset and severity.”  
   - **Readiness Score Formula** — “One number from four factors: Schema Integrity 40%, Quality Signals 25%, Data Freshness 20%, Governance Coverage 15%.”  
   - **Prompt Lab CTA** — “You can jump from here into Prompt Lab to define dataset truth.”

5. **Start the main flow**  
   Click **“Run Diagnostics”** to go to Data Diagnostics.

**Say something like:**  
“The console is the control room: pipeline, live scores, formula, and one click into scanning.”

---

## 3. Data Diagnostics — Run a scan (1–1.5 min)

**URL:** `/data-diagnostics`

**What to do:**

1. **Search**  
   Type a dataset name (e.g. **Payments** or **CRM**) or click a preset (Payments, CRM, Finance, Ops, etc.).

2. **Click “Scan”**  
   Briefly show the loading state: “Querying AI Models — GPT-4o, Claude, Gemini in parallel.”

3. **Readiness Score banner**  
   When results load, focus on:  
   - The **big score** (e.g. 94) and **tier** (e.g. Excellent).  
   - Short copy: “Strong cross‑model consensus…” or “Immediate correction signals required…”  
   - “X flags detected” and Scan ID.

4. **Score breakdown (four cards)**  
   Point out:  
   - Factual Accuracy, Cross‑Model Consensus, Data Freshness, Hallucination Score.  
   - Weights (40%, 25%, 20%, 15%) and the bar lengths.

5. **Model responses — side by side**  
   Scroll to “Model Responses — Side by Side.”  
   - Show the three columns (GPT-4o, Claude, Gemini).  
   - For a model with flags: expand and show **claim**, **reason**, **severity**, and **suggestion**.  
   - For a clean model: “No discrepancies detected.”

6. **Email gate (optional)**  
   Show “Get Full Readiness Report” and “Download Readiness Certificate” to illustrate the lead capture and artifact.

**Say something like:**  
“One search runs three models in parallel. We normalize the outputs, run diagnostics, and produce one readiness score plus factor breakdown and evidence you can use for compliance.”

---

## 4. Readiness Ledger (45–60 sec)

**URL:** `/readiness-ledger`

**What to do:**

1. **Header**  
   “Readiness Ledger — Data Readiness Certificate Registry.”

2. **Top stats**  
   - Portfolio Readiness Score (average).  
   - Datasets Monitored.  
   - Active Risk Alerts.  
   - Total Flags Detected.

3. **Table of scans**  
   Show dataset, score, tier, flag count, last scan time.  
   Click one row to show detail (if the UI has a drill‑down).

4. **Actions**  
   - **New Diagnostic** → “Takes you back to Data Diagnostics.”  
   - **Readiness Certificate** → “Export/print for compliance.”

**Say something like:**  
“The ledger is the audit trail: every scan, score, and flag. You can export a Readiness Certificate for filings or boards.”

---

## 5. Prompt Lab (45–60 sec)

**URL:** `/prompt-lab`

**What to do:**

1. **Purpose**  
   “Here we define how the dataset should be modeled before we verify in Data Diagnostics.”

2. **Title**  
   Show “Data Model Blueprint” (or whatever you’ve set).  
   Status: “Data modeling studio.”

3. **Editor**  
   Scroll the main content: “Data model brief” and the placeholder about defining datasets and constraints.

4. **Schema Guardrails (right panel)**  
   - **Dataset overview / key fields** — “Summarize sources, business definitions, and analytical goals.”  
   - **Data constraints** — Schema lock, PII redaction, Referential integrity, Anomaly guardrails.  
   - **Apply to blueprint** button.

5. **Modeling readiness**  
   The three scores: Schema clarity, Quality readiness, Model-fit integrity.

6. **Data risks**  
   If there’s a sample risk (e.g. “Ambiguous primary key”), show the fix suggestion.

7. **Primary CTA**  
   “Run data diagnostics” — “This takes the blueprint context into the scan flow; we’re not deleting Prompt Lab, it’s the Model & Align step in the pipeline.”

**Say something like:**  
“Prompt Lab is where you set dataset truth and guardrails. Then you run diagnostics to get a Readiness Score and see if models align.”

---

## 6. Wrap (15–30 sec)

**What to do:**

- Return to **Dashboard** or **Data Diagnostics**.
- In one sentence, restate: “StandexAI: profile data readiness, get one score, correct and certify.”

---

## Quick reference — URLs

| Screen           | URL                      |
|-----------------|---------------------------|
| Homepage        | `/`                       |
| Console         | `/console`                |
| Data Diagnostics     | `/data-diagnostics`           |
| Readiness Ledger  | `/readiness-ledger`  |
| Prompt Lab      | `/prompt-lab`            |

---

## Suggested total length

- **Short demo:** 3–4 minutes (Homepage → Dashboard → Data Diagnostics scan → Ledger).
- **Full demo:** 5–7 minutes (add Prompt Lab and a bit more detail on formula and flags).

Use the same dataset (e.g. Payments) across Dashboard, Data Diagnostics, and Ledger so the narrative is clear.

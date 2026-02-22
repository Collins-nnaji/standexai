# StandexAI Platform — Demo Guide

Use this as a script or checklist when recording a video demo of the platform. Go in order; pause on each section so viewers can read key text.

---

## Before you start

- Be signed in (or start from homepage and sign in).
- Use a single brand for the whole demo (e.g. **Stripe** or **Monzo**) so the story is consistent.
- Keep the browser window at a fixed size (e.g. 1280×720 or 1920×1080).

---

## 1. Homepage (30–45 sec)

**URL:** `/`

**What to do:**

1. **Show the value prop**  
   Let the hero and headline sit on screen: “AI representation accuracy” / “Standex Score” messaging.

2. **Point out the live ticker**  
   “We surface live events where AI models misrepresent brands — by model and severity.”

3. **Show the demo comparison**  
   Use the brand selector (Monzo, Revolut, Stripe). Click one and briefly show:  
   - Side‑by‑side model scores (GPT, Claude, Gemini).  
   - The single **Standex Score** and tier (Excellent / Moderate / Critical).

4. **Go into the product**  
   Click **“Standex Score Portal”** (or **“Get started”** / sign-in CTA) to open the dashboard.

**Say something like:**  
“This is the public face of StandexAI. Visitors see live risk and can try a brand; signing in takes them into the full platform.”

---

## 2. Dashboard (45–60 sec)

**URL:** `/dashboard`

**What to do:**

1. **Innovation strip**  
   Read or paraphrase the line: “Innovation by design. Monitor → Score → Correct → Certify in one defensible pipeline.”

2. **Pipeline cards**  
   Walk through the three cards:  
   - **Brand Pulse** — “Monitor: run live cross‑model scans.”  
   - **Standex Score Ledger** — “Score & Certify: full breakdown and certificates.”  
   - **Prompt Lab** — “Correct & Build: define brand truth, then verify with Standex Score.”

3. **Live Standex Scores**  
   Point at the table (e.g. Monzo 47, Revolut 87, Stripe 94, HSBC 61) and say:  
   “These are live Standex Scores; the ledger holds the full history.”

4. **Right column**  
   - **Live Hallucination Feed** — “Real-time feed of model errors by brand and severity.”  
   - **Standex Score Formula** — “One number from four factors: Factual Accuracy 40%, Cross‑Model Consensus 25%, Data Freshness 20%, Hallucination 15%.”  
   - **Prompt Lab CTA** — “You can jump from here into Prompt Lab to define brand truth.”

5. **Start the main flow**  
   Click **“Scan a Brand”** to go to Brand Pulse.

**Say something like:**  
“The dashboard is the control room: pipeline, live scores, formula, and one click into scanning.”

---

## 3. Brand Pulse — Run a scan (1–1.5 min)

**URL:** `/brand-pulse`

**What to do:**

1. **Search**  
   Type a brand name (e.g. **Stripe** or **Monzo**) or click a preset (Monzo, Revolut, Stripe, HSBC, etc.).

2. **Click “Scan”**  
   Briefly show the loading state: “Querying AI Models — GPT-4o, Claude, Gemini in parallel.”

3. **Standex Score banner**  
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
   Show “Get Full Standex Score Report” and “Download Standex Score Certificate” to illustrate the lead capture and artifact.

**Say something like:**  
“One search runs three models in parallel. We normalize the outputs, run our discrepancy engine, and produce one Standex Score plus factor breakdown and evidence you can use for compliance.”

---

## 4. Standex Score Ledger (45–60 sec)

**URL:** `/standex-score-ledger`

**What to do:**

1. **Header**  
   “Standex Score Ledger — Brand Accuracy Certificate Registry.”

2. **Top stats**  
   - Portfolio Standex Score (average).  
   - Brands Monitored.  
   - Active Risk Alerts.  
   - Total Flags Detected.

3. **Table of scans**  
   Show brand, score, tier, flag count, last scan time.  
   Click one row to show detail (if the UI has a drill‑down).

4. **Actions**  
   - **New Scan** → “Takes you back to Brand Pulse.”  
   - **Standex Score Certificate** → “Export/print for compliance.”

**Say something like:**  
“The ledger is the audit trail: every scan, score, and flag. You can export a Standex Score Certificate for filings or boards.”

---

## 5. Prompt Lab (45–60 sec)

**URL:** `/prompt-lab`

**What to do:**

1. **Purpose**  
   “Here we define how the brand should be represented before we verify in Brand Pulse.”

2. **Title**  
   Show “Brand Truth Blueprint” (or whatever you’ve set).  
   Status: “Representation studio.”

3. **Editor**  
   Scroll the main content: “Brand representation brief” and the placeholder about defining brand truth and key facts.

4. **Representation Guardrails (right panel)**  
   - **Brand truth / key facts** — “What should AI say about your brand?”  
   - **Representation constraints** — Zero Hallucination, Factual lock, Format strictness, Adversarial filter.  
   - **Apply to blueprint** button.

5. **Representation readiness**  
   The three scores: Factual clarity, Consensus‑ready, Representation integrity.

6. **Representation risks**  
   If there’s a sample risk (e.g. “Unclear brand attribution”), show the fix suggestion.

7. **Primary CTA**  
   “Run in Brand Pulse” — “This takes the blueprint context into the scan flow; we’re not deleting Prompt Lab, it’s the Correct & Build step in the pipeline.”

**Say something like:**  
“Prompt Lab is where you set brand truth and guardrails. Then you run a scan in Brand Pulse to get a Standex Score and see if models align.”

---

## 6. Wrap (15–30 sec)

**What to do:**

- Return to **Dashboard** or **Brand Pulse**.
- In one sentence, restate: “StandexAI: monitor how AI represents your brand, get one Standex Score, correct and certify.”

---

## Quick reference — URLs

| Screen           | URL                      |
|-----------------|---------------------------|
| Homepage        | `/`                       |
| Dashboard       | `/dashboard`              |
| Brand Pulse     | `/brand-pulse`           |
| Standex Ledger  | `/standex-score-ledger`  |
| Prompt Lab      | `/prompt-lab`            |

---

## Suggested total length

- **Short demo:** 3–4 minutes (Homepage → Dashboard → Brand Pulse scan → Ledger).
- **Full demo:** 5–7 minutes (add Prompt Lab and a bit more detail on formula and flags).

Use the same brand (e.g. Stripe) across Dashboard, Brand Pulse, and Ledger so the narrative is clear.

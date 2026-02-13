# StandexAI - Complete Product & Implementation Plan

**Version:** 1.0
**Date:** February 2026
**Product:** Compliance-First Content Intelligence Platform

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Information Architecture](#information-architecture)
4. [Design System](#design-system)
5. [Key Screens & Wireframes](#key-screens--wireframes)
6. [Feature Prioritization](#feature-prioritization)
7. [Technical Architecture](#technical-architecture)
8. [Compliance Scoring Algorithm](#compliance-scoring-algorithm)
9. [Real-Time Flagging UX](#real-time-flagging-ux)
10. [Onboarding Flow](#onboarding-flow)
11. [Differentiation Strategies](#differentiation-strategies)
12. [Implementation Plan](#implementation-plan)
13. [Database Schema](#database-schema)

---

## Executive Summary

### Key Recommendations

**1. Primary UX Improvement: Split-Pane Editor with Live Compliance Intelligence**
The core experience should center on a **Grammarly-meets-Notion** editor with three panels:
- **Left**: Content editor with inline compliance highlights
- **Right**: Live compliance dashboard showing scores, flags, and suggestions
- **Bottom (collapsible)**: SEO optimization panel with keyword tracking

**2. Trust-Building Design System**
Use a **professional, medical-grade** color palette that signals reliability:
- Primary: Deep Blue (#1E3A8A) - Trust, compliance
- Accent: Emerald Green (#059669) - Approval, success
- Warning: Amber (#D97706) - Caution
- Critical: Rose Red (#E11D48) - Risk

**3. MVP Priority: Compliance-First, SEO-Second**
Launch with the **unique differentiator** (compliance checking) fully polished before adding standard SEO features. This prevents commoditization.

### Biggest UX Improvements Needed

1. **Single Source of Truth Editor**: Users shouldn't toggle between "edit mode" and "review mode" - everything happens in one intelligent workspace
2. **Progressive Risk Scoring**: Show compliance risk in real-time as a living score (not just a final grade)
3. **"Safe Suggestions" UI Pattern**: Every flagged item must show 1-3 compliant alternatives with one-click acceptance
4. **Audit Trail Transparency**: Make version history and compliance sign-offs visible but not obtrusive
5. **Context-Aware Onboarding**: Different first-run experiences for fintech vs healthcare vs insurance users

### Priority Features for MVP (4-6 Week Launch)

**Must-Have Core:**
1. Real-time compliance flagging engine
2. Split-pane content editor with inline highlights
3. Compliance score calculator (0-100)
4. Industry-specific rule library (start with fintech + insurance)
5. Basic SEO scoring (keyword density, readability)
6. Content brief generator (competitive analysis + compliance guidelines)
7. Export/approval workflow (PDF with compliance report)
8. Single-user authentication

---

## Product Vision

**StandexAI** is a compliance-first content intelligence platform for regulated industries (fintech, insurance, lending, healthcare, SaaS).

### The Problem

Content teams in regulated industries face a critical challenge:
- Legal/compliance teams reject content due to risky language
- Writers lack regulatory expertise
- SEO tools don't understand compliance constraints
- Manual compliance review is slow and expensive
- One mistake can result in regulatory fines

### The Solution

StandexAI helps content teams:
1. **Catch risky claims** before legal/compliance escalation
2. **Optimize content** for both SEO and regulatory compliance simultaneously
3. **Improve for AI discoverability** (GEO - Generative Engine Optimization)
4. **Standardize quality** across writers
5. **Maintain audit trails** for regulatory compliance

### Primary Users

- Content teams in regulated industries
- SEO/Growth teams
- Compliance/Legal reviewers
- Marketing agencies with regulated clients

---

## Information Architecture

### Site Map

```
StandexAI/
│
├── Dashboard (Home)
│   ├── Overview Metrics
│   ├── Recent Content
│   ├── Pending Approvals
│   └── Quick Actions
│
├── Editor (Core Workspace)
│   ├── Content Input
│   ├── Compliance Panel (right sidebar)
│   ├── SEO Panel (bottom drawer)
│   └── Brief Generator (modal/slide-over)
│
├── Content Library
│   ├── All Content (list view)
│   ├── By Status (Draft/Review/Approved/Published)
│   ├── By Risk Level (Critical/High/Medium/Low)
│   └── Templates
│
├── Compliance Hub
│   ├── Rule Library (industry-specific)
│   ├── Flagged Content (needs attention)
│   ├── Audit Trail (version history)
│   └── Custom Rules (v2.0 feature)
│
├── Analytics
│   ├── Compliance Trends
│   ├── SEO Performance
│   ├── Team Performance (v1.5)
│   └── Reports & Exports
│
└── Settings
    ├── Industry Configuration
    ├── Team & Users (v1.5)
    ├── Integrations (v2.0)
    └── Billing
```

### Primary User Flow

```
1. Sign Up → Select Industry → Configure Compliance Preferences
                    ↓
2. Welcome Tour → Sample Content Walkthrough
                    ↓
3. "Create Your First Content" → Choose Template or Start Blank
                    ↓
4. Enter Editor → See Live Compliance Checking
                    ↓
5. Fix Flagged Items → See Score Improve
                    ↓
6. Generate Brief (optional) → Export/Approve → Done
```

---

## Design System

### Color Palette

**Primary Colors:**
```
Deep Blue (Primary):     #1E3A8A (Trust, authority)
Sky Blue (Light):        #E0F2FE (Backgrounds, hover states)

Emerald Green (Success): #059669 (Approved, compliant)
Light Green:             #D1FAE5 (Success backgrounds)

Amber (Warning):         #D97706 (Medium risk)
Light Amber:             #FEF3C7 (Warning backgrounds)

Rose Red (Critical):     #E11D48 (High risk, errors)
Light Rose:              #FFE4E6 (Critical backgrounds)
```

**Neutral Scale:**
```
Gray 950 (Text):         #0F172A
Gray 700 (Secondary):    #334155
Gray 400 (Borders):      #94A3B8
Gray 100 (Backgrounds):  #F1F5F9
White:                   #FFFFFF
```

### Typography

**Font Stack:**
- **UI Text**: Inter (clean, professional, excellent readability)
- **Editor Content**: iA Writer Quattro or System UI (writer-friendly)
- **Code/Data**: JetBrains Mono (monospace for compliance rules)

**Scale:**
```
Heading 1 (Page Titles):     32px / 2rem - font-bold
Heading 2 (Section):         24px / 1.5rem - font-semibold
Heading 3 (Subsection):      20px / 1.25rem - font-semibold
Body Large:                  18px / 1.125rem - font-normal
Body (Default):              16px / 1rem - font-normal
Body Small (Captions):       14px / 0.875rem - font-normal
Tiny (Labels):               12px / 0.75rem - font-medium
```

### Spacing System (8px base)

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

### Component Library

**Primary: shadcn/ui** (Radix UI + Tailwind)
- Accessible by default
- Customizable
- Copy-paste, own the code
- Modern aesthetics

**Additional:**
- **Headless UI** for advanced components (Combobox, Listbox)
- **Recharts** for analytics visualizations
- **Tiptap** or **Lexical** for the rich text editor core

---

## Key Screens & Wireframes

### A. Dashboard/Home

**Purpose:** Quick status overview + fast access to create/review content

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  [Logo] Dashboard  Editor  Library  Analytics          [Search] [User ▾] ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  Welcome back, Sarah                                    Wednesday, Feb 12 ║
║                                                                           ║
║  ┌─────────────────┬─────────────────┬─────────────────┬───────────────┐ ║
║  │ Compliance Score│  Content Items  │ Pending Review  │ Critical Flags│ ║
║  │      92/100     │       47        │        3        │       2       │ ║
║  │   ↑ +5 this wk  │   +12 this mo   │                 │  Needs Action │ ║
║  └─────────────────┴─────────────────┴─────────────────┴───────────────┘ ║
║                                                                           ║
║  Quick Actions                                                            ║
║  ┌──────────────────────────┐  ┌──────────────────────────┐             ║
║  │  + New Content           │  │  📊 Generate Brief       │             ║
║  └──────────────────────────┘  └──────────────────────────┘             ║
║                                                                           ║
║  Content Needing Attention (2)               [View All →]                ║
║  ┌─────────────────────────────────────────────────────────────────────┐ ║
║  │ 🔴 "2024 Investment Returns Guide"                                   │ ║
║  │    3 critical compliance flags • Last edited 2h ago                  │ ║
║  │    [Review Now]                                                      │ ║
║  └─────────────────────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**Key Metrics:**
1. Overall Compliance Score (team average, trending)
2. Content Count (total, by status)
3. Items Pending Review (action required)
4. Critical Flags (urgent attention needed)

### B. Content Editor (Main Screen)

**Purpose:** Single workspace for writing + real-time compliance + SEO optimization

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ← Back    "2024 Investment Returns Guide"           [Save] [Export ▾]   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                          │                                 ║
║  Editor Toolbar                          │  COMPLIANCE PANEL               ║
║  [B][I][U] [H1▾] [Link]                 │                                 ║
║  ────────────────────────────────────    │  Overall Score                  ║
║                                          │  ┌───────────────────────────┐  ║
║  # 2024 Investment Returns Guide        │  │        78/100             │  ║
║                                          │  │   ████████░░░░░░░         │  ║
║  Investors often wonder about            │  │   Medium Risk             │  ║
║  guaranteed returns in the stock         │  └───────────────────────────┘  ║
║  market. While we can't promise          │                                 ║
║  specific gains, historical data         │  Active Flags (3)               ║
║  shows...                                │                                 ║
║                                          │  🔴 Critical (1)                ║
║  ⚠️  "guaranteed returns" ───────────────┼─▶│  Line 2: "guaranteed        │
║                                          │  │  returns" - Prohibited      │
║  Our platform delivers average           │  │  [Fix It →]                 │
║  returns of 12% annually.                │  │                             ║
║                                          │  └─────────────────────────────┘
║  ─────────────────────────────────────   │                                 ║
║  📊 SEO Optimization ▼                   │  Version History                ║
║  ┌──────────────────────────────────┐   │  v3 (current) 2h ago            ║
║  │ SEO Score: 65/100                │   │  v2 yesterday                   ║
║  └──────────────────────────────────┘   │                                 ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**Layout Specifications:**

- **Left Panel (Editor)**: 65% width, clean writing area with inline highlights
- **Right Panel (Compliance)**: 35% width, fixed position, sticky score at top
- **Bottom Drawer (SEO)**: Collapsible, expands on click

### C. Compliance Flag Detail View

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  Compliance Flag Detail                                          [Close X]║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  🔴 CRITICAL RISK                                                         ║
║                                                                           ║
║  Prohibited Claim Language                                                ║
║  ───────────────────────────────────────────────────────────────────────  ║
║                                                                           ║
║  Flagged Text:                                                            ║
║  "guaranteed returns in the stock market"                                 ║
║                                                                           ║
║  Why This is Flagged:                                                     ║
║  Under SEC regulations, investment advisors cannot guarantee specific     ║
║  returns on securities. Using "guaranteed" in connection with stock       ║
║  market performance violates Rule 206(4)-1(a)(5).                         ║
║                                                                           ║
║  Regulation Reference:                                                    ║
║  SEC Investment Advisers Act Rule 206(4)-1 • FINRA Rule 2210             ║
║                                                                           ║
║  ───────────────────────────────────────────────────────────────────────  ║
║  Compliant Alternatives (Select one to replace)                          ║
║                                                                           ║
║  ○ "potential returns in the stock market"                               ║
║    ✓ Emphasizes possibility, not certainty                               ║
║                                                                           ║
║  ○ "investment opportunities in the stock market"                        ║
║    ✓ Neutral, focuses on opportunity not outcome                         ║
║                                                                           ║
║  [Apply Selected]  [Edit Manually]  [Dismiss Flag]                       ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## Feature Prioritization

### MVP (Must-Have) - Launch in 4-6 Weeks

**Core Compliance Engine:**
1. ✅ Real-time compliance flagging (as user types)
2. ✅ Industry rule libraries (fintech, insurance to start)
3. ✅ Severity classification (Critical, Warning, Info)
4. ✅ Compliant alternative suggestions (3-5 per flag)
5. ✅ Compliance score calculation (0-100)

**Content Editor:**
6. ✅ Rich text editor (Tiptap/Lexical)
7. ✅ Split-pane layout (editor + compliance panel)
8. ✅ Inline highlighting of flagged content
9. ✅ Auto-save functionality
10. ✅ Version history (basic)

**SEO Features (Basic):**
11. ✅ Keyword density tracking
12. ✅ Readability score (Flesch-Kincaid)
13. ✅ Word count and structure analysis
14. ✅ SEO score (0-100)

**Content Brief Generator:**
15. ✅ Topic input + industry selection
16. ✅ Competitor URL analysis
17. ✅ Generate recommended outline
18. ✅ Industry-specific compliance guidelines

**Workflows:**
19. ✅ Create/save/edit content
20. ✅ Export to PDF with compliance report
21. ✅ Basic approval flow
22. ✅ Content library (list view, filter by status/risk)

**Dashboard:**
23. ✅ Key metrics overview
24. ✅ Recent content list
25. ✅ Flagged items requiring attention

**Auth & Settings:**
26. ✅ User authentication (email/password)
27. ✅ Industry configuration
28. ✅ Basic user profile

**Total MVP Features: 28**

### Version 1.5 (2-3 Months Post-Launch)

**Collaboration Features:**
1. Team management (invite users, assign roles)
2. Multi-user commenting on content
3. @mentions in comments
4. Approval workflow with multiple reviewers
5. Activity notifications (email + in-app)

**Enhanced Compliance:**
6. Custom compliance rules builder
7. Expand industry libraries (healthcare/HIPAA, lending/TILA)
8. Regulation reference library
9. Compliance score breakdown

**SEO Enhancements:**
10. Target keyword suggestions
11. SERP preview
12. Internal linking suggestions
13. Meta description optimization

**Total v1.5 Features: 21**

### Version 2.0 (6+ Months)

**AI Content Generation:**
1. AI content drafting (compliant-by-design)
2. Predictive flagging
3. Compliant autocomplete
4. Learning from approvals

**Enterprise Features:**
5. SSO integration (Okta, Google Workspace)
6. Custom branding (white-label)
7. Advanced permissions
8. Audit trail export

**Integrations:**
9. WordPress plugin
10. Chrome extension
11. Slack integration
12. Google Docs add-on
13. API access

**Total v2.0 Features: 18**

---

## Technical Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework |
| **Language** | TypeScript (strict) | Type safety |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Component library + utility CSS |
| **Database** | PostgreSQL (Neon) + Prisma | Data persistence + ORM |
| **Auth** | NextAuth.js + Prisma Adapter | Custom auth with Neon |
| **AI - Compliance** | Anthropic Claude API | Compliance analysis |
| **AI - SEO/Briefs** | OpenAI GPT-4 | SEO analysis, brief generation |
| **Editor** | Tiptap | Rich text editing |
| **State** | Zustand + React Query | UI state + server state |
| **Charts** | Recharts | Analytics visualizations |
| **PDF Export** | jsPDF or Puppeteer | Report generation |
| **Forms** | React Hook Form + Zod | Form handling + validation |
| **Email** | Resend or SendGrid | Notifications |
| **Monitoring** | Sentry + Vercel Analytics | Error tracking + analytics |
| **Testing** | Vitest + Playwright | Unit + E2E tests |
| **Deployment** | Vercel | Hosting + CI/CD |

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>

# AI APIs
ANTHROPIC_API_KEY=<claude-api-key>
OPENAI_API_KEY=<openai-api-key>

# Email (v1.5)
RESEND_API_KEY=<resend-key>
EMAIL_FROM=notifications@standexai.com

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=<posthog-key>
SENTRY_DSN=<sentry-dsn>

# Feature Flags (v2.0)
ENABLE_AI_GENERATION=true
ENABLE_SSO=false
ENABLE_WHITE_LABEL=false
```

---

## Compliance Scoring Algorithm

### Compliance Score (0-100)

**Calculation Formula:**

```
Compliance Score = 100 - (weighted_penalties) + bonuses

Penalties:
- Critical Flag:   -15 points each
- Warning Flag:    -5 points each
- Info Flag:       -1 point each
- Missing Disclosure: -10 points each

Bonuses:
+ Includes required disclosures:  +5 points
+ References regulations:          +3 points
+ Uses approved language patterns: +2 points

Minimum Score: 0
Maximum Score: 100
```

**Risk Level Classification:**

```
90-100: LOW RISK ✅ (green)
70-89:  MEDIUM RISK ⚠️ (amber)
50-69:  HIGH RISK ⚠️ (orange)
0-49:   CRITICAL RISK 🔴 (red)
```

### SEO Score (0-100)

**Calculation Formula:**

```
SEO Score = weighted_average(factors)

Factors:
- Keyword Optimization:    25%
- Readability:             20%
- Content Structure:       20%
- Word Count:              15%
- Meta Data:               10%
- Internal Links:          10%
```

---

## Real-Time Flagging UX

### Visual Indicators in Editor

**Inline Highlighting:**

```
The platform offers guaranteed returns of up to 12% annually.
                  ~~~~~~~~~~~~~~~~~         ~~~~~~~~~~~~~~
                  (red underline)            (amber underline)
```

**Highlight Styles:**
- **Critical**: Red wavy underline + red background tint
- **Warning**: Amber dashed underline + amber background tint
- **Info**: Blue dotted underline, no background

**Hover Tooltip:**

```
┌─────────────────────────────────────────────────────┐
│ 🔴 Prohibited Claim Language                        │
│                                                     │
│ "guaranteed returns" violates SEC Rule 206(4)-1    │
│                                                     │
│ Quick Fix: "potential returns" →                   │
│                                                     │
│ [View Details] [Fix Now] [Dismiss]                 │
└─────────────────────────────────────────────────────┘
```

### Interaction Flow

1. **User types flagged content** → 500ms debounce → Highlight appears
2. **User hovers** → Tooltip with summary appears
3. **User clicks** → Detail panel opens with alternatives
4. **User selects alternative** → Text replaces instantly, score updates
5. **User dismisses** → Flag marked as "Acknowledged" in audit trail

---

## Onboarding Flow

### First-Time User Experience

**Step 1: Industry Selection**

```
Welcome to StandexAI

What industry do you work in?

┌──────────────────────────┬──────────────────────────┐
│  💰 Fintech & Banking    │  🏥 Healthcare           │
└──────────────────────────┴──────────────────────────┘
┌──────────────────────────┬──────────────────────────┐
│  🛡️ Insurance            │  💼 B2B SaaS             │
└──────────────────────────┴──────────────────────────┘
```

**Step 2: Compliance Framework Selection**

```
Select Your Compliance Requirements

Based on "Fintech", we recommend:

☑ SEC Investment Advisers Act (auto-selected)
☑ FINRA Advertising Rules (auto-selected)
☐ CFPB TILA (optional)
```

**Step 3: Interactive Tour**

```
See StandexAI in Action

[Sample Content Loaded with Flags]

→ Click the red underline to see compliance issues
→ Click "Apply Fix" to watch the score improve
```

---

## Differentiation Strategies

### UI/UX Elements That Set StandexAI Apart

**1. Dual-Score Display (Unique)**

```
Most SEO tools:  SEO Score: 85/100 ✅

StandexAI:
┌──────────────────────────────┐
│ Compliance: 92/100 ✅        │
│ SEO:        85/100 ✅        │
│ ───────────────────────────  │
│ Publishable: YES ✅          │
└──────────────────────────────┘
```

**2. "Compliant Alternatives" Pattern**

Every flag shows:
- ✓ Checkmark (compliant)
- Explanation of why it's safer
- One-click apply
- Regulation reference

**3. Inline Regulation References**

```
Hover any flag:

🔴 Prohibited Claim

Regulation: SEC Rule 206(4)-1(a)(5)
[View Full Rule Text →]
Last Updated: Jan 2024
```

**4. Version History with Compliance Timeline**

```
v4 (current) - 1 hour ago
✅ Compliance Score: 92/100
📝 Reviewer: John Davis (Legal)
✓ Approved for publication

v3 - 3 hours ago
⚠️ Compliance Score: 75/100
🔴 3 critical flags (fixed in v4)
```

**5. Risk-Based Triage Dashboard**

```
NEEDS IMMEDIATE ATTENTION (2)
🔴 "Investment Guide" - 3 critical flags
🔴 "Medicare Plans" - 2 critical flags

────────────────────────────────

Safe to Publish (18)
✅ "HSA Tax Benefits" - Score: 95/100
```

---

## Implementation Plan

### Phase 1: Foundation (Week 1-2) ✅ COMPLETE

- ✅ Install dependencies (shadcn/ui, Claude SDK, OpenAI SDK, NextAuth, Tiptap)
- ✅ Configure design system
- ✅ Create Prisma schema with all models
- ✅ Run database migrations
- ✅ Seed 17 compliance rules (Fintech, Insurance, Healthcare, Lending)
- ✅ Implement NextAuth.js authentication
- ✅ Build auth pages (signup, login, dashboard)
- ✅ Create core library files (db, utils, claude, openai, auth)

### Phase 2: Editor & Compliance Engine (Week 2-4) ✅ COMPLETE

**Rich Text Editor:**
- ✅ Integrate Tiptap editor
- ✅ Configure toolbar (formatting, headings, lists)
- ✅ Implement auto-save with debouncing
- ✅ Create editor extensions for compliance highlights

**Compliance Rule System:**
- ✅ Build rule matching engine (regex + keyword patterns)
- ✅ Implement Claude API integration for advanced analysis
- ✅ Create real-time checking API endpoint

**Compliance Flagging UI:**
- ✅ Build inline highlight system
- ✅ Create flag sidebar panel
- ✅ Implement flag detail modal
- ✅ Add "Apply Fix" interaction

**Compliance Scoring:**
- ✅ Build scoring algorithm
- ✅ Create animated score display
- ✅ Build score breakdown view

### Phase 3: SEO & Content Briefs (Week 4-5)

- Build SEO analysis API using OpenAI
- Create SEO panel UI
- Build content brief generator
- Implement competitor analysis

### Phase 4: Content Management & Workflows (Week 5-6)

- Build content library with filters
- Implement version history
- Create approval workflow
- Build main editor screen (split-pane layout)

### Phase 5: Dashboard & Analytics (Week 6-7)

- Build dashboard with metrics
- Create analytics charts (Recharts)
- Implement PDF export functionality

### Phase 6: Team Collaboration (v1.5 - Week 7-8)

- Build team management
- Implement permissions system
- Create comment and collaboration features
- Build notification system

### Phase 7: Advanced Features (v1.5 Extended - Week 8-9)

- Enhanced SEO features
- Keyboard shortcuts
- Bulk operations
- Advanced search

### Phase 8: AI Content Generation (v2.0 - Week 9-10)

- AI content drafting with Claude
- AI enhancement tools
- Predictive flagging

### Phase 9: Enterprise & Integrations (v2.0 - Week 10-11)

- Public REST API
- SSO integrations
- WordPress plugin
- Chrome extension
- Slack and Google Docs integrations

### Phase 10: Polish, Testing & Launch (Week 11-12)

- Onboarding flow
- UI/UX polish
- Accessibility (WCAG 2.1 AA)
- Comprehensive testing
- Deployment

**Total Timeline: 12 weeks with 2-3 developers**

---

## Database Schema

### Core Models (Complete Prisma Schema)

```prisma
// User Management
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  role          UserRole  @default(WRITER)
  industry      Industry?
  companyName   String?
  avatar        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  content          Content[]
  contentVersions  ContentVersion[]
  approvals        Approval[]
  comments         Comment[]
  briefs           ContentBrief[]
  teamMemberships  TeamMember[]
  apiKeys          ApiKey[]
}

enum UserRole {
  ADMIN
  WRITER
  REVIEWER
  VIEWER
}

enum Industry {
  FINTECH
  INSURANCE
  HEALTHCARE
  LENDING
  SAAS
  INVESTMENT
  CRYPTO
}

// Content Management
model Content {
  id              String        @id @default(cuid())
  userId          String
  teamId          String?
  title           String
  body            Json          // Tiptap JSON document
  status          ContentStatus @default(DRAFT)
  complianceScore Int?          // 0-100
  seoScore        Int?          // 0-100
  riskLevel       RiskLevel?
  industry        Industry
  targetKeyword   String?
  metaDescription String?
  slug            String?
  publishedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user        User               @relation(fields: [userId], references: [id])
  flags       ComplianceFlag[]
  versions    ContentVersion[]
  approvals   Approval[]
  comments    Comment[]
  seoAnalysis SeoAnalysis[]
}

// Compliance System
model ComplianceRule {
  id                  String    @id @default(cuid())
  teamId              String?   // null = system rule
  industry            Industry
  ruleName            String
  ruleType            RuleType
  severity            Severity
  pattern             String    // regex pattern
  explanation         String    @db.Text
  regulationReference String?   @db.Text
  alternatives        Json      // array of alternatives
  active              Boolean   @default(true)
  isSystemRule        Boolean   @default(false)
  createdAt           DateTime  @default(now())

  flags               ComplianceFlag[]
}

model ComplianceFlag {
  id                  String     @id @default(cuid())
  contentId           String
  ruleId              String
  flaggedText         String     @db.Text
  severity            Severity
  explanation         String     @db.Text
  regulationReference String?    @db.Text
  alternatives        Json
  status              FlagStatus @default(ACTIVE)
  lineNumber          Int?
  createdAt           DateTime   @default(now())

  content Content        @relation(fields: [contentId], references: [id])
  rule    ComplianceRule @relation(fields: [ruleId], references: [id])
}
```

**Total Models: 18+**

Including: User, Team, Content, ComplianceRule, ComplianceFlag, ContentVersion, Approval, Comment, SeoAnalysis, ContentBrief, ApiKey, AnalyticsEvent, ContentTemplate, Integration

---

## Success Metrics

Post-launch, track:
- **Activation**: % users who create first content within 7 days
- **Engagement**: Average content items created per user per week
- **Compliance improvement**: Average score increase from first draft to final
- **Time saved**: Average time from draft to approval
- **Retention**: % users active after 30 days
- **Referrals**: % users who invite teammates

---

## Next Steps

1. **Complete Phase 2**: Editor & Compliance Engine
2. **Beta Test**: Recruit 10-20 users from target industries
3. **Iterate**: Based on feedback
4. **Launch**: Product Hunt, LinkedIn, industry forums
5. **Scale**: Add team features (v1.5), then enterprise (v2.0)

---

**Document Version:** 1.0
**Last Updated:** February 12, 2026
**Status:** Phase 1 Complete, Ready for Phase 2

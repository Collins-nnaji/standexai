# StandexAI 2.0 - Feature Overview

## 🎨 Visual Tour

### **Landing Page** (`/`)
**What You'll See:**
- Hero section with gradient branding
- Feature cards showcasing core capabilities:
  - 🛡️ Real-Time Compliance
  - ✨ AI Co-Pilot
  - 📊 Dual Optimization (SEO + GEO)
  - 👥 Team Collaboration
- CTA buttons to launch dashboard or view demo
- Modern dark theme with #00D9A1 accent color

**Key Action:**
Click "Get Started" → redirects to `/dashboard`

---

### **Dashboard** (`/dashboard`)
**What You'll See:**
- **Stats Overview** - 4 metric cards:
  - Total Projects
  - Published Count
  - In Review Count
  - Average SEO Score
- **Filter Bar** - All | Drafts | In Review | Published
- **Project Cards** with:
  - Title & status badge
  - Issue count with warning icons
  - 3 circular score indicators (SEO, GEO, Compliance)
  - Risk level indicator
  - Last updated timestamp

**Key Actions:**
- Click "New Content" → `/studio/editor`
- Click any project card → `/studio/editor?id={projectId}`
- Filter projects by status

**Sample Data:**
- "Best AI Tools 2026" - Published, 85 SEO, 72 GEO, 95 Compliance
- "Healthcare Blog Post" - In Review, 78 SEO, 68 GEO, 62 Compliance (3 issues)
- "Financial Services Landing Page" - Draft, 42 SEO, 38 GEO, 45 Compliance (7 issues)

---

### **Studio Editor** (`/studio/editor`)
**What You'll See:**

**Top Bar:**
- Editable title input
- Status badge (Draft)
- "Save Draft" and "Send for Review" buttons

**Main Editor (Left):**
- **Format Toolbar:**
  - Bold, Italic, Underline
  - H1, H2 headings
  - Bullet/numbered lists, blockquote
  - "AI Improve" button (green highlight)
- **Content Area:**
  - Rich text editor (TipTap)
  - Sample content with compliance issues highlighted in yellow
  - Placeholder: "Start writing your content..."

**Right Sidebar (25% width):**

**1. Performance Scores Panel**
- SEO Score: 67/100 (yellow progress bar)
- GEO Score: 58/100 (yellow)
- Compliance: 45/100 (red - needs attention!)

**2. Top Issues Panel**
- ⚠️ Add H2 headers (red warning)
- ⚠️ Keyword density low (yellow)
- ⚠️ Missing meta description (red)

**3. Compliance Flags (Expandable)**
Shows 3 flagged issues:
- **"guaranteed results"** (CRITICAL - red border)
  - FTC violation explanation
  - Suggestion: Use "may help achieve"
  - "Fix automatically" button
- **"cure cancer"** (CRITICAL)
  - FDA approval required
  - Suggestion: Remove or replace
- **"fastest on the market"** (WARNING - yellow)
  - Needs substantiation
  - Suggestion: Cite specific metrics

**Key Features:**
- Real-time typing experience
- Highlighted problematic text in editor
- Severity-coded flags (red/yellow/blue)
- Inline AI suggestions
- Auto-save (not yet implemented, but UI ready)

---

### **Content Briefs** (`/studio/briefs`)
**What You'll See:**

**Top Bar:**
- Title: "Content Briefs"
- Description: "AI-powered competitive analysis and content planning"
- "New Brief" button (green)

**New Brief Form (when opened):**
- Topic/Title input
- Industry dropdown (SaaS, Healthcare, FinTech, etc.)
- Target Keyword input
- Competitor URLs textarea (one per line)
- "Generate Brief" button with sparkles icon
- Cancel button

**Brief Cards:**
Shows 2 sample briefs:

**1. "AI-Powered Customer Service Solutions"**
- Status: analyzed (green badge)
- Target: "AI customer service software"
- Industry: SaaS
- 5 competitors analyzed
- Created 2 days ago
- **Analysis Metrics:**
  - Recommended Length: 2,400 words
  - Target Readability: Grade 8-10
  - Key Topics: 12 identified
- "View Details" button

**2. "HIPAA Compliance Guide for Telehealth"**
- Status: pending (yellow)
- Target: "telehealth HIPAA compliance"
- Industry: Healthcare
- 3 competitors
- Created 5 hours ago

---

### **Settings** (`/settings`)
**What You'll See:**

**Left Sidebar Tabs:**
- 👤 Profile
- 🏢 Company
- 🛡️ Compliance Rules
- 🔔 Notifications
- 🔑 API Keys

**Profile Tab:**
- Full Name input (default: "John Doe")
- Email input
- Role dropdown (Writer/Reviewer/Admin)
- Save Changes / Cancel buttons

**Company Tab:**
- Company Name
- Industry selector
- Website URL
- Update button

**Compliance Rules Tab:**
- **HIPAA Healthcare Rules** (toggle ON)
  - Medical claims, patient privacy, PHI handling
- **FTC Advertising Guidelines** (toggle ON)
  - Truthful claims, substantiation, endorsements
- **SEC Financial Regulations** (toggle OFF)
  - Investment advice disclaimers

**API Keys Tab:**
- "Generate New Key" button
- 2 existing keys:
  - Production: `sk_live_••••••••••••3x8k` (used 2 hours ago)
  - Development: `sk_test_••••••••••••7m2p` (never used)
- Revoke buttons for each

---

## 🎯 Navigation Flow

### **Left Sidebar (Always Visible)**
- **StandexAI Logo** (top)
  - Tagline: "Compliance-First Content Platform"
- **Navigation Menu:**
  - 📊 Dashboard (active state: green highlight)
  - ✏️ Studio
  - 💼 Briefs
  - ⚙️ Settings
- **User Profile (bottom):**
  - Avatar: "JD" in green gradient circle
  - Name: "John Doe"
  - Email: "john@company.com"
  - Logout icon

---

## 🎨 Design System

### **Colors**
- **Primary Background:** `#0B0E14` (dark blue-black)
- **Secondary Background:** `#151922` (lighter dark)
- **Card Background:** `#1a1f2e` (on hover)
- **Accent/CTA:** `#00D9A1` (bright teal/green)
- **Border:** `#2d3748` (gray-800)
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#9CA3AF` (gray-400)

### **Typography**
- **Headings:** Bold, -0.025em letter-spacing
- **Body:** Inter font, -0.01em letter-spacing
- **Monospace:** JetBrains Mono (for code/API keys)

### **Status Colors**
- Draft: Gray (`#6B7280`)
- In Review: Blue (`#3B82F6`)
- Approved: Green (`#10B981`)
- Published: Emerald (`#00D9A1`)

### **Risk Levels**
- Low: Emerald (`#10B981`)
- Medium: Yellow (`#F59E0B`)
- High: Orange (`#F97316`)
- Critical: Red (`#EF4444`)

### **Score Colors**
- 80-100: Green (great)
- 60-79: Yellow (needs work)
- 0-59: Red (critical)

---

## 🚀 Interactive Elements

### **Buttons**
- **Primary CTA:** Green background, black text, hover brightens
- **Secondary:** Gray border, transparent bg, hover adds gray bg
- **Destructive:** Red text, hover underline

### **Inputs**
- Dark background (`#0B0E14`)
- Gray border (`#374151`)
- Green border on focus (`#00D9A1`)
- White text

### **Toggles**
- Off: Gray background
- On: Green background with animated slide

### **Progress Bars**
- Track: Dark gray (`#374151`)
- Fill: Color-coded by score (green/yellow/red)
- Height: 8px, rounded

### **Score Circles**
- SVG-based circular progress
- Animated stroke
- Number in center
- Label below

---

## 📊 Data Flow

### **Dashboard → Editor**
1. Click project card
2. Load project data by ID
3. Populate editor with content
4. Run real-time compliance analysis
5. Display scores in sidebar

### **Editor → Save**
1. User edits content
2. Auto-analyze on change (debounced)
3. Update scores
4. Flag compliance issues
5. Save to database (Prisma)

### **Briefs → Generate**
1. Enter topic, keywords, competitors
2. POST to AI analysis API
3. Scrape competitor content
4. Generate recommendations
5. Display metrics and outline

---

## 🔌 API Endpoints

### **Content Management**
- `POST /api/content/create` - Create new content
- `POST /api/content/analyze` - Analyze text for compliance/SEO

### **Legacy (Still Available)**
- `POST /api/generate` - Generate SEO content from keywords
- `POST /api/scan` - Scan URL for SEO issues

---

## 💡 Pro Tips

### **For Writers**
1. Start in Briefs to research competitors
2. Use Dashboard to track all projects
3. Check compliance sidebar while writing
4. Use "AI Improve" for suggestions
5. Send for review when ready

### **For Reviewers**
1. Filter Dashboard by "In Review"
2. Check compliance score first
3. Review flagged issues
4. Leave comments (coming soon)
5. Approve or request changes

### **For Admins**
1. Configure compliance rules in Settings
2. Manage team members (coming soon)
3. Monitor API usage
4. Review analytics dashboard
5. Set up integrations

---

## 🎯 Key Differentiators

### **vs. Traditional SEO Tools**
- ✅ Real-time compliance (not just SEO)
- ✅ GEO optimization (AI search engines)
- ✅ Industry-specific rules
- ✅ Collaborative workflows

### **vs. Generic Content Tools**
- ✅ Regulatory expertise built-in
- ✅ Risk scoring and flagging
- ✅ Audit trail and version control
- ✅ Enterprise-grade security

### **vs. Simple AI Writers**
- ✅ Professional editor (not just generation)
- ✅ Multi-score optimization
- ✅ Team collaboration
- ✅ Compliance guarantee

---

**Ready to transform your content operations? Launch `/dashboard` and start creating compliant, high-performing content!**

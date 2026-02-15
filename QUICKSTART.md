# QuickStart Guide - StandexAI 2.0

Get up and running in 5 minutes!

---

## 🚀 Quick Setup

### **1. Install & Run**

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 First Steps

### **Step 1: Explore the Landing Page**
- Visit `http://localhost:3000`
- See the new feature highlights
- Click **"Get Started"** to enter the platform

### **Step 2: Check the Dashboard**
- You'll land on `/dashboard`
- See 3 sample projects with different statuses
- Notice the **score circles** (SEO, GEO, Compliance)
- Click any project to open it in the editor

### **Step 3: Try the Editor**
- Click **"New Content"** or any project card
- You're now in the rich text editor at `/studio/editor`
- Type some content and watch:
  - ✨ Real-time formatting
  - 📊 Scores update in the right sidebar
  - 🛡️ Compliance flags appear for problematic text

### **Step 4: Review Compliance Flags**
- Sample content has highlighted issues (yellow background)
- Right sidebar shows 3 compliance flags:
  - **"guaranteed results"** - Critical FTC violation
  - **"cure cancer"** - Critical medical claim
  - **"fastest on the market"** - Warning for unsubstantiated claim
- Each flag shows:
  - Severity level (color-coded)
  - Explanation
  - Suggested fix
  - "Fix automatically" button

### **Step 5: Explore Other Features**
- Click **"Briefs"** in sidebar → See content brief generator
- Click **"Settings"** → Configure compliance rules, manage profile
- Toggle compliance rules on/off (HIPAA, FTC, SEC)

---

## 🎨 What You'll See

### **Dashboard** (`/dashboard`)
```
┌─────────────────────────────────────────┐
│  📊 Total: 12  ✅ Published: 8         │
│  ⏱️  Review: 3  📈 Avg Score: 78        │
├─────────────────────────────────────────┤
│  [All] [Drafts] [In Review] [Published] │
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │ Best AI Tools 2026  [Published]  │  │
│  │ SEO: 85  GEO: 72  Compliance: 95 │  │
│  │ ⚠️ 0 issues                       │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### **Editor** (`/studio/editor`)
```
┌─────────────────────────────────────────┬─────────────┐
│ Healthcare Marketing Guide   [Draft]    │ Scores      │
│ [Save] [Send for Review]                │ SEO: 67/100 │
├─────────────────────────────────────────┤ GEO: 58/100 │
│ [B] [I] [U] [H1] [H2] [List] [AI ✨]   │ Comp: 45/100│
├─────────────────────────────────────────┤─────────────┤
│                                         │ Top Issues  │
│ # How AI Tools Transform Healthcare    │ • Add H2s   │
│                                         │ • Keywords  │
│ Our platform offers guaranteed results  │ • Meta desc │
│ that will cure cancer...                │─────────────┤
│                                         │ Flags (3)   │
│                                         │ 🔴 guarantee│
│                                         │ 🔴 cure     │
│                                         │ 🟡 fastest  │
└─────────────────────────────────────────┴─────────────┘
```

---

## 🧪 Test Features

### **Try Compliance Detection**

In the editor, type these phrases and watch flags appear:

```
❌ "Guaranteed to cure diabetes"
   → 2 critical flags (guarantee + cure)

❌ "We are the #1 fastest solution"
   → Warning flag (unsubstantiated claim)

❌ "100% safe with no side effects"
   → Critical flag (absolute safety claim)

✅ "May help support healthy glucose levels"
   → No flags! Compliant language
```

### **Test Different Industries**

Create new content briefs for:
- Healthcare: Try "HIPAA compliant telehealth"
- Finance: Try "investment portfolio management"
- SaaS: Try "enterprise marketing automation"

---

## 📊 Understanding Scores

### **SEO Score (0-100)**
- **80-100 (Green)**: Excellent optimization
- **60-79 (Yellow)**: Needs improvement
- **0-59 (Red)**: Critical issues

**What affects it:**
- Word count (500+ recommended)
- Heading structure (H1, H2s)
- Keyword usage
- Meta descriptions

### **GEO Score (0-100)**
AI search engine optimization (ChatGPT, Perplexity)

**What affects it:**
- Question-based content
- Clear, concise answers
- Structured formatting
- Citation-worthy information

### **Compliance Score (0-100)**
Regulatory adherence

**What affects it:**
- Critical flags: -20 points each
- Warning flags: -10 points each
- Industry-specific violations

---

## 🎯 Common Workflows

### **Create New Content**
1. Dashboard → "New Content"
2. Write in editor
3. Check scores in sidebar
4. Fix compliance issues
5. Save draft
6. Send for review

### **Review Project**
1. Dashboard → Click project
2. Review content
3. Check compliance flags
4. Approve or request changes

### **Generate Content Brief**
1. Sidebar → "Briefs"
2. Click "New Brief"
3. Enter topic, keywords, competitors
4. Click "Generate Brief"
5. Review analysis and recommendations

---

## 🔑 Environment Setup (Optional)

For full functionality, add to `.env`:

```env
# Required for AI features
OPENAI_API_KEY="sk-..."

# Optional - defaults to gpt-4.1-mini
OPENAI_MODEL="gpt-4.1-mini"

# For authentication (coming soon)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🐛 Troubleshooting

### **Port 3000 already in use**
```bash
# Kill existing process
pkill -f "next dev"

# Or use different port
PORT=3001 npm run dev
```

### **Database connection error**
Check `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

### **Styles not loading**
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

---

## 📚 Next Steps

1. **Read the docs:**
   - [README.md](README.md) - Full platform overview
   - [FEATURES.md](FEATURES.md) - Detailed feature guide
   - [MIGRATION.md](MIGRATION.md) - Upgrade from v1.0

2. **Customize compliance:**
   - Visit `/settings`
   - Toggle industry-specific rules
   - Configure your company profile

3. **Try the legacy API:**
   ```bash
   curl -X POST http://localhost:3000/api/generate \
     -H "Content-Type: application/json" \
     -d '{
       "mainKeyword": "ai tools",
       "targetAudience": "Marketing teams...",
       "tone": "Professional"
     }'
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🎉 You're Ready!

Your StandexAI 2.0 platform is fully functional with:
- ✅ Modern dashboard
- ✅ Rich text editor
- ✅ Real-time compliance
- ✅ Multi-score tracking
- ✅ Content briefs
- ✅ Team settings

**Start creating compliant, high-performing content!** 🚀

---

## 💡 Pro Tips

1. **Keyboard Shortcuts** (in editor):
   - `Cmd/Ctrl + B` - Bold
   - `Cmd/Ctrl + I` - Italic
   - `Cmd/Ctrl + K` - Add link

2. **Watch the scores** as you type - they update in real-time!

3. **Compliance flags** are color-coded:
   - 🔴 Red = Critical (must fix)
   - 🟡 Yellow = Warning (should fix)
   - 🔵 Blue = Info (nice to fix)

4. **Filter dashboard** to focus on specific project types

5. **Use briefs** before writing to understand competitive landscape

---

**Questions?** Check the [README.md](README.md) or [FEATURES.md](FEATURES.md) for more details!

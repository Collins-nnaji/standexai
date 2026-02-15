# StandexAI 2.0 - Compliance-First Content Operations Platform

**AI-powered content platform built for regulated industries.** Real-time compliance checking, dual SEO+GEO optimization, and collaborative workflows.

---

## 🚀 What's New in 2.0

StandexAI has been completely transformed from a simple form-based SEO generator into a **professional enterprise content platform**:

### **Before (v1.0)**
- Basic form to generate SEO content
- Simple website scanner
- Single-page interface

### **After (v2.0)**
- ✨ **Rich Text Editor** with TipTap - professional writing experience
- 🛡️ **Real-Time Compliance Checking** - catch violations as you type
- 📊 **Multi-Score Dashboard** - SEO, GEO, and Compliance scores
- 🎯 **Content Briefs** - AI-powered competitive analysis
- 👥 **Team Collaboration** - built-in workflows and approvals
- 🏢 **Industry-Specific** - Healthcare, FinTech, Insurance, and more
- 🔄 **Project Management** - track drafts, reviews, and published content

---

## 🎨 Core Features

### 1. **Modern Dashboard**
- Project overview with status tracking
- Performance analytics (SEO/GEO/Compliance scores)
- Quick actions and filtering
- Real-time updates

### 2. **Rich Content Editor**
- TipTap-powered WYSIWYG editor
- **AI Co-Pilot** - intelligent suggestions inline
- **Live Compliance Sidebar** - flags issues as you type
- **Multi-score tracking** - SEO, GEO, Compliance
- Format toolbar with shortcuts
- Auto-save and version history ready

### 3. **Compliance System**
- Industry-specific rule sets (HIPAA, FTC, SEC)
- Real-time flagging with severity levels
- Automatic suggestions for fixes
- Custom rule builder (coming soon)
- Regulatory reference citations

### 4. **Content Briefs**
- Competitive analysis powered by AI
- Target keyword research
- Recommended content structure
- Topic gap analysis
- Performance benchmarks

### 5. **Team Workflow**
- Role-based access (Admin, Writer, Reviewer, Viewer)
- Draft → Review → Approve → Publish pipeline
- Comments and collaboration (coming soon)
- Activity tracking and audit trail

---

## 🏗️ Architecture

### **Tech Stack**
- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Neon) with Prisma ORM
- **Editor:** TipTap (ProseMirror)
- **UI:** Tailwind CSS + Radix UI
- **AI:** OpenAI GPT-4 + Anthropic Claude (ready)
- **Auth:** NextAuth.js (schema ready)

### **Database Schema**
Comprehensive schema supporting:
- Users & Teams with role-based access
- Content with version control
- Compliance rules & flags
- SEO analysis & tracking
- Content briefs & templates
- Comments & approvals
- API keys & integrations

---

## 📂 Project Structure

```
standexai/
├── app/
│   ├── (platform)/          # Main application
│   │   ├── dashboard/       # Project overview
│   │   ├── studio/
│   │   │   ├── editor/      # Rich text editor
│   │   │   └── briefs/      # Content briefs
│   │   ├── settings/        # User settings
│   │   └── layout.tsx       # Sidebar navigation
│   ├── api/
│   │   ├── content/         # Content CRUD
│   │   ├── generate/        # Legacy SEO generator
│   │   └── scan/            # Website scanner
│   ├── page.tsx             # Landing page
│   └── layout.tsx           # Root layout
├── components/
│   └── ui/                  # Radix UI components
├── lib/
│   └── prisma.ts            # Database client
└── prisma/
    └── schema.prisma        # Full enterprise schema
```

---

## 🚦 Getting Started

### **1. Install Dependencies**
```bash
npm install
```

### **2. Set Environment Variables**
Create `.env` file:
```env
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4.1-mini"  # Optional
NEXTAUTH_SECRET="your-secret"  # For auth (optional)
```

### **3. Setup Database**
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Optional: Seed with sample data
npm run db:seed
```

### **4. Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 Navigation Guide

### **Main Routes**
- `/` - Landing page with feature overview
- `/dashboard` - Project dashboard with analytics
- `/studio/editor` - Rich text editor with AI assistance
- `/studio/briefs` - Content brief generator
- `/settings` - Account and compliance settings

### **Legacy Routes (Still Available)**
- Original form-based generator is preserved in the codebase
- Access via API: `POST /api/generate`
- Website scanner: `POST /api/scan`

---

## 🔐 Security & Compliance

### **Built-in Compliance Rules**
- **Healthcare (HIPAA):** Medical claims, PHI handling
- **Finance (SEC/FTC):** Investment advice, performance claims
- **Insurance:** State regulations, disclosure requirements
- **General:** Advertising guidelines, truthful marketing

### **Compliance Features**
- Real-time content scanning
- Severity-based flagging (Critical, Warning, Info)
- Contextual suggestions
- Regulatory reference linking
- Custom rule builder (enterprise)

---

## 📊 Scoring System

### **SEO Score (0-100)**
- Keyword optimization
- Heading structure
- Word count targets
- Meta descriptions
- Internal linking

### **GEO Score (0-100)**
- AI search engine optimization
- Question-based content
- Citation-worthiness
- Snippet formatting
- Answer box optimization

### **Compliance Score (0-100)**
- Regulatory adherence
- Risk level assessment
- Flag severity weighting
- Industry-specific rules

---

## 🛠️ Development

### **Database Commands**
```bash
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Create migration
npm run prisma:push        # Push schema changes
npm run prisma:seed        # Seed database
```

### **Build**
```bash
npm run build
npm run start
```

---

## 🗺️ Roadmap

### **Phase 1 (Current)**
- ✅ Dashboard & navigation
- ✅ Rich text editor
- ✅ Compliance checking
- ✅ Multi-score system
- ✅ Content briefs

### **Phase 2 (Next)**
- 🔄 Real authentication (NextAuth)
- 🔄 Team management UI
- 🔄 Comments & collaboration
- 🔄 Approval workflows
- 🔄 Export to CMS integrations

### **Phase 3 (Future)**
- 📋 Custom compliance rules
- 📋 Advanced analytics
- 📋 Template library
- 📋 API documentation
- 📋 Webhook integrations

---

## 📝 License

Proprietary - All rights reserved

---

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

---

**Built with ❤️ for teams creating compliant, high-performing content at scale.**

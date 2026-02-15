# Migration Guide: v1.0 → v2.0

## Overview

StandexAI v2.0 is a **complete transformation** while preserving all v1.0 functionality. This guide helps you understand what changed and how to access legacy features.

---

## What's Preserved

### ✅ **All Original APIs Still Work**

The original form-based generator and scanner are **fully preserved**:

- **Generate API:** `POST /api/generate`
- **Scan API:** `POST /api/scan`
- Both endpoints work exactly as before
- Same request/response format
- Same database schema (enhanced, not replaced)

### ✅ **Database Compatibility**

All your existing data is safe:
- `GeneratedPage` table still exists
- All previous generations preserved
- Schema only **extended**, not modified
- Migrations are additive only

---

## What's New

### 🆕 **New Routes**

| Route | Purpose | Replaces |
|-------|---------|----------|
| `/dashboard` | Project overview | Home page redirect |
| `/studio/editor` | Rich text editor | Direct generation form |
| `/studio/briefs` | Content planning | (New feature) |
| `/settings` | Account settings | (New feature) |

### 🆕 **New APIs**

| Endpoint | Purpose |
|----------|---------|
| `POST /api/content/create` | Create content projects |
| `POST /api/content/analyze` | Real-time compliance analysis |

---

## Migration Paths

### **Path 1: Keep Using v1.0 Style**

You can continue using the original workflow:

```typescript
// Still works exactly as before
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mainKeyword: "enterprise seo platform",
    secondaryKeywords: "ai seo writer, content engine",
    location: "Austin, Texas",
    targetAudience: "B2B SaaS marketing teams",
    tone: "Professional"
  })
});

const data = await response.json();
// { id, saved, output: { title, metaTitle, articleMarkdown, ... } }
```

**When to use:**
- Quick one-off content generation
- Programmatic/API-driven workflows
- Simple SEO page creation
- No team collaboration needed

---

### **Path 2: Upgrade to v2.0 Workflow**

Leverage the new platform features:

1. **Navigate to `/dashboard`**
   - See all your projects in one place
   - Track SEO/GEO/Compliance scores
   - Filter by status

2. **Create Content in Editor**
   - Click "New Content"
   - Write in rich text editor
   - Get real-time compliance feedback
   - See scores update live

3. **Manage Projects**
   - Save drafts
   - Send for review
   - Track revisions
   - Publish when ready

**When to use:**
- Long-form content creation
- Regulated industries
- Team collaboration
- Quality control workflows

---

## Feature Comparison

### **v1.0 (Form-Based Generator)**

**Pros:**
- ✅ Fast and simple
- ✅ One-click generation
- ✅ Predictable output
- ✅ API-friendly

**Cons:**
- ❌ No compliance checking
- ❌ No draft saving
- ❌ No team features
- ❌ Limited editing

**Best for:**
- Quick SEO pages
- Bulk generation
- API integrations
- Simple use cases

---

### **v2.0 (Platform Approach)**

**Pros:**
- ✅ Real-time compliance
- ✅ Multi-score optimization
- ✅ Rich text editing
- ✅ Project management
- ✅ Team collaboration
- ✅ Version control

**Cons:**
- ❌ More complex interface
- ❌ Requires more user interaction

**Best for:**
- Regulated content
- Team workflows
- Quality control
- Long-term projects

---

## Code Examples

### **Accessing Legacy Generator Programmatically**

```javascript
// v1.0 Style - Still works!
async function generateSEOPage(params) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify(params)
  });
  return res.json();
}

// Use the same way as before
const result = await generateSEOPage({
  mainKeyword: "ai tools",
  targetAudience: "marketers...",
  tone: "Professional"
});

console.log(result.output.articleMarkdown);
```

### **Using New Content API**

```javascript
// v2.0 Style - Enhanced workflow
async function createContentProject(data) {
  // Step 1: Create project
  const project = await fetch('/api/content/create', {
    method: 'POST',
    body: JSON.stringify({
      title: "My Article",
      body: tiptapJSON, // Rich text JSON
      industry: "HEALTHCARE",
      targetKeyword: "telehealth"
    })
  }).then(r => r.json());

  // Step 2: Analyze compliance
  const analysis = await fetch('/api/content/analyze', {
    method: 'POST',
    body: JSON.stringify({
      contentId: project.content.id,
      text: extractedText,
      industry: "HEALTHCARE"
    })
  }).then(r => r.json());

  return { project, analysis };
}
```

---

## Database Changes

### **v1.0 Tables (Unchanged)**
- `GeneratedPage` - Still exists, still works

### **v2.0 New Tables**
- `User` - User accounts
- `Team` - Team management
- `Content` - Rich content projects
- `ContentVersion` - Version control
- `ComplianceRule` - Configurable rules
- `ComplianceFlag` - Issue tracking
- `SeoAnalysis` - SEO metrics
- `ContentBrief` - Briefs & analysis
- `Approval` - Review workflow
- `Comment` - Collaboration
- `ApiKey` - API access

**Migration Strategy:**
- Old data stays in `GeneratedPage`
- New content goes in `Content`
- Both coexist peacefully
- No data loss

---

## Environment Variables

### **v1.0 (Required)**
```env
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4.1-mini"  # optional
```

### **v2.0 (Additional - Optional)**
```env
# Everything from v1.0 +
NEXTAUTH_SECRET="..."  # For authentication
NEXTAUTH_URL="http://localhost:3000"  # Auth callback
```

**Note:** v2.0 works without auth enabled (uses mock user for now)

---

## URL Routing Changes

### **Before (v1.0)**
- `/` - Single-page generator form

### **After (v2.0)**
- `/` - Landing page with CTA
- `/dashboard` - Main application entry
- `/studio/editor` - Content creation
- `/studio/briefs` - Content planning
- `/settings` - Configuration

**Redirect Strategy:**
- Old form removed from homepage
- Use `/api/generate` directly for programmatic access
- Navigate to `/dashboard` for UI-based workflow

---

## Gradual Migration Plan

### **Phase 1: Familiarization** (Week 1)
1. Explore new dashboard
2. Create 1-2 test projects
3. Try the editor with sample content
4. Review compliance sidebar
5. **Continue using v1.0 for production**

### **Phase 2: Pilot** (Week 2-3)
1. Create real content in editor
2. Test compliance rules for your industry
3. Invite 2-3 team members
4. Compare v1.0 vs v2.0 outputs
5. **80% v1.0, 20% v2.0**

### **Phase 3: Transition** (Week 4-6)
1. Move primary workflows to v2.0
2. Keep v1.0 API for automation
3. Train team on new features
4. Set up compliance rules
5. **20% v1.0, 80% v2.0**

### **Phase 4: Full Adoption** (Week 7+)
1. v2.0 as default
2. v1.0 API for integrations only
3. All team members on platform
4. Custom compliance rules active
5. **100% v2.0 (v1.0 API as needed)**

---

## Rollback Strategy

If you need to revert:

### **Option 1: Use v1.0 APIs Directly**
- Access `/api/generate` and `/api/scan`
- Build custom UI if needed
- All data still there

### **Option 2: Git Branch**
```bash
# Checkout pre-v2.0 commit
git checkout <pre-v2-commit>
npm install
npm run dev
```

### **Option 3: Hybrid Approach**
- Use v2.0 for new content
- Keep v1.0 for legacy workflows
- Both systems coexist

---

## Support & Questions

### **Common Questions**

**Q: Will my old generated pages still work?**
A: Yes! All data in `GeneratedPage` table is preserved and accessible.

**Q: Do I need to migrate my data?**
A: No. Old and new systems coexist. Migrate when ready.

**Q: Can I use both v1.0 and v2.0?**
A: Absolutely. Use v1.0 APIs for automation, v2.0 UI for manual work.

**Q: What if I don't need compliance checking?**
A: You can disable specific rules in Settings or keep using v1.0.

**Q: Is there a performance difference?**
A: v2.0 has more features but is optimized. v1.0 API remains fast.

---

## Breaking Changes

### **None!**

This is a **purely additive** upgrade:
- ✅ All v1.0 APIs work
- ✅ All v1.0 data preserved
- ✅ No forced migration
- ✅ No breaking changes

The only change is the homepage (`/`) now shows a landing page instead of the form. Access the form functionality via:
- API: `POST /api/generate`
- Or use the new dashboard workflow

---

## Recommendation

**For Most Users:**
Start with v2.0 dashboard for:
- Better UX
- Compliance safety
- Team features
- Future-proof

**Keep v1.0 For:**
- Automated scripts
- Bulk generation
- Simple API calls
- Quick one-offs

**Best of Both Worlds:**
Use v2.0 UI + v1.0 API together! They complement each other perfectly.

---

**Questions?** Check `README.md` and `FEATURES.md` for detailed documentation.

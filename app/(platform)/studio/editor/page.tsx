"use client";

import { useEffect, useMemo, useState } from "react";
import type { Editor } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import {
  AlertTriangle,
  Bold,
  Download,
  Eraser,
  Eye,
  FileText,
  Heading1,
  Heading2,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  RotateCw,
  Save,
  Send,
  Sparkles,
  Shield,
  TrendingUp,
  Underline as UnderlineIcon,
  WandSparkles,
  Zap,
} from "lucide-react";

type ComplianceFlag = {
  id: string;
  text: string;
  severity: "critical" | "warning" | "info";
  explanation: string;
  suggestion: string;
};

type AnalyzeResponse = {
  flags: Array<{
    text: string;
    severity: "CRITICAL" | "WARNING" | "INFO";
    explanation: string;
    suggestion: string;
  }>;
  scores: {
    seo: number;
    geo: number;
    compliance: number;
  };
};

type AssistResponse = {
  mode: "generate" | "improve" | "rewrite" | "format";
  output: {
    title: string;
    html: string;
    notes: string;
  };
};

type FormatStyle = "readability" | "seo" | "compliance" | "executive";

type SavedDraft = {
  id: string;
  title: string;
  industry: string;
  targetKeyword: string | null;
  updatedAt: string;
};

const severityConfig = {
  critical: { border: "border-red-200", bg: "bg-red-50", text: "text-red-600", icon: "bg-red-100", color: "#fecaca" },
  warning: { border: "border-yellow-200", bg: "bg-yellow-50", text: "text-yellow-700", icon: "bg-yellow-100", color: "#fef08a" },
  info: { border: "border-blue-200", bg: "bg-blue-50", text: "text-blue-700", icon: "bg-blue-100", color: "#bfdbfe" },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatRelative(dateIso: string) {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function ScoreCard({ score, label, icon: Icon }: { score: number; label: string; icon: typeof TrendingUp }) {
  const getColor = () => {
    if (score >= 80) return { text: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" };
    if (score >= 60) return { text: "text-yellow-600", bg: "bg-yellow-50", bar: "bg-yellow-500" };
    return { text: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" };
  };
  const colors = getColor();
  return (
    <div className="rounded-xl border border-[#E5E5EA] bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded-lg ${colors.bg} p-1.5`}>
            <Icon className={`h-4 w-4 ${colors.text}`} />
          </div>
          <div>
            <p className="text-xs text-[#8E8E93]">{label}</p>
            <p className={`text-xl font-semibold ${colors.text}`}>{score}</p>
          </div>
        </div>
        <p className="text-xs text-[#AEAEB2]">/100</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F5F5F7]">
        <div className={`h-full ${colors.bar}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function MenuBar({
  editor,
  wordCount,
  onAiImprove,
  onAutoFormat,
  aiBusy,
}: {
  editor: Editor | null;
  wordCount: number;
  onAiImprove: () => void;
  onAutoFormat: (style: FormatStyle) => void;
  aiBusy: boolean;
}) {
  if (!editor) return null;
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5EA] bg-white px-3 py-2.5">
      <div className="flex items-center gap-1">
        {[
          { fn: () => editor.chain().focus().toggleBold().run(), icon: Bold, active: editor.isActive("bold"), label: "Bold" },
          { fn: () => editor.chain().focus().toggleItalic().run(), icon: Italic, active: editor.isActive("italic"), label: "Italic" },
          { fn: () => editor.chain().focus().toggleUnderline().run(), icon: UnderlineIcon, active: editor.isActive("underline"), label: "Underline" },
          { fn: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), icon: Heading1, active: editor.isActive("heading", { level: 1 }), label: "H1" },
          { fn: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2, active: editor.isActive("heading", { level: 2 }), label: "H2" },
          { fn: () => editor.chain().focus().toggleBulletList().run(), icon: List, active: editor.isActive("bulletList"), label: "List" },
          { fn: () => editor.chain().focus().toggleOrderedList().run(), icon: ListOrdered, active: editor.isActive("orderedList"), label: "Numbered List" },
          { fn: () => editor.chain().focus().toggleBlockquote().run(), icon: Quote, active: editor.isActive("blockquote"), label: "Quote" },
          { fn: () => editor.chain().focus().toggleHighlight().run(), icon: Highlighter, active: editor.isActive("highlight"), label: "Highlight" },
          { fn: setLink, icon: Link2, active: editor.isActive("link"), label: "Link" },
          { fn: () => editor.chain().focus().clearNodes().unsetAllMarks().run(), icon: Eraser, active: false, label: "Clear Format" },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.fn}
            title={btn.label}
            className={`rounded-lg p-2 transition ${
              btn.active ? "bg-[#F2F3F5] text-[#1D1D1F]" : "text-[#8E8E93] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
            }`}
          >
            <btn.icon className="h-4 w-4" />
          </button>
        ))}
        <button
          onClick={onAiImprove}
          disabled={aiBusy}
          className="ml-1 inline-flex items-center gap-2 rounded-lg bg-[#1D1D1F] px-3 py-2 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
        >
          {aiBusy ? <RotateCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          AI Improve
        </button>
        <button
          onClick={() => onAutoFormat("readability")}
          disabled={aiBusy}
          className="ml-1 inline-flex items-center gap-2 rounded-lg border border-[#D1D1D6] bg-white px-3 py-2 text-sm font-medium text-[#1D1D1F] transition hover:border-[#1D1D1F] disabled:opacity-60"
        >
          {aiBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
          Auto Format
        </button>
      </div>
      <div className="flex items-center gap-3 text-xs text-[#8E8E93]">
        <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{wordCount} words</span>
        <span className="inline-flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />~{Math.max(1, Math.ceil(wordCount / 220))} min</span>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const [title, setTitle] = useState("AI Content Draft");
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiNotes, setAiNotes] = useState<string>("");

  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("Marketing teams");
  const [tone, setTone] = useState("Professional");
  const [industry, setIndustry] = useState("HEALTHCARE");
  const [prompt, setPrompt] = useState("");

  const [scores, setScores] = useState({ seo: 0, geo: 0, compliance: 100 });
  const [flags, setFlags] = useState<ComplianceFlag[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(true);

  const getPrefill = () => {
    if (typeof window === "undefined") {
      return {
        title: "AI Visibility Content Draft",
        content: "<h1>AI Visibility Content Draft</h1><p>Start from scratch or use the AI Studio controls to generate and improve this content.</p>",
      };
    }
    const params = new URLSearchParams(window.location.search);
    const prefillTitle = params.get("prefillTitle")?.trim() || "";
    const prefillText = params.get("prefillText")?.trim() || "";
    if (!prefillTitle && !prefillText) {
      return {
        title: "AI Visibility Content Draft",
        content: "<h1>AI Visibility Content Draft</h1><p>Start from scratch or use the AI Studio controls to generate and improve this content.</p>",
      };
    }
    return {
      title: prefillTitle || "AI Visibility Rewrite Draft",
      content: `<h1>${escapeHtml(prefillTitle || "AI Visibility Rewrite Draft")}</h1><p>${escapeHtml(prefillText).replace(/\n/g, "</p><p>")}</p>`,
    };
  };

  const [initial] = useState(getPrefill);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Placeholder.configure({ placeholder: "Write content or use AI Studio to generate a draft..." }),
    ],
    content: initial.content,
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[560px] px-6 py-6 focus:outline-none",
      },
    },
    onCreate: ({ editor: e }) => {
      const text = e.getText().trim();
      setWordCount(text ? text.split(/\s+/).length : 0);
    },
    onUpdate: ({ editor: e }) => {
      const text = e.getText().trim();
      setWordCount(text ? text.split(/\s+/).length : 0);
    },
  });

  useEffect(() => {
    setTitle(initial.title);
    if (editor) editor.commands.setContent(initial.content);
  }, [editor, initial.content, initial.title]);

  const loadDrafts = async () => {
    try {
      setDraftsLoading(true);
      const response = await fetch("/api/content/drafts", { cache: "no-store" });
      const data = (await response.json()) as { drafts?: SavedDraft[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to load drafts");
      setDrafts(data.drafts ?? []);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Failed to load drafts");
    } finally {
      setDraftsLoading(false);
    }
  };

  useEffect(() => {
    void loadDrafts();
  }, []);

  const openDraft = async (draftId: string) => {
    if (!editor) return;
    try {
      const response = await fetch(`/api/content/${encodeURIComponent(draftId)}`, { cache: "no-store" });
      const data = (await response.json()) as {
        content?: {
          id: string;
          title: string;
          body: unknown;
          industry: string;
          targetKeyword: string | null;
        };
        error?: string;
      };
      if (!response.ok || !data.content) throw new Error(data.error || "Failed to open draft");
      setCurrentDraftId(data.content.id);
      setTitle(data.content.title);
      setIndustry(data.content.industry);
      setKeyword(data.content.targetKeyword ?? "");
      editor.commands.setContent(data.content.body as Parameters<typeof editor.commands.setContent>[0]);
      await analyzeContent();
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Failed to open draft");
    }
  };

  const totalScore = useMemo(() => Math.round((scores.seo + scores.geo + scores.compliance) / 3), [scores]);

  const mapFlags = (incoming: AnalyzeResponse["flags"]): ComplianceFlag[] =>
    incoming.map((flag, idx) => ({
      id: `${idx}-${flag.text}`,
      text: flag.text,
      severity: flag.severity.toLowerCase() as ComplianceFlag["severity"],
      explanation: flag.explanation,
      suggestion: flag.suggestion,
    }));

  const applyHighlights = (nextFlags: ComplianceFlag[]) => {
    if (!editor) return;
    editor.chain().focus().selectAll().unsetHighlight().run();
    const segments: Array<{ from: number; to: number; text: string }> = [];
    editor.state.doc.descendants((node, pos) => {
      if (!node.isText || !node.text) return;
      segments.push({ from: pos + 1, to: pos + 1 + node.text.length, text: node.text });
    });
    for (const flag of nextFlags) {
      const needle = flag.text.toLowerCase().trim();
      if (!needle) continue;
      const color = severityConfig[flag.severity].color;
      for (const segment of segments) {
        let searchStart = 0;
        const lower = segment.text.toLowerCase();
        while (true) {
          const idx = lower.indexOf(needle, searchStart);
          if (idx === -1) break;
          const from = segment.from + idx;
          const to = from + needle.length;
          editor.chain().focus().setTextSelection({ from, to }).setHighlight({ color }).run();
          searchStart = idx + needle.length;
        }
      }
    }
    editor.commands.setTextSelection(editor.state.doc.content.size);
  };

  const analyzeContent = async () => {
    if (!editor) return;
    setAnalyzing(true);
    try {
      const text = editor.getText();
      const response = await fetch("/api/content/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId: currentDraftId ?? "", text, industry }),
      });
      const data = (await response.json()) as AnalyzeResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      const nextFlags = mapFlags(data.flags ?? []);
      setScores(data.scores ?? { seo: 0, geo: 0, compliance: 100 });
      setFlags(nextFlags);
      applyHighlights(nextFlags);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const runAssist = async (mode: "generate" | "improve" | "rewrite" | "format", formatStyle: FormatStyle = "readability") => {
    if (!editor) return;
    setAiBusy(true);
    setAiError(null);
    try {
      const selection = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, " ", " ").trim();
      const response = await fetch("/api/studio/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          formatStyle,
          prompt,
          keyword,
          audience,
          tone,
          industry,
          content: editor.getText(),
          selection,
        }),
      });
      const data = (await response.json()) as AssistResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "AI assist failed");

      if (mode === "rewrite") {
        const { from, to } = editor.state.selection;
        if (from === to) {
          throw new Error("Select text first before using Rewrite Selection.");
        }
        editor.chain().focus().insertContentAt({ from, to }, data.output.html).run();
      } else {
        editor.commands.setContent(data.output.html);
        if (mode !== "format") setTitle(data.output.title || title);
      }
      setAiNotes(data.output.notes || "");
      await analyzeContent();
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "AI request failed");
    } finally {
      setAiBusy(false);
    }
  };

  const handleSave = async () => {
    if (!editor) return;
    setIsSaving(true);
    try {
      const payload = {
        title: title.trim() || "Untitled Draft",
        body: editor.getJSON(),
        industry,
        targetKeyword: keyword.trim() || undefined,
      };

      if (currentDraftId) {
        const response = await fetch(`/api/content/${encodeURIComponent(currentDraftId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as { content?: { id: string }; error?: string };
        if (!response.ok) throw new Error(data.error || "Failed to update draft");
      } else {
        const response = await fetch("/api/content/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as { content?: { id: string }; error?: string };
        if (!response.ok || !data.content?.id) throw new Error(data.error || "Failed to save draft");
        setCurrentDraftId(data.content.id);
      }
      await loadDrafts();
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const buildFileBaseName = () =>
    (title.trim() || "standex-draft")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const triggerDownload = (filename: string, mime: string, content: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportDraft = (format: "html" | "txt" | "json") => {
    if (!editor) return;
    const name = buildFileBaseName();
    if (format === "html") {
      const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title></head><body>${editor.getHTML()}</body></html>`;
      triggerDownload(`${name}.html`, "text/html;charset=utf-8", html);
      return;
    }
    if (format === "txt") {
      triggerDownload(`${name}.txt`, "text/plain;charset=utf-8", editor.getText());
      return;
    }
    triggerDownload(`${name}.json`, "application/json;charset=utf-8", JSON.stringify(editor.getJSON(), null, 2));
  };

  const exportToPrint = () => {
    if (!editor) return;
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
      setAiError("Popup blocked. Allow popups to export as PDF.");
      return;
    }
    printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 16px;line-height:1.65;color:#111}h1,h2,h3{line-height:1.25}p,li{font-size:14px}</style></head><body>${editor.getHTML()}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1D1D1F]">
      <header className="border-b border-[#E5E5EA] bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-xl font-semibold outline-none placeholder:text-[#AEAEB2] sm:text-2xl"
              placeholder="Untitled Document"
            />
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Draft</span>
            {(isSaving || analyzing) && <span className="text-xs text-[#8E8E93]">{isSaving ? "Saving..." : "Analyzing..."}</span>}
          </div>
          <div className="flex items-center gap-2">
            <details className="group relative">
              <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-[#D1D1D6] px-4 py-2 text-sm font-semibold text-[#1D1D1F] transition hover:border-[#1D1D1F]">
                <Download className="h-4 w-4" />
                Export
              </summary>
              <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-[#E5E5EA] bg-white p-1.5 shadow-[0_12px_24px_rgba(17,17,26,0.12)]">
                <button onClick={() => exportDraft("html")} className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]">
                  Export HTML
                </button>
                <button onClick={() => exportDraft("txt")} className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]">
                  Export TXT
                </button>
                <button onClick={() => exportDraft("json")} className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]">
                  Export JSON
                </button>
                <button onClick={exportToPrint} className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]">
                  Print / Save PDF
                </button>
              </div>
            </details>
            <button onClick={() => void handleSave()} className="inline-flex items-center gap-2 rounded-full border border-[#D1D1D6] px-4 py-2 text-sm font-semibold transition hover:border-[#1D1D1F]">
              <Save className="h-4 w-4" />Save Draft
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
              <Send className="h-4 w-4" />Send for Review
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-[#E5E5EA]">
          <MenuBar
            editor={editor}
            wordCount={wordCount}
            onAiImprove={() => void runAssist("improve")}
            onAutoFormat={(style) => void runAssist("format", style)}
            aiBusy={aiBusy}
          />
          <div className="flex-1 overflow-auto">
            <EditorContent editor={editor} />
          </div>
        </div>

        <aside className="w-full max-w-[420px] overflow-auto border-l border-[#E5E5EA] bg-[linear-gradient(180deg,#f7f8fb_0%,#f2f4f8_100%)] p-4">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#DDE2EC] bg-white p-4 shadow-[0_10px_24px_rgba(17,17,26,0.06)]">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">AI Studio</h3>
                <button onClick={() => void analyzeContent()} className="rounded-full border border-[#E5E5EA] px-2.5 py-1 text-[11px] text-[#6B6F76] transition hover:border-[#1D1D1F] hover:text-[#1D1D1F]">
                  Run analysis
                </button>
              </div>
              <div className="space-y-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to create (topic, angle, goals)..."
                  className="min-h-20 w-full rounded-xl border border-[#E5E5EA] bg-[#FAFBFF] px-3 py-2.5 text-sm outline-none focus:border-[#1D1D1F]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Target keyword" className="rounded-xl border border-[#E5E5EA] bg-[#FAFBFF] px-3 py-2 text-sm outline-none focus:border-[#1D1D1F]" />
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="rounded-xl border border-[#E5E5EA] bg-[#FAFBFF] px-3 py-2 text-sm outline-none focus:border-[#1D1D1F]">
                    <option value="HEALTHCARE">Healthcare</option>
                    <option value="FINTECH">FinTech</option>
                    <option value="INVESTMENT">Investment</option>
                    <option value="SAAS">SaaS</option>
                    <option value="INSURANCE">Insurance</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" className="rounded-xl border border-[#E5E5EA] bg-[#FAFBFF] px-3 py-2 text-sm outline-none focus:border-[#1D1D1F]" />
                  <input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Tone" className="rounded-xl border border-[#E5E5EA] bg-[#FAFBFF] px-3 py-2 text-sm outline-none focus:border-[#1D1D1F]" />
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button onClick={() => void runAssist("generate")} disabled={aiBusy} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#111827] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                    {aiBusy ? <RotateCw className="h-3.5 w-3.5 animate-spin" /> : <WandSparkles className="h-3.5 w-3.5" />}Generate
                  </button>
                  <button onClick={() => void runAssist("rewrite")} disabled={aiBusy} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D1D1D6] bg-white px-3 py-2 text-xs font-semibold text-[#1D1D1F] disabled:opacity-60">
                    <Sparkles className="h-3.5 w-3.5" />Rewrite
                  </button>
                  <button onClick={() => void runAssist("improve")} disabled={aiBusy} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D1D1D6] bg-white px-3 py-2 text-xs font-semibold text-[#1D1D1F] disabled:opacity-60">
                    <RotateCw className={`h-3.5 w-3.5 ${aiBusy ? "animate-spin" : ""}`} />Improve
                  </button>
                </div>
                <div className="rounded-xl border border-[#E5E5EA] bg-[#FAFBFF] p-2.5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Auto Formatting</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => void runAssist("format", "readability")} disabled={aiBusy} className="rounded-lg border border-[#D1D1D6] bg-white px-2.5 py-2 text-xs font-medium text-[#1D1D1F] transition hover:border-[#1D1D1F] disabled:opacity-60">Readability</button>
                    <button onClick={() => void runAssist("format", "seo")} disabled={aiBusy} className="rounded-lg border border-[#D1D1D6] bg-white px-2.5 py-2 text-xs font-medium text-[#1D1D1F] transition hover:border-[#1D1D1F] disabled:opacity-60">SEO + GEO</button>
                    <button onClick={() => void runAssist("format", "executive")} disabled={aiBusy} className="rounded-lg border border-[#D1D1D6] bg-white px-2.5 py-2 text-xs font-medium text-[#1D1D1F] transition hover:border-[#1D1D1F] disabled:opacity-60">Executive Brief</button>
                    <button onClick={() => void runAssist("format", "compliance")} disabled={aiBusy} className="rounded-lg border border-[#D1D1D6] bg-white px-2.5 py-2 text-xs font-medium text-[#1D1D1F] transition hover:border-[#1D1D1F] disabled:opacity-60">Compliance-safe</button>
                  </div>
                </div>
                {aiNotes ? <p className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">{aiNotes}</p> : null}
                {aiError ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{aiError}</p> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-[#DDE2EC] bg-white p-4 shadow-[0_10px_24px_rgba(17,17,26,0.06)]">
              <h3 className="mb-3 text-sm font-semibold">Performance</h3>
              <div className="space-y-2.5">
                <ScoreCard score={scores.seo} label="SEO Score" icon={TrendingUp} />
                <ScoreCard score={scores.geo} label="GEO Score" icon={Zap} />
                <ScoreCard score={scores.compliance} label="Compliance" icon={Shield} />
              </div>
              <div className="mt-3 rounded-xl border border-[#E5E5EA] bg-[#FAFBFF] p-3">
                <p className="text-xs text-[#8E8E93]">Overall Performance</p>
                <p className="mt-1 text-2xl font-semibold">{totalScore}<span className="ml-1 text-sm text-[#AEAEB2]">/100</span></p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#DDE2EC] bg-white p-4 shadow-[0_10px_24px_rgba(17,17,26,0.06)]">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Saved Drafts</h3>
                <button onClick={() => void loadDrafts()} className="rounded-full border border-[#E5E5EA] px-2.5 py-1 text-[11px] text-[#6B6F76] transition hover:border-[#1D1D1F] hover:text-[#1D1D1F]">Refresh</button>
              </div>
              {draftsLoading ? (
                <p className="text-xs text-[#8E8E93]">Loading drafts...</p>
              ) : drafts.length === 0 ? (
                <p className="text-xs text-[#8E8E93]">No saved drafts yet. Save this draft to see it here.</p>
              ) : (
                <div className="max-h-48 space-y-2 overflow-auto">
                  {drafts.map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => void openDraft(draft.id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                        currentDraftId === draft.id ? "border-[#1D1D1F] bg-[#F5F5F7]" : "border-[#E5E5EA] bg-[#FAFBFF] hover:border-[#D1D1D6]"
                      }`}
                    >
                      <p className="truncate text-sm font-medium text-[#1D1D1F]">{draft.title}</p>
                      <p className="mt-0.5 text-xs text-[#8E8E93]">
                        {draft.industry} {draft.targetKeyword ? `• ${draft.targetKeyword}` : ""} • {formatRelative(draft.updatedAt)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#DDE2EC] bg-white p-4 shadow-[0_10px_24px_rgba(17,17,26,0.06)]">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Compliance Highlights</h3>
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">{flags.length} issue(s)</span>
              </div>
              <div className="space-y-2.5">
                {flags.length === 0 ? <p className="text-sm text-[#8E8E93]">No issues currently flagged.</p> : null}
                {flags.map((flag) => {
                  const cfg = severityConfig[flag.severity];
                  return (
                    <div key={flag.id} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3`}>
                      <div className="mb-2 flex items-start gap-2">
                        <div className={`rounded-lg ${cfg.icon} p-1.5`}>
                          <AlertTriangle className={`h-3.5 w-3.5 ${cfg.text}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${cfg.text}`}>&quot;{flag.text}&quot;</p>
                          <p className="mt-0.5 text-xs text-[#5D5D66]">{flag.explanation}</p>
                        </div>
                      </div>
                      <p className="rounded-lg bg-white/70 px-2.5 py-2 text-xs text-[#4A4A51]">{flag.suggestion}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

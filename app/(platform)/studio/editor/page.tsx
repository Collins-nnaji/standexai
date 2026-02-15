"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Save,
  Send,
  Eye,
  FileText,
  Zap,
  TrendingUp,
  Shield,
  RotateCw,
  type LucideIcon,
} from "lucide-react";

type ComplianceFlag = {
  id: string;
  text: string;
  severity: "critical" | "warning" | "info";
  explanation: string;
  suggestion: string;
  regulation: string;
};

const mockFlags: ComplianceFlag[] = [
  {
    id: "1",
    text: "guaranteed results",
    severity: "critical",
    explanation: "Absolute guarantees are prohibited in healthcare marketing under FTC guidelines.",
    suggestion: 'Use "may help achieve" or "designed to support" instead',
    regulation: "FTC Act Section 5",
  },
  {
    id: "2",
    text: "cure cancer",
    severity: "critical",
    explanation: "Medical cure claims require FDA approval and clinical evidence.",
    suggestion: "Remove or replace with approved therapeutic claims",
    regulation: "FDA FDCA §502(a)",
  },
  {
    id: "3",
    text: "fastest on the market",
    severity: "warning",
    explanation: "Comparative claims require substantiation.",
    suggestion: 'Use "high-performance" or cite specific metrics with sources',
    regulation: "FTC Advertising FAQ",
  },
];

const severityConfig = {
  critical: { border: "border-red-200", bg: "bg-red-50", text: "text-red-600", icon: "bg-red-100" },
  warning: { border: "border-yellow-200", bg: "bg-yellow-50", text: "text-yellow-600", icon: "bg-yellow-100" },
  info: { border: "border-blue-200", bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100" },
};

function MenuBar({ editor, wordCount }: { editor: Editor | null; wordCount: number }) {
  if (!editor) return null;

  const buttons = [
    { action: () => editor.chain().focus().toggleBold().run(), icon: Bold, active: editor.isActive("bold"), label: "Bold" },
    { action: () => editor.chain().focus().toggleItalic().run(), icon: Italic, active: editor.isActive("italic"), label: "Italic" },
    { action: () => editor.chain().focus().toggleUnderline().run(), icon: UnderlineIcon, active: editor.isActive("underline"), label: "Underline" },
  ];

  const headingButtons = [
    { action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), icon: Heading1, active: editor.isActive("heading", { level: 1 }), label: "H1" },
    { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2, active: editor.isActive("heading", { level: 2 }), label: "H2" },
  ];

  const listButtons = [
    { action: () => editor.chain().focus().toggleBulletList().run(), icon: List, active: editor.isActive("bulletList"), label: "Bullet List" },
    { action: () => editor.chain().focus().toggleOrderedList().run(), icon: ListOrdered, active: editor.isActive("orderedList"), label: "Numbered List" },
    { action: () => editor.chain().focus().toggleBlockquote().run(), icon: Quote, active: editor.isActive("blockquote"), label: "Quote" },
  ];

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5E5EA] bg-white px-4 py-2.5">
      <div className="flex items-center gap-1">
        {buttons.map((btn, i) => (
          <button key={i} onClick={btn.action} className={`rounded-lg p-2 transition ${btn.active ? "bg-[#F5F5F7] text-[#1D1D1F]" : "text-[#AEAEB2] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"}`} title={btn.label}>
            <btn.icon className="h-4 w-4" />
          </button>
        ))}

        <div className="mx-2 h-6 w-px bg-[#E5E5EA]" />

        {headingButtons.map((btn, i) => (
          <button key={i} onClick={btn.action} className={`rounded-lg p-2 transition ${btn.active ? "bg-[#F5F5F7] text-[#1D1D1F]" : "text-[#AEAEB2] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"}`} title={btn.label}>
            <btn.icon className="h-4 w-4" />
          </button>
        ))}

        <div className="mx-2 h-6 w-px bg-[#E5E5EA]" />

        {listButtons.map((btn, i) => (
          <button key={i} onClick={btn.action} className={`rounded-lg p-2 transition ${btn.active ? "bg-[#F5F5F7] text-[#1D1D1F]" : "text-[#AEAEB2] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"}`} title={btn.label}>
            <btn.icon className="h-4 w-4" />
          </button>
        ))}

        <div className="mx-2 h-6 w-px bg-[#E5E5EA]" />

        <button className="flex items-center gap-2 rounded-lg bg-[#1D1D1F] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-black">
          <Sparkles className="h-4 w-4" />
          <span>AI Improve</span>
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs text-[#AEAEB2]">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          <span>{wordCount} words</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          <span>~{Math.ceil(wordCount / 200)} min read</span>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ score, label, icon: Icon }: { score: number; label: string; icon: LucideIcon }) {
  const getColor = () => {
    if (score >= 80) return { text: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" };
    if (score >= 60) return { text: "text-yellow-600", bg: "bg-yellow-50", bar: "bg-yellow-500" };
    return { text: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" };
  };

  const colors = getColor();

  return (
    <div className="rounded-xl border border-[#E5E5EA] bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`rounded-lg ${colors.bg} p-2`}>
            <Icon className={`h-4 w-4 ${colors.text}`} />
          </div>
          <div>
            <p className="text-xs text-[#AEAEB2]">{label}</p>
            <p className={`text-2xl font-semibold ${colors.text}`}>{score}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#AEAEB2]">/ 100</p>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F5F5F7]">
        <div className={`h-full ${colors.bar} transition-all duration-1000`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function EditorPage() {
  const seoScore = 67;
  const geoScore = 58;
  const complianceScore = 45;
  const [showCompliance, setShowCompliance] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight,
      Typography,
      Placeholder.configure({ placeholder: "Start writing your content..." }),
    ],
    content: `<h1>How AI Tools Transform Healthcare Marketing</h1>
<p>In today's digital landscape, healthcare providers need innovative solutions to reach patients effectively. Our platform offers <mark>guaranteed results</mark> that will <mark>cure cancer</mark> and deliver the <mark>fastest performance on the market</mark>.</p>
<h2>Key Benefits</h2>
<ul>
  <li>Advanced AI-powered content generation</li>
  <li>Real-time compliance checking</li>
  <li>SEO and GEO optimization</li>
</ul>`,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[520px] px-8 py-6",
      },
    },
    onCreate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    },
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1D1D1F]">
      <header className="border-b border-[#E5E5EA] bg-white px-6 py-5">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <input type="text" defaultValue="Healthcare Marketing Guide" className="bg-transparent text-2xl font-semibold text-[#1D1D1F] outline-none placeholder:text-[#AEAEB2]" placeholder="Untitled Document" />
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">Draft</span>
            {isSaving && (
              <span className="flex items-center gap-1.5 text-xs text-[#AEAEB2]">
                <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                Saving...
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 rounded-full border border-[#D1D1D6] px-4 py-2 text-sm font-semibold text-[#1D1D1F] transition hover:border-[#1D1D1F]">
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
              <Send className="h-4 w-4" />
              Send for Review
            </button>
            <button className="flex items-center gap-2 rounded-full border border-[#D1D1D6] px-4 py-2 text-sm font-semibold text-[#1D1D1F] transition hover:border-[#1D1D1F]">
              <RotateCw className="h-4 w-4" />
              Sync
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-auto border-r border-[#E5E5EA] bg-white">
          <MenuBar editor={editor} wordCount={wordCount} />
          <div className="flex-1 overflow-auto">
            <EditorContent editor={editor} />
          </div>
        </div>

        <aside className="w-96 overflow-auto border-l border-[#E5E5EA] bg-[#FAFAFA]">
          <div className="border-b border-[#E5E5EA] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1D1D1F]">Performance Scores</h3>
              <button className="text-xs text-[#AEAEB2] hover:text-[#1D1D1F]">Refresh</button>
            </div>
            <div className="space-y-3">
              <ScoreCard score={seoScore} label="SEO Score" icon={TrendingUp} />
              <ScoreCard score={geoScore} label="GEO Score" icon={Zap} />
              <ScoreCard score={complianceScore} label="Compliance" icon={Shield} />
            </div>

            <div className="mt-4 rounded-xl border border-[#E5E5EA] bg-white p-4">
              <p className="text-xs text-[#AEAEB2]">Overall Performance</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-semibold text-[#1D1D1F]">{Math.round((seoScore + geoScore + complianceScore) / 3)}</p>
                <p className="text-sm text-[#AEAEB2]">/ 100</p>
              </div>
            </div>
          </div>

          <div className="border-b border-[#E5E5EA] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1D1D1F]">Top Issues</h3>
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">3 critical</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-600">Prohibited medical claim</p>
                  <p className="mt-0.5 text-xs text-[#6E6E73]">Line 2: &quot;cure cancer&quot;</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-600">FTC violation</p>
                  <p className="mt-0.5 text-xs text-[#6E6E73]">Line 2: &quot;guaranteed results&quot;</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-yellow-200 bg-yellow-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-600">Unsubstantiated claim</p>
                  <p className="mt-0.5 text-xs text-[#6E6E73]">Line 2: &quot;fastest on market&quot;</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <button onClick={() => setShowCompliance(!showCompliance)} className="mb-4 flex w-full items-center justify-between text-sm font-semibold text-[#1D1D1F] transition hover:text-[#6E6E73]">
              <span>Detailed Analysis ({mockFlags.length})</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${showCompliance ? "rotate-90" : ""}`} />
            </button>

            {showCompliance && (
              <div className="space-y-3">
                {mockFlags.map((flag) => {
                  const config = severityConfig[flag.severity];
                  return (
                    <div key={flag.id} className={`rounded-xl border ${config.border} ${config.bg} p-4 transition-all hover:shadow-md`}>
                      <div className="mb-3 flex items-start gap-2.5">
                        <div className={`rounded-lg ${config.icon} p-1.5`}>
                          <AlertTriangle className={`h-4 w-4 ${config.text}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${config.text}`}>&ldquo;{flag.text}&rdquo;</p>
                          <p className="mt-1 text-xs text-[#6E6E73]">{flag.explanation}</p>
                        </div>
                      </div>

                      <div className="mb-3 rounded-lg bg-white/60 p-3">
                        <p className="text-xs font-medium text-[#1D1D1F]">Suggestion</p>
                        <p className="mt-1 text-xs text-[#6E6E73]">{flag.suggestion}</p>
                      </div>

                      <div className="mb-3 flex items-center gap-2 text-xs text-[#AEAEB2]">
                        <Shield className="h-3 w-3" />
                        <span>{flag.regulation}</span>
                      </div>

                      <button className="w-full rounded-lg bg-[#1D1D1F] px-3 py-2 text-xs font-medium text-white transition hover:bg-black">Fix Automatically</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

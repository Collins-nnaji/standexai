"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Editor } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import {
  AlertTriangle, Bold, Download, Eraser, Eye, FileText,
  Heading1, Heading2, Highlighter, Italic, Link2, List,
  ListOrdered, Loader2, Quote, RotateCw, Save, Sparkles,
  Shield, TrendingUp, Underline as UnderlineIcon,
  WandSparkles, Zap, ChevronRight, Activity, Terminal, CheckCircle2
} from "lucide-react";

type ComplianceFlag = {
  id: string;
  text: string;
  severity: "critical" | "warning" | "info";
  explanation: string;
  suggestion: string;
};

type SavedDraft = {
  id: string;
  title: string;
  industry: string;
  targetKeyword: string | null;
  updatedAt: string;
};

function ScoreCard({ score, label, icon: Icon }: { score: number; label: string; icon: typeof TrendingUp }) {
  const getColor = () => {
    if (score >= 80) return { text: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" };
    if (score >= 60) return { text: "text-yellow-600", bg: "bg-yellow-50", bar: "bg-yellow-500" };
    return { text: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" };
  };
  const colors = getColor();
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl ${colors.bg} p-2`}>
            <Icon className={`h-4 w-4 ${colors.text}`} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</div>
            <div className={`text-lg font-black ${colors.text}`}>{score}%</div>
          </div>
        </div>
      </div>
      <div className="mt-4 h-1 rounded-full bg-zinc-100 overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${colors.bar}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function MenuBar({
  editor,
  onAiImprove,
  aiBusy,
}: {
  editor: Editor | null;
  onAiImprove: () => void;
  aiBusy: boolean;
}) {
  if (!editor) return null;
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 bg-white/90 backdrop-blur-md px-6 py-4">
      <div className="flex items-center gap-1">
        {[
          { fn: () => editor.chain().focus().toggleBold().run(), icon: Bold, active: editor.isActive("bold"), label: "Bold" },
          { fn: () => editor.chain().focus().toggleItalic().run(), icon: Italic, active: editor.isActive("italic"), label: "Italic" },
          { fn: () => editor.chain().focus().toggleUnderline().run(), icon: UnderlineIcon, active: editor.isActive("underline"), label: "Underline" },
          { fn: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), icon: Heading1, active: editor.isActive("heading", { level: 1 }), label: "H1" },
          { fn: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2, active: editor.isActive("heading", { level: 2 }), label: "H2" },
          { fn: () => editor.chain().focus().toggleBulletList().run(), icon: List, active: editor.isActive("bulletList"), label: "List" },
          { fn: () => editor.chain().focus().toggleBlockquote().run(), icon: Quote, active: editor.isActive("blockquote"), label: "Quote" },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.fn}
            className={`rounded-xl p-2.5 transition ${btn.active ? "bg-zinc-100 text-zinc-950 shadow-sm" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
          >
            <btn.icon className="h-4 w-4" />
          </button>
        ))}
        <div className="w-px h-6 bg-zinc-200 mx-2"></div>
        <button
          onClick={onAiImprove}
          disabled={aiBusy}
          className="flex items-center gap-2 rounded-2xl bg-zinc-950 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-lg shadow-zinc-950/20 disabled:opacity-60"
        >
          {aiBusy ? <RotateCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Align to brand
        </button>
      </div>
    </div>
  );
}

export default function PromptLabPage() {
  const router = useRouter();
  const [title, setTitle] = useState("Brand Truth Blueprint");
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Placeholder.configure({ placeholder: "Define brand truth, key facts, and how AI should represent your brand..." }),
    ],
    content: "<h1>Brand representation brief</h1><p>Define how your brand should be represented in AI outputs. Use the Representation Guardrails panel to set brand truth and constraints; then run this in Brand Pulse to get your Standex Score.</p>",
    editorProps: {
      attributes: {
        class: "prose prose-zinc max-w-none min-h-[600px] px-10 py-12 focus:outline-none",
      },
    },
    onUpdate: ({ editor: e }) => {
      const text = e.getText().trim();
      setWordCount(text ? text.split(/\s+/).length : 0);
    },
  });

  const handleAiImprove = async () => {
    setAiBusy(true);
    // Simulate AI reasoning
    setTimeout(() => {
      setAiBusy(false);
      if (editor) {
        editor.commands.setContent(editor.getHTML() + "<p><strong>[Representation alignment]:</strong> Brand constraints applied. Factual anchors and consistency checks aligned for Standex Score readiness.</p>");
      }
    }, 1500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="flex h-screen flex-col bg-white">

      {/* Page Header */}
      <header className="border-b border-zinc-100 bg-white px-8 py-5">
        <div className="mx-auto flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent text-2xl font-black text-zinc-950 outline-none placeholder:text-zinc-300 tracking-tight"
                placeholder="e.g. Brand Truth Blueprint"
              />
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400">Status</span>
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-600">Representation studio</span>
                {isSaving && <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/brand-pulse")}
              className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-indigo-700 shadow-xl shadow-indigo-600/20"
            >
              <Shield className="h-4 w-4" />
              Run in Brand Pulse
            </button>
            <button onClick={handleSave} className="rounded-2xl border border-zinc-100 bg-[#F9FAFB] p-4 text-zinc-400 hover:text-zinc-950 transition hover:bg-white hover:shadow-md">
              <Save className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Editor Area */}
        <div className="flex flex-1 flex-col overflow-hidden p-8 lg:p-12">
          <div className="flex-1 overflow-hidden rounded-[3rem] bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col">
            <MenuBar
              editor={editor}
              onAiImprove={handleAiImprove}
              aiBusy={aiBusy}
            />
            <div className="flex-1 overflow-auto custom-scrollbar">
              <EditorContent editor={editor} />
            </div>
            <div className="border-t border-zinc-50 bg-[#F9FAFB] px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-2"><FileText className="h-4 w-4" />{wordCount} Words</span>
                <span className="flex items-center gap-2"><Eye className="h-4 w-4" />~{Math.max(1, Math.ceil(wordCount / 220))} Min Read</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Ready for Brand Pulse
              </div>
            </div>
          </div>
        </div>

        {/* Control Sidebar */}
        <aside className="w-[440px] shrink-0 overflow-auto bg-[#F9FAFB] p-8 lg:p-12 border-l border-zinc-100">
          <div className="space-y-10">

            {/* Architecture Studio Container */}
            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl border border-zinc-100">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight">Representation Guardrails</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Brand truth & alignment</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <WandSparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Brand truth / key facts</label>
                  <textarea
                    placeholder="What should AI say about your brand? Core claims, differentiators, and facts that must stay consistent across models..."
                    className="min-h-[120px] w-full rounded-[1.5rem] border border-zinc-50 bg-[#F9FAFB] px-5 py-4 text-sm font-medium text-zinc-900 outline-none focus:bg-white focus:border-indigo-100 transition shadow-inner"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Reasoning Depth (Temp)</label>
                    <span className="text-[10px] font-bold text-indigo-600">0.7</span>
                  </div>
                  <input type="range" className="w-full accent-indigo-600 h-1 bg-zinc-100 rounded-full appearance-none cursor-pointer" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Top P</label>
                    <input type="number" step="0.1" defaultValue="0.9" className="w-full rounded-2xl border border-zinc-50 bg-[#F9FAFB] px-4 py-3 text-xs font-bold text-zinc-700 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Frequency Penalty</label>
                    <input type="number" step="0.1" defaultValue="0.0" className="w-full rounded-2xl border border-zinc-50 bg-[#F9FAFB] px-4 py-3 text-xs font-bold text-zinc-700 outline-none" />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-50">
                  <label className="pl-1 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-2">Representation constraints</label>
                  {[
                    { name: "Zero Hallucination", active: true },
                    { name: "Factual lock (brand claims)", active: true },
                    { name: "Format strictness", active: true },
                    { name: "Adversarial filter", active: true }
                  ].map(c => (
                    <div key={c.name} className="flex items-center justify-between p-3 rounded-2xl bg-[#F9FAFB] border border-zinc-50">
                      <span className="text-[10px] font-black uppercase text-zinc-600 tracking-tight">{c.name}</span>
                      <div className={`h-5 w-10 rounded-full p-1 transition-colors ${c.active ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
                        <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${c.active ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-black group">
                  <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                  Apply to blueprint
                </button>
              </div>
            </div>

            {/* Representation readiness */}
            <div className="space-y-4">
              <h3 className="pl-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Representation readiness</h3>
              <div className="grid gap-4">
                <ScoreCard score={92} label="Factual clarity" icon={TrendingUp} />
                <ScoreCard score={86} label="Consensus-ready" icon={Zap} />
                <ScoreCard score={98} label="Representation integrity" icon={Shield} />
              </div>
            </div>

            {/* Representation risks */}
            <div className="rounded-[2rem] bg-red-50/50 border border-red-100 p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-black text-red-600 uppercase tracking-tight">Representation risks</h3>
                </div>
                <span className="text-[10px] font-black text-red-600">1 Detected</span>
              </div>
              <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
                <div className="text-[10px] font-black text-zinc-950 uppercase mb-2">&quot;Unclear brand attribution&quot;</div>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-4">One claim could be read as generic; tighten wording so it clearly reflects your brand.</p>
                <div className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100">
                  Fix: Add explicit brand anchor.
                </div>
              </div>
            </div>

          </div>
        </aside>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4D4D8; }
        
        .prose h1 { font-weight: 950; letter-spacing: -0.04em; color: #09090b; margin-bottom: 2.5rem; }
        .prose p { font-weight: 500; font-size: 1.1rem; line-height: 1.8; color: #3f3f46; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}

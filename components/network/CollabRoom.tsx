"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { useEffect, useState, useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Highlighter,
  CloudCheck,
  CloudUpload,
  AlertCircle
} from "lucide-react";

interface CollabRoomProps {
  collabId: string;
  initialContent?: string;
}

export function CollabRoom({ collabId, initialContent }: CollabRoomProps) {
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Highlight,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Start documenting your findings, attach snippets, or draft the paper outline...",
      }),
    ],
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      setSaveStatus("saving");
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const html = editor.getHTML();
          const res = await fetch(`/api/collabs/${collabId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ canvasContent: html }),
          });

          if (!res.ok) throw new Error("Failed to save");
          setSaveStatus("saved");
        } catch (err) {
          console.error("Auto-save error:", err);
          setSaveStatus("error");
        }
      }, 2000);
    },
    editorProps: {
      attributes: {
        class: "prose prose-p:text-zinc-600 prose-headings:font-syne prose-headings:text-zinc-900 prose-a:text-[#7C5CFC] prose-strong:text-zinc-900 max-w-none focus:outline-none min-h-[400px]",
      },
    },
  });

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden flex flex-col h-[700px] shadow-2xl transition-all border-zinc-200">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-black/10 bg-zinc-50/80 backdrop-blur-md p-2 px-3">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded p-2 transition-colors ${editor.isActive('bold') ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded p-2 transition-colors ${editor.isActive('italic') ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`rounded p-2 transition-colors ${editor.isActive('strike') ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`rounded p-2 transition-colors ${editor.isActive('highlight') ? "bg-amber-500/10 text-amber-600" : "text-zinc-500 hover:bg-zinc-200"}`}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </button>
          
          <div className="h-4 w-px bg-zinc-200 mx-2" />
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`rounded p-2 transition-colors ${editor.isActive('heading', { level: 2 }) ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
            title="Heading"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded p-2 transition-colors ${editor.isActive('bulletList') ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rounded p-2 transition-colors ${editor.isActive('orderedList') ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`rounded p-2 transition-colors ${editor.isActive('blockquote') ? "bg-[#7C5CFC]/10 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
        </div>

        {/* Auto-save Status */}
        <div className="flex items-center gap-2 px-2 select-none">
           {saveStatus === "saving" && (
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 animate-pulse">
                <CloudUpload className="h-3 w-3" /> Syncing...
             </div>
           )}
           {saveStatus === "saved" && (
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                <CloudCheck className="h-3 w-3" /> Securely Saved
             </div>
           )}
           {saveStatus === "error" && (
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500">
                <AlertCircle className="h-3 w-3" /> Sync Error
             </div>
           )}
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-zinc-200 focus-within:bg-zinc-50/30 transition-colors">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

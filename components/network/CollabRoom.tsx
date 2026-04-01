"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Highlighter
} from "lucide-react";

export function CollabRoom({ initialContent }: { initialContent?: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Start documenting your findings, attach snippets, or draft the paper outline...",
      }),
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-p:text-zinc-600 prose-headings:font-syne prose-headings:text-zinc-900 prose-a:text-[#7C5CFC] prose-strong:text-zinc-900 max-w-none focus:outline-none min-h-[300px]",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleAction = (action: () => void, isActive: boolean) => (
    <button
      onClick={action}
      className={`rounded p-1.5 transition-colors ${
        isActive ? "bg-[#7C5CFC]/20 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      {/* Icon injected by caller */}
    </button>
  );

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden flex flex-col h-[600px] shadow-2xl">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-black/10 bg-black/20 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-2 transition-colors ${editor.isActive('bold') ? "bg-[#7C5CFC]/20 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-2 transition-colors ${editor.isActive('italic') ? "bg-[#7C5CFC]/20 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded p-2 transition-colors ${editor.isActive('strike') ? "bg-[#7C5CFC]/20 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`rounded p-2 transition-colors ${editor.isActive('highlight') ? "bg-amber-500/20 text-amber-500" : "text-zinc-500 hover:bg-zinc-200"}`}
        >
          <Highlighter className="h-4 w-4" />
        </button>
        
        <div className="h-4 w-px bg-zinc-200 mx-2" />
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded p-2 transition-colors ${editor.isActive('heading', { level: 2 }) ? "bg-[#7C5CFC]/20 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-2 transition-colors ${editor.isActive('bulletList') ? "bg-[#7C5CFC]/20 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-2 transition-colors ${editor.isActive('orderedList') ? "bg-[#7C5CFC]/20 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded p-2 transition-colors ${editor.isActive('blockquote') ? "bg-[#7C5CFC]/20 text-[#7C5CFC]" : "text-zinc-500 hover:bg-zinc-200"}`}
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 focus-within:bg-[#151729] transition-colors">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

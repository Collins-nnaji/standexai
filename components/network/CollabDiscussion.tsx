"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

interface CollabDiscussionProps {
  collabId: string;
  isMember: boolean;
}

export function CollabDiscussion({ collabId, isMember }: CollabDiscussionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/collabs/${collabId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMessages();
    // Poll every 10 seconds for simple "real-time"
    const interval = setInterval(() => void fetchMessages(), 10000);
    return () => clearInterval(interval);
  }, [collabId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/collabs/${collabId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() })
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages(prev => [...prev, message]);
        setInput("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-60 flex-col items-center justify-center space-y-3 rounded-2xl border border-zinc-200/60 bg-white shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-[#7C5CFC]" />
        <p className="text-xs font-medium text-zinc-500">Loading discussion...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden h-[500px]">
      {/* Header */}
      <div className="border-b border-zinc-100 px-5 py-4 bg-white/50">
        <h3 className="font-syne text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#7C5CFC]" />
          Threaded Discussion
        </h3>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 [scrollbar-width:thin] scrollbar-thumb-zinc-200"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400">
            <MessageSquare className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm font-medium">No messages yet.</p>
            <p className="text-[11px] mt-1">Start the conversation below.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                {m.user.avatar ? (
                  <img src={m.user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-400">
                    {(m.user.name || "?")[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-zinc-900">{m.user.name || "Researcher"}</span>
                  <span className="text-[10px] text-zinc-400">
                    {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600 leading-relaxed break-words whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      {isMember && (
        <div className="p-4 border-t border-zinc-100 bg-white/50">
          <form onSubmit={handleSendMessage} className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all resize-none max-h-32"
              rows={2}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="absolute right-2.5 bottom-2.5 h-8 w-8 flex items-center justify-center rounded-lg bg-[#7C5CFC] text-white shadow-md hover:bg-[#6042db] transition-all disabled:opacity-50 active:scale-95"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
          <p className="mt-2 text-[10px] text-zinc-400 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
}

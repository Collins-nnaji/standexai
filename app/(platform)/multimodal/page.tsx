"use client";

import { useState } from "react";
import {
    MonitorPlay, Plus, Image as ImageIcon, Video, ArrowRight, Download, Layers, Play,
    Zap, Cpu, Sparkles, Box, Share2, History
} from "lucide-react";

type NodeStatus = "idle" | "generating" | "completed" | "error";

type CanvasNode = {
    id: string;
    type: "text_prompt" | "image" | "video";
    status: NodeStatus;
    content: string; // text or url
    model: string;
};

export default function MultimodalPage() {
    const [nodes, setNodes] = useState<CanvasNode[]>([
        {
            id: "node_1",
            type: "text_prompt",
            status: "completed",
            content: "The futuristic command center, rendered in obsidian and neon emerald. Volumetric lighting and 8k photorealistic quality.",
            model: "Foundry Blueprint"
        }
    ]);

    const [promptInput, setPromptInput] = useState("");

    const addNode = (type: "text_prompt" | "image" | "video", content = "") => {
        const newNode: CanvasNode = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            status: "idle",
            content,
            model: type === "image" ? "Vision-A1 (Flux)" : type === "video" ? "Motion-V1 (Luma)" : "Foundry Core"
        };
        setNodes(prev => [...prev, newNode]);
        return newNode.id;
    };

    const handleGenerateText = () => {
        if (!promptInput.trim()) return;
        const id = addNode("text_prompt", promptInput);
        setNodes(prev => prev.map(n => n.id === id ? { ...n, status: "completed" } : n));
        setPromptInput("");
    };

    const executePipeline = (sourceNodeId: string, targetType: "image" | "video") => {
        const id = addNode(targetType);
        setNodes(prev => prev.map(n => n.id === id ? { ...n, status: "generating" } : n));

        setTimeout(() => {
            setNodes(prev => prev.map(n => {
                if (n.id === id) {
                    return {
                        ...n,
                        status: "completed",
                        content: targetType === "image"
                            ? "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800"
                            : "https://cdn.dribbble.com/users/32512/screenshots/8243673/media/d9d2cb37f61c9ec8cdbdac9fa3c44c5c.mp4"
                    };
                }
                return n;
            }));
        }, 3000);
    };

    return (
        <div className="flex h-screen w-full flex-col bg-white">

            {/* Studio Header */}
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-zinc-100 bg-white px-8">
                <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 shadow-sm">
                        <MonitorPlay className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-zinc-950 uppercase tracking-tight">Studio Canvas</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Pipeline Active</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 rounded-2xl bg-[#F9FAFB] border border-zinc-100 px-6 py-3 text-xs font-black uppercase tracking-widest text-zinc-500 transition hover:bg-white hover:text-zinc-950 hover:shadow-md">
                        <Share2 className="h-4 w-4" />
                        Share Studio
                    </button>
                    <button className="flex items-center gap-3 rounded-2xl bg-zinc-950 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-xl shadow-zinc-950/20">
                        <Download className="h-4 w-4" />
                        Export Assets
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">

                {/* Generator Controls */}
                <aside className="w-[380px] shrink-0 border-r border-zinc-100 bg-[#F9FAFB] p-8 flex flex-col gap-10">
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8">Node Architecture</h2>
                        <div className="space-y-6">
                            <button className="w-full flex items-center justify-between rounded-[2rem] border border-zinc-100 bg-white p-6 transition-all hover:shadow-xl hover:scale-[1.02] group">
                                <div className="flex items-center gap-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                        <Layers className="h-6 w-6" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm font-black text-zinc-950 block">Foundry Node</span>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Import Logic</span>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-zinc-200 group-hover:text-indigo-600 transition-transform group-hover:translate-x-2" />
                            </button>

                            <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <Zap className="h-4 w-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Synthesis Injection</span>
                                </div>
                                <textarea
                                    value={promptInput}
                                    onChange={(e) => setPromptInput(e.target.value)}
                                    placeholder="Inject new reasoning manual..."
                                    className="w-full bg-[#F9FAFB] border border-zinc-100 rounded-2xl px-5 py-4 min-h-[140px] text-xs font-bold text-zinc-700 outline-none focus:bg-white focus:border-indigo-100 transition shadow-inner resize-none placeholder:text-zinc-300 leading-relaxed"
                                />
                                <button
                                    onClick={handleGenerateText}
                                    className="mt-6 w-full rounded-2xl bg-zinc-950 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black hover:shadow-2xl flex items-center justify-center gap-3"
                                >
                                    <Plus className="h-5 w-5" />
                                    Create Node
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8">Unit Matrix</h2>
                        <div className="space-y-4">
                            <div className="p-6 rounded-3xl border border-purple-100 bg-purple-50/30 flex items-center justify-between transition-all hover:bg-white hover:shadow-lg">
                                <div className="flex items-center gap-4">
                                    <ImageIcon className="h-6 w-6 text-purple-600" />
                                    <div>
                                        <span className="text-xs font-black text-purple-600 uppercase">Vision Synth</span>
                                    </div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            </div>
                            <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/30 flex items-center justify-between transition-all hover:bg-white hover:shadow-lg">
                                <div className="flex items-center gap-4">
                                    <Video className="h-6 w-6 text-emerald-600" />
                                    <div>
                                        <span className="text-xs font-black text-emerald-600 uppercase">Motion Lab</span>
                                    </div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Studio Workspace Area */}
                <main className="flex-1 bg-white p-12 overflow-auto custom-scrollbar-h relative">

                    <div className="absolute top-12 left-12 flex items-center gap-3 opacity-20">
                        <Box className="h-5 w-5 text-zinc-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Workspace</span>
                    </div>

                    <div className="flex items-center gap-16 min-w-max pt-16">
                        {nodes.map((node, index) => (
                            <div key={node.id} className="flex items-center gap-16">

                                {/* Connector */}
                                {index > 0 && (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-0.5 w-20 bg-zinc-100 rounded-full"></div>
                                        <ArrowRight className="h-5 w-5 text-zinc-200" />
                                    </div>
                                )}

                                {/* Node Profile */}
                                <div className="group relative w-[420px] shrink-0">
                                    <div className="relative flex flex-col bg-white rounded-[3rem] shadow-xl border border-zinc-100 overflow-hidden transform transition duration-700 hover:-translate-y-2">
                                        {/* Header */}
                                        <div className="bg-[#F9FAFB] px-10 py-6 border-b border-zinc-100 flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className={`p-3 rounded-2xl ${node.type === 'text_prompt' ? 'bg-indigo-50 text-indigo-600' : node.type === 'image' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {node.type === "text_prompt" && <Layers className="h-5 w-5" />}
                                                    {node.type === "image" && <ImageIcon className="h-5 w-5" />}
                                                    {node.type === "video" && <Video className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block">{node.model}</span>
                                                    <span className="text-sm font-black text-zinc-950 uppercase">Profile_0{index + 1}</span>
                                                </div>
                                            </div>
                                            {node.status === "generating" && <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />}
                                        </div>

                                        {/* Synthesis Content */}
                                        <div className="p-10 min-h-[280px] flex flex-col justify-center bg-white">
                                            {node.status === "generating" ? (
                                                <div className="flex flex-col items-center justify-center py-12">
                                                    <div className="mb-8 h-16 w-16 relative flex items-center justify-center">
                                                        <div className="absolute inset-0 border-[4px] border-zinc-50 rounded-full"></div>
                                                        <div className="absolute inset-0 border-[4px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                                                        <Cpu className="h-6 w-6 text-indigo-600" />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-300">Synthesizing...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    {node.type === "text_prompt" && (
                                                        <p className="text-base font-bold text-zinc-800 leading-relaxed font-sans">{node.content}</p>
                                                    )}
                                                    {node.type === "image" && node.content && (
                                                        <div className="rounded-[2rem] border border-zinc-100 overflow-hidden shadow-sm group/media relative">
                                                            <img src={node.content} alt="Output" className="w-full object-cover aspect-video" />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Control Bar */}
                                        {node.status === "completed" && (
                                            <div className="bg-[#F9FAFB] border-t border-zinc-100 p-6 flex gap-4">
                                                {node.type === "text_prompt" && (
                                                    <button
                                                        onClick={() => executePipeline(node.id, "image")}
                                                        className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-white py-4 text-[10px] font-black uppercase tracking-widest text-purple-600 border border-zinc-100 transition hover:bg-zinc-950 hover:text-white hover:border-zinc-950"
                                                    >
                                                        <ImageIcon className="h-4 w-4" /> Synthesize
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => executePipeline(node.id, "video")}
                                                    className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-white py-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-zinc-100 transition hover:bg-zinc-950 hover:text-white hover:border-zinc-950"
                                                >
                                                    <Video className="h-4 w-4" /> Animate
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                </main>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar-h::-webkit-scrollbar { height: 10px; }
        .custom-scrollbar-h::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; border: 3px solid white; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb:hover { background: #D4D4D8; }
      `}} />
        </div>
    );
}

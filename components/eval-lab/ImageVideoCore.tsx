"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Scan,
  Box,
  Search,
  Terminal,
  ImageIcon,
  VideoIcon,
  Play,
  Download,
  Monitor,
  Zap,
  Activity,
  Loader2,
  Sparkles,
  ArrowRight,
  Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSOLE_THEMES, type ConsoleThemeMode, type ConsoleTheme } from "@/components/console/console-theme";
import { useState, useEffect } from "react";

type ImageVideoCoreProps = {
  themeMode: ConsoleThemeMode;
  activeTab: "vision" | "pixel" | "motion";
};

import type { Variants } from "framer-motion";

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function ImageVideoCore({ themeMode, activeTab }: ImageVideoCoreProps) {
  const t = CONSOLE_THEMES[themeMode];

  return (
    <div className={cn("flex flex-1 flex-col h-full", t.workspaceSurface)}>
      <div className={cn("flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8", t.scrollbar)}>
        <div className="mx-auto max-w-6xl space-y-10 pb-16">
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            key={activeTab + "-header"}
            className="space-y-1 mb-10 pl-2 border-l-4 border-indigo-500/50"
          >
            <h1 className={cn("text-3xl font-black tracking-tight", t.text)}>
              {activeTab === "vision" && "Vision Engine"}
              {activeTab === "pixel" && "Pixel Synthesis"}
              {activeTab === "motion" && "Motion Studio"}
            </h1>
            <p className={cn("text-sm", t.muted)}>
              {activeTab === "vision" && "Analyze imagery using state-of-the-art vision models."}
              {activeTab === "pixel" && "Synthesize ultra-high fidelity images from precise text prompts."}
              {activeTab === "motion" && "Generate video interpolations and exact temporal motion."}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === "vision" && <VisionEngineView key="vision" t={t} />}
            {activeTab === "pixel" && <PixelSynthesisView key="pixel" t={t} />}
            {activeTab === "motion" && <MotionStudioView key="motion" t={t} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function VisionEngineView({ t }: { t: ConsoleTheme }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 2500);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <div className="lg:col-span-8 space-y-6">
        <motion.div variants={itemVariants} className={cn("aspect-[16/9] relative overflow-hidden group rounded-2xl border shadow-sm transition-all duration-500", t.toolsCard, t.border, isAnalyzing ? "ring-2 ring-indigo-500/50" : "")}>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-transparent to-black/5">
             {analyzed ? (
               <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-indigo-500/10 z-0"></div>
                  <div className="absolute left-1/4 top-1/4 w-32 h-32 border-2 border-green-500/80 rounded bg-green-500/10 flex items-start justify-start p-1.5 backdrop-blur-sm z-10 transition-all hover:scale-105">
                     <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest bg-black/60 px-1 rounded-sm">Vehicle_01 (99%)</span>
                  </div>
                  <div className="absolute right-1/3 bottom-1/3 w-40 h-24 border-2 border-indigo-500/80 rounded bg-indigo-500/10 flex items-start justify-start p-1.5 backdrop-blur-sm z-10 transition-all hover:scale-105">
                     <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-black/60 px-1 rounded-sm">Pedestrian_Grp (92%)</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                     <p className="text-xs text-white/90 font-mono">Input: urban_intersection_raw.webp</p>
                  </div>
               </div>
             ) : (
               <div className="flex flex-col items-center gap-6 text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={cn("h-20 w-20 rounded-full border border-dashed flex items-center justify-center transition-all cursor-pointer relative", t.borderSub, t.muted, isAnalyzing ? "animate-spin" : "")}
                  >
                     {isAnalyzing ? <Loader2 className="h-8 w-8 text-indigo-500" /> : <Upload className="h-8 w-8" />}
                     {!isAnalyzing && <div className="absolute -inset-2 rounded-full border border-indigo-500/0 hover:border-indigo-500/30 transition-all animate-pulse duration-1000"></div>}
                  </motion.div>
                  <div className="space-y-1.5">
                     <p className={cn("text-xs font-bold uppercase tracking-widest", t.text)}>
                       {isAnalyzing ? "Processing Neural Map..." : "Drop image here"}
                     </p>
                     <p className={cn("text-[11px] tracking-widest", t.muted2)}>PNG, JPEG, WEBP up to 20MB</p>
                  </div>
               </div>
             )}
          </div>
          
          <div className="absolute top-4 left-4 flex gap-1.5 z-20">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
           {[
             { label: "OCR Scan", val: analyzed ? "Failed" : isAnalyzing ? "Scanning..." : "Awaiting", icon: Scan, active: analyzed ? false : true },
             { label: "Obj Detect", val: analyzed ? "14 Detected" : isAnalyzing ? "Scanning..." : "Awaiting", icon: Box, active: true },
             { label: "Semantic", val: analyzed ? "High Match" : isAnalyzing ? "Scanning..." : "Awaiting", icon: Search, active: true }
           ].map((stat, i) => (
             <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                key={i} 
                className={cn("p-4 rounded-xl border text-center flex flex-col items-center gap-3 transition-colors duration-300", t.toolsCard, t.borderSub, analyzed && stat.active ? "border-indigo-500/30 bg-indigo-500/5" : "")}
             >
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", analyzed && stat.active ? "bg-indigo-500/20 text-indigo-500" : "bg-zinc-500/10 " + t.muted)}>
                   <stat.icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider block", t.muted)}>{stat.label}</span>
                    <span className={cn("text-xs font-semibold block transition-colors", analyzed ? t.text : t.muted2)}>{stat.val}</span>
                </div>
             </motion.div>
           ))}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="lg:col-span-4 h-full">
        <div className={cn("p-6 flex flex-col h-full rounded-2xl border shadow-sm relative overflow-hidden group", t.toolsCard, t.border)}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
          
          <div className={cn("space-y-2 border-b pb-5 mb-5", t.borderSub)}>
             <h3 className={cn("text-xs font-black uppercase tracking-wider flex items-center gap-2", t.text)}>
                <Terminal className="h-4 w-4 text-indigo-500" /> Telemetry Report
             </h3>
             <p className={cn("text-xs leading-relaxed", t.muted2)}>
                Object detection models and scene analysis overview.
             </p>
          </div>

          <div className="flex-1 flex flex-col pt-2">
            {analyzed ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                 <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-[color:var(--t-text)]">
                       <span className={t.muted}>Confidence Score</span>
                       <span className="text-green-500">92%</span>
                    </div>
                    <div className={cn("h-1.5 w-full rounded-full overflow-hidden", t.s2)}>
                       <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} className="h-full bg-green-500" transition={{ duration: 1 }} />
                    </div>
                 </div>
                 <div className="pt-4 space-y-3">
                    <p className={cn("text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Findings Summary</p>
                    <div className={cn("p-3 rounded-lg text-xs leading-relaxed font-mono", t.s1, t.text)}>
                       Scene represents an urban intersection. Detected multiple vehicles (avg confidence 96%) and a pedestrian grouping. Low OCR correlation found. No critical risks identified in mapping vector space.
                    </div>
                 </div>
              </motion.div>
            ) : (
               <div className="flex-1 flex flex-col justify-center items-center py-12">
                 <Scan className={cn("h-10 w-10 mb-5 opacity-20", t.muted)} strokeWidth={1} />
                 <p className={cn("text-sm text-center max-w-[200px]", t.muted2)}>
                    {isAnalyzing ? "Interfacing with vision models..." : "Awaiting visual input to initiate analysis buffers."}
                 </p>
               </div>
            )}
          </div>

          {!analyzed && (
            <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleAnalyze}
               disabled={isAnalyzing}
               className={cn("w-full py-3 rounded-xl text-sm font-semibold transition-all mt-6 shadow-md flex items-center justify-center gap-2", t.btnPrimary, isAnalyzing ? "opacity-70 cursor-not-allowed" : "")}
            >
               {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
               {isAnalyzing ? "Analyzing..." : "Analyze Image"}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PixelSynthesisView({ t }: { t: ConsoleTheme }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 3000);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-12 space-y-10">
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
           
           {/* Composer Band */}
           <div className={cn("flex-1 relative rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all focus-within:ring-2 focus-within:ring-indigo-500/30", t.toolsCard, t.border)}>
              <div className="flex-1 p-4">
                 <textarea 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   disabled={isGenerating}
                   placeholder="Describe the image you want to synthesize... (e.g. 'A sleek technical workspace bathed in neon pink and cyan')"
                   className={cn("w-full h-full min-h-[120px] bg-transparent focus:outline-none resize-none text-base leading-relaxed placeholder:font-light", t.text, "placeholder:opacity-50")}
                 />
              </div>
              <div className={cn("px-4 py-3 border-t bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between", t.borderSub)}>
                 <div className="flex items-center gap-2">
                    <button className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors", t.s2, t.navHover)}>
                       <Settings2 className="h-3.5 w-3.5" /> Style Presets
                    </button>
                    <div className={cn("h-4 w-px", t.borderSub)} />
                    <span className={cn("text-[11px] font-medium", t.muted2)}>
                       {prompt.length} / 1000 chars
                    </span>
                 </div>

                 <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className={cn("h-10 w-10 md:h-9 md:w-auto md:px-5 rounded-full md:rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all", t.btnPrimary, (!prompt.trim() || isGenerating) ? "opacity-50 cursor-not-allowed" : "")}
                 >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <>
                        <span className="hidden md:inline">Generate</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                 </motion.button>
              </div>
           </div>
           
           {/* Quick Parameters */}
           <div className={cn("lg:w-72 space-y-4 p-5 rounded-2xl border shadow-sm flex flex-col", t.toolsCard, t.borderSub)}>
              <div className={cn("flex items-center gap-2 border-b pb-3", t.borderSub)}>
                 <Settings2 className={cn("h-4 w-4", t.text)} />
                 <p className={cn("text-[12px] font-bold uppercase tracking-wider", t.text)}>Parameters</p>
              </div>
              <div className="space-y-5 flex-1 pt-2">
                 <div className="space-y-2">
                    <label className={cn("text-xs font-semibold", t.text)}>Aspect Ratio</label>
                    <select className={cn("w-full rounded-lg border text-sm py-2 px-3 focus:outline-none transition-colors cursor-pointer appearance-none bg-no-repeat", t.input)} style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%)', backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)', backgroundSize: '5px 5px, 5px 5px' }}>
                       <option>16:9 Landscape</option>
                       <option>9:16 Portrait</option>
                       <option>1:1 Square</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className={cn("text-xs font-semibold", t.text)}>Quality</label>
                    <select className={cn("w-full rounded-lg border text-sm py-2 px-3 focus:outline-none transition-colors cursor-pointer appearance-none bg-no-repeat", t.input)} style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%)', backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)', backgroundSize: '5px 5px, 5px 5px' }}>
                       <option>Standard</option>
                       <option>HD (Pro)</option>
                    </select>
                 </div>
              </div>
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6 pt-4">
           <div className={cn("flex items-center justify-between border-b pb-3", t.borderSub)}>
              <h3 className={cn("text-sm font-bold tracking-tight", t.text)}>Recent Generations</h3>
              <button className={cn("text-xs font-semibold hover:underline transition-all", t.info)}>View Library</button>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Simulated Generation Tile */}
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className={cn("aspect-square rounded-2xl border shadow-sm relative overflow-hidden flex flex-col items-center justify-center p-4", t.toolsCard, t.border)}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent animate-pulse" />
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3 z-10" />
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest text-center z-10", t.muted)}>Synthesizing latent space...</span>
                  
                  <div className="absolute bottom-4 left-4 right-4 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "linear" }}
                        className="h-full bg-indigo-500"
                     />
                  </div>
                </motion.div>
              )}

              {/* Completed Generated Tile */}
              {generated && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className={cn("aspect-square rounded-2xl border shadow-md relative overflow-hidden group cursor-pointer", t.border)}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <p className="text-[10px] font-medium text-white line-clamp-2">{prompt}</p>
                  </div>
                </motion.div>
              )}

              {/* Empty Tiles Placeholder */}
              {[1, 2, 3, 4].slice(0, 4 - (isGenerating ? 1 : 0) - (generated ? 1 : 0)).map((i) => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={i} 
                  className={cn("aspect-square rounded-2xl border border-dashed flex items-center justify-center transition-colors", t.s1, t.borderSub)}
                >
                   <div className={cn("flex flex-col items-center gap-2", t.muted2)}>
                      <ImageIcon className="h-6 w-6 opacity-30" />
                   </div>
                </motion.div>
              ))}
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function MotionStudioView({ t }: { t: ConsoleTheme }) {
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRender = () => {
    setIsRendering(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsRendering(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      <div className="lg:col-span-7 space-y-4">
        <motion.div variants={itemVariants} className={cn("aspect-[16/9] relative flex flex-col overflow-hidden rounded-2xl border shadow-sm group", t.toolsCard, t.border)}>
           <div className={cn("flex-1 flex items-center justify-center relative", isRendering ? "bg-black" : "")}>
              
              {isRendering ? (
                <div className="flex flex-col items-center gap-4 text-white z-10 w-full max-w-xs px-6">
                   <Activity className="h-8 w-8 text-emerald-500 animate-pulse" />
                   <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Rendering Frame Data</p>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                      <motion.div 
                        className="h-full bg-emerald-500"
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                      />
                   </div>
                   <p className="text-[10px] font-mono opacity-60 text-right w-full">{progress}%</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 transition-transform duration-500 group-hover:scale-105">
                   <div className={cn("h-16 w-16 rounded-full flex items-center justify-center shadow-lg", t.s2)}>
                      <VideoIcon className={cn("h-8 w-8", t.muted)} />
                   </div>
                   <p className={cn("text-xs font-bold uppercase tracking-wider", t.muted2)}>Canvas Empty</p>
                </div>
              )}

              {/* Decorative scanline effect during render */}
              {isRendering && (
                <motion.div 
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent pointer-events-none"
                />
              )}
           </div>
           
           <div className={cn("p-5 border-t relative z-20", t.borderSub, t.s2)}>
              <div className={cn("h-1.5 w-full rounded-full relative cursor-pointer group/scrub", t.s4)}>
                 <div className={cn("absolute top-0 left-0 h-full w-0 rounded-full flex items-center justify-end", t.btnPrimary)} style={{ width: isRendering ? `${progress}%` : '0%' }}>
                    <div className="w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/scrub:scale-100 transition-transform absolute right-[-6px]" />
                 </div>
              </div>
              <div className={cn("flex justify-between items-center text-xs font-semibold mt-4", t.muted)}>
                 <div className="flex items-center gap-5">
                    <button className={cn("p-1.5 rounded-full transition-colors", t.navHover, t.text)}>
                       <Play className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-[11px] opacity-80">
                      {isRendering ? `0:0${Math.floor(progress/20)} / 0:05` : "0:00 / 0:00"}
                    </span>
                 </div>
                 <div className="flex gap-4">
                    <button className={cn("hover:text-[color:var(--t-text)] transition-colors", t.muted)}><Download className="h-4 w-4" /></button>
                    <button className={cn("hover:text-[color:var(--t-text)] transition-colors", t.muted)}><Monitor className="h-4 w-4" /></button>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>

      <div className="lg:col-span-5 h-full">
         <motion.div variants={itemVariants} className={cn("p-6 sm:p-8 flex flex-col h-full rounded-2xl border shadow-sm", t.toolsCard, t.border)}>
            <div className="space-y-1 mb-8 pb-4 border-b border-[color:var(--t-borderSub)]">
               <h3 className={cn("text-lg font-black tracking-tight", t.text)}>Motion Directives</h3>
               <p className={cn("text-xs leading-relaxed", t.muted2)}>Configure the temporal prompt and output simulation constraints.</p>
            </div>

            <div className="space-y-6 flex-1">
               <div className="space-y-2">
                  <label className={cn("text-[11px] font-bold uppercase tracking-wider", t.text)}>Prompt Narrative</label>
                  <textarea 
                    placeholder="Describe the desired motion in detail..."
                    className={cn("w-full h-32 p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none text-sm transition-shadow", t.input)}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <p className={cn("text-[11px] font-bold uppercase tracking-wider", t.text)}>Duration (sec)</p>
                     <div className={cn("flex items-center justify-between p-3 rounded-xl border transition-colors hover:border-emerald-500/30", t.input)}>
                        <span className="font-semibold px-1">5.0</span>
                        <Zap className="h-4 w-4 opacity-40 text-emerald-500" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <p className={cn("text-[11px] font-bold uppercase tracking-wider", t.text)}>Target FPS</p>
                     <div className={cn("flex items-center justify-between p-3 rounded-xl border transition-colors hover:border-emerald-500/30", t.input)}>
                        <span className="font-semibold px-1">24</span>
                        <Activity className="h-4 w-4 opacity-40 text-emerald-500" />
                     </div>
                  </div>
               </div>
            </div>

            <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleRender}
               disabled={isRendering}
               className={cn("w-full py-3.5 rounded-xl text-sm font-bold transition-all mt-8 shadow-sm flex items-center justify-center gap-2", t.btnPrimary, isRendering ? "opacity-50 cursor-not-allowed" : "hover:shadow-md")}
            >
               {isRendering ? <Loader2 className="h-4 w-4 animate-spin" /> : <VideoIcon className="h-4 w-4" />}
               {isRendering ? "Rendering Pipeline..." : "Execute Temporal Render"}
            </motion.button>
         </motion.div>
      </div>
    </motion.div>
  );
}

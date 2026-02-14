"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-dismiss
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right-full duration-300",
                            toast.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-500/20 dark:text-emerald-400",
                            toast.type === "error" && "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-500/20 dark:text-rose-400",
                            toast.type === "info" && "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500/20 dark:text-blue-400"
                        )}
                    >
                        {toast.type === "success" && <CheckCircle className="h-4 w-4" />}
                        {toast.type === "error" && <AlertCircle className="h-4 w-4" />}
                        {toast.type === "info" && <Info className="h-4 w-4" />}
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                            className="ml-auto opacity-50 hover:opacity-100"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

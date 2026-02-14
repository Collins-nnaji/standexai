"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={cn(
                    "relative w-full max-w-lg bg-[var(--bg-panel)] border border-[var(--line)] rounded-xl shadow-2xl animate-in zoom-in-95 duration-200",
                    className
                )}
            >
                <div className="flex items-center justify-between p-4 border-b border-[var(--line)]">
                    <h3 className="text-lg font-bold text-[var(--ink-900)]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-[var(--ink-500)] hover:text-[var(--ink-900)] hover:bg-[var(--line)]/50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

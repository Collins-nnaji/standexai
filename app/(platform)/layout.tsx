import { Sidebar } from "@/components/navigation/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <ToastProvider>
                <Sidebar />
                <main className="lg:pl-64 min-h-screen transition-all duration-200">
                    <div className="max-w-7xl mx-auto p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </ToastProvider>
        </ThemeProvider>
    );
}

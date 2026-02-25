"use client"

import { Inter, Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";
import { CommemorativeSidebar } from "@/components/shared/CommemorativeSidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation"

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname()
    const isLoginPage = pathname === "/login"

    return (
        <html lang="pt-BR" className="dark">
            <body className={cn(
                "min-h-screen bg-background text-foreground antialiased selection:bg-primary/30",
                dmSans.variable,
                spaceGrotesk.variable
            )}>
                {isLoginPage ? (
                    <main className="w-full">
                        {children}
                    </main>
                ) : (
                    <div className="flex">
                        <Sidebar />
                        <main className="flex-1 p-8 h-screen overflow-y-auto custom-scrollbar">
                            {children}
                        </main>
                        <CommemorativeSidebar />
                    </div>
                )}
            </body>
        </html>
    );
}

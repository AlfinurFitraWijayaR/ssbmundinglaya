import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSB Mundinglaya",
  description: "SSB Mundinglaya Management System",
};

import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className={`${geist.className} min-h-full flex flex-col`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}

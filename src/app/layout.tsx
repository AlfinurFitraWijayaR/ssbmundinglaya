import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Website SSB Mundinglaya",
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
    <html lang="id" className="h-full antialiased overflow-x-hidden">
      <body
        className={`${geist.className} min-h-full flex flex-col overflow-x-hidden`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}

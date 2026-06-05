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
import NextTopLoader from "nextjs-toploader";

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
        <NextTopLoader
          color="var(--color-brand-gold)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--color-brand-gold),0 0 5px var(--color-brand-gold)"
        />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}

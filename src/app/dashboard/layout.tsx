import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50/30 aurora-bg text-foreground">
        <header className="h-10 flex items-center px-4 border-b border-border bg-white/50 backdrop-blur-md sticky top-0 z-10 md:hidden">
          <SidebarTrigger />
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { logout } from "@/modules/auth/actions";
import Image from "next/image";

const items = [
  {
    title: "Ringkasan",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manajemen Siswa",
    url: "/dashboard/student",
    icon: Users,
  },
  // {
  //   title: "Arus Kas & Iuran",
  //   url: "/dashboard/finance",
  //   icon: Wallet,
  // },
  {
    title: "Riwayat Iuran Siswa",
    url: "/dashboard/payment",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Image src="/logossb.svg" alt="Logo" width={32} height={32} />
          <h2 className="font-semibold text-md">SSB Mundinglaya</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 w-full text-left text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import { logout } from "@/modules/auth/actions";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface SupportItem {
  icon: ReactNode;
  label: string;
  href: string;
}

const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-zinc-400"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function ListSupport({ items }: { items: SupportItem[] }) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {items.map((item, i) => {
          return (
            <Link
              key={i}
              href={item.href}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50"
            >
              <div className="flex items-center gap-4 text-zinc-600">
                <div className="w-5 h-5">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {icon}
            </Link>
          );
        })}

        <form action={logout}>
          <button className="cursor-pointer w-full bg-white flex items-center gap-3 p-4 text-zinc-700 text-sm font-medium transition-all">
            <LogOut className="w-5 h-5 mr-1 text-red-500" /> Keluar
          </button>
        </form>
      </div>
    </>
  );
}

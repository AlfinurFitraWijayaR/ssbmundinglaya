"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar({
  currentQ,
  currentYear,
  availableYears,
}: {
  currentQ: string;
  currentYear: string;
  availableYears: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(currentQ);
  const [year, setYear] = useState(currentYear);

  const handleSearch = (newQ: string, newYear: string) => {
    const params = new URLSearchParams();
    if (newQ) params.set("q", newQ);
    if (newYear !== "all") params.set("year", newYear);
    startTransition(() => {
      router.push(`/students?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Cari nama...."
          className="w-full pl-10 pr-4 py-1.5"
          value={q ?? ""}
          onChange={(e) => {
            setQ(e.target.value);
            handleSearch(e.target.value, year);
          }}
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Tahun Lahir:
        </span>
        <select
          className="bg-background border border-border rounded-xl px-4 py-1 focus:outline-none focus:ring-2 focus:ring-brand-gold w-full sm:w-auto"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            handleSearch(q, e.target.value);
          }}
        >
          <option value="all">Semua Tahun</option>
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        {isPending && (
          <span className="text-xs text-muted-foreground ml-2">Loading...</span>
        )}
      </div>
    </div>
  );
}

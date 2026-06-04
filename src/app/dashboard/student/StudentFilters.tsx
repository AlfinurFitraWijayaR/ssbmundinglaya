"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function StudentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleYearChange = (year: string | null) => {
    if (!year) return;
    const params = new URLSearchParams(searchParams.toString());
    if (year && year !== "all") {
      params.set("year", year);
    } else {
      params.delete("year");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // Generate years from 2005 to 2020
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => 2007 + i);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
      <div className="relative w-full flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Cari nama siswa..."
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => {
            // Debounce manually or just search on every key
            handleSearch(e.target.value);
          }}
          className="pl-8 bg-white border-gray-200 text-zinc-800 focus-visible:ring-[var(--color-brand-emerald)]"
        />
      </div>
      <div className="w-full sm:w-40">
        <Select
          defaultValue={searchParams.get("year")?.toString() || "all"}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="bg-white border-gray-200 focus:ring-[var(--color-brand-emerald)]">
            <SelectValue placeholder="Tahun Lahir" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

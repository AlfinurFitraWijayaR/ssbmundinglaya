"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type StudentListType = {
  id: string;
  slug: string;
  name: string;
  ku: string;
  avatar: string | null;
  adress: string | null;
  isActive: boolean;
  birthYear: number;
  isOverdue: boolean;
};

export function StudentListClient({
  students,
}: {
  students: StudentListType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesYear =
        yearFilter === "all" || String(student.birthYear) === yearFilter;
      return matchesSearch && matchesYear;
    });
  }, [students, searchQuery, yearFilter]);

  // Generate years from 2005 to 2020
  const years = Array.from({ length: 14 }, (_, i) => 2007 + i);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
        <div className="relative w-full flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Cari nama siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white border-gray-200 text-zinc-800 focus-visible:ring-[var(--color-brand-emerald)]"
          />
        </div>
        <div className="w-full sm:w-40">
          <Select value={yearFilter} onValueChange={(val) => setYearFilter(val || "all")}>
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

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-zinc-600 font-semibold">
                Profil
              </TableHead>
              <TableHead className="text-zinc-600 font-semibold">
                Kelahiran
              </TableHead>
              <TableHead className="text-zinc-600 font-semibold">
                Alamat
              </TableHead>
              <TableHead className="text-right text-zinc-600 font-semibold">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-zinc-500 py-8"
                >
                  {searchQuery || yearFilter !== "all"
                    ? "Tidak ada siswa yang cocok dengan filter pencarian."
                    : "Belum ada siswa yang terdaftar."}
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className={`border-gray-100 hover:bg-gray-50 transition-colors ${
                    student.isOverdue ? "bg-red-50/30" : ""
                  }`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/student/${student.slug}`}
                        className="hover:text-[var(--color-brand-emerald)] transition-colors"
                      >
                        <span className="text-zinc-900 block font-bold">
                          {student.name}
                        </span>
                        {!student.isActive && (
                          <span className="text-xs text-red-500 font-normal">
                            Tidak Aktif
                          </span>
                        )}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600">{student.ku}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-zinc-600 capitalize"
                    >
                      {student.adress || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/student/${student.slug}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-zinc-900"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

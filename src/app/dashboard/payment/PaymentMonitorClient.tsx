"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, Minus, FileSearch } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AdminVerificationTable, { PendingVerification } from "./AdminVerificationTable";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

type ClassOption = {
  id: string;
  className: string;
};

type FeeRecord = {
  studentId: string;
  periodMonth: number;
  periodYear: number;
  status: "paid" | "unpaid";
  sessionId?: string | null;
  sessionDate?: string | null;
};

type StudentRow = {
  id: string;
  fullName: string;
  classId: string;
  className: string;
};

export default function PaymentMonitorClient({
  classList,
  studentList,
  feeList,
  pendingVerifications,
}: {
  classList: ClassOption[];
  studentList: StudentRow[];
  feeList: FeeRecord[];
  pendingVerifications: PendingVerification[];
}) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedFeeType, setSelectedFeeType] = useState<
    "monthly" | "practice"
  >("monthly");
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(currentMonth),
  );

  // Available years: current year and 2 years before
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  // Filter students by class
  const filteredStudents =
    selectedClassId === "all"
      ? studentList
      : studentList.filter((s) => s.classId === selectedClassId);

  // --- Monthly Logic ---
  const feeMap = new Map<string, "paid" | "unpaid">();
  feeList.forEach((fee) => {
    if (!fee.sessionId) {
      const key = `${fee.studentId}-${fee.periodMonth}-${fee.periodYear}`;
      feeMap.set(key, fee.status as "paid" | "unpaid");
    }
  });

  const getMonthlyCellStatus = (
    studentId: string,
    month: number,
  ): "paid" | "unpaid" | "none" => {
    const key = `${studentId}-${month}-${Number(selectedYear)}`;
    return feeMap.get(key) || "none";
  };

  // --- Practice Session Logic ---
  let maxMeetings = 0;
  const studentPracticeMap = new Map<string, string[]>();

  if (selectedFeeType === "practice") {
    const rawMap = new Map<string, { status: string; date: string }[]>();
    feeList.forEach((fee) => {
      if (
        fee.sessionId &&
        fee.periodMonth === Number(selectedMonth) &&
        fee.periodYear === Number(selectedYear) &&
        fee.sessionDate
      ) {
        if (!rawMap.has(fee.studentId)) {
          rawMap.set(fee.studentId, []);
        }
        rawMap.get(fee.studentId)!.push({
          status: fee.status,
          date: fee.sessionDate,
        });
      }
    });

    rawMap.forEach((sessions, studentId) => {
      sessions.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      studentPracticeMap.set(
        studentId,
        sessions.map((s) => s.status),
      );
      if (sessions.length > maxMeetings) {
        maxMeetings = sessions.length;
      }
    });
  }

  // Determine max number of weeks to show (default to 4 weeks = 12 columns)
  const numWeeks = Math.max(4, Math.ceil(maxMeetings / 3));
  const numPracticeColumns = numWeeks * 3;

  // Status visual renderer
  const renderStatus = (status: string) => {
    if (status === "paid") {
      return (
        <div className="mx-auto w-10 h-8 rounded-md bg-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      );
    }
    if (status === "unpaid") {
      return (
        <div className="mx-auto w-10 h-8 rounded-md bg-red-500 flex items-center justify-center">
          <XCircle className="w-4 h-4 text-white" />
        </div>
      );
    }
    return (
      <div className="mx-auto w-10 h-8 rounded-md bg-gray-100 flex items-center justify-center">
        <Minus className="w-4 h-4 text-gray-300" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-800">
          Riwayat & Verifikasi Iuran
        </h1>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-6 rounded-xl border border-slate-200">
          <TabsTrigger value="history" className="rounded-lg px-6">
            Riwayat Pembayaran
          </TabsTrigger>
          <TabsTrigger value="verification" className="rounded-lg px-6 relative">
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4" />
              Menunggu Verifikasi
              {pendingVerifications.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-red-500">
                  {pendingVerifications.length}
                </Badge>
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verification" className="mt-0">
          <AdminVerificationTable data={pendingVerifications} />
        </TabsContent>

        <TabsContent value="history" className="mt-0 space-y-6">
          {/* Filters */}
      <div className="flex flex-col gap-2">
        {/* Tipe Iuran */}
        <div className="flex items-center gap-4">
          <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            Iuran
          </label>
          <Select
            value={selectedFeeType}
            onValueChange={(val) => val && setSelectedFeeType(val as any)}
          >
            <SelectTrigger className="ml-8 w-full max-w-40 bg-white/50 text-gray-900">
              <span className="truncate">
                {selectedFeeType === "monthly" ? "Bulanan" : "Per sesi latihan"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Iuran</SelectLabel>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="practice">Per sesi latihan</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Bulan (Khusus Per Sesi Latihan) */}
        {selectedFeeType === "practice" && (
          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Bulan
            </label>
            <Select
              value={selectedMonth}
              onValueChange={(val) => val && setSelectedMonth(val)}
            >
              <SelectTrigger className="ml-8 w-full max-w-40 bg-white/50 text-gray-900">
                <span className="truncate">
                  {MONTH_NAMES[Number(selectedMonth) - 1]}
                </span>
              </SelectTrigger>
              <SelectContent>
                {MONTH_NAMES.map((m, idx) => (
                  <SelectItem key={m} value={String(idx + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Kelahiran (Kelas) */}
        <div className="flex items-center gap-4">
          <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            Kelahiran
          </label>
          <Select
            value={selectedClassId}
            onValueChange={(val) => val && setSelectedClassId(val)}
          >
            <SelectTrigger className="w-full max-w-40 bg-white/50 text-gray-900">
              <span className="truncate">
                {selectedClassId === "all"
                  ? "Semua Kelas"
                  : classList.find((c) => c.id === selectedClassId)
                      ?.className || "Pilih Kelas"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kelas</SelectLabel>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {classList.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.className}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Tahun */}
        <div className="flex items-center gap-4">
          <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            Tahun
          </label>
          <Select
            value={selectedYear}
            onValueChange={(val) => val && setSelectedYear(val)}
          >
            <SelectTrigger className="ml-8 w-full max-w-40 bg-white/50 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table className="border-collapse">
        {selectedFeeType === "monthly" ? (
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px] text-sm">
                NAMA SISWA
              </TableHead>
              {MONTH_NAMES.map((month) => (
                <TableHead key={month} className="text-center">
                  {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        ) : (
          <TableHeader>
            <TableRow>
              <TableHead
                rowSpan={3}
                className="min-w-[200px] border-r border-b text-zinc-800 bg-gray-50"
              >
                NAMA SISWA
              </TableHead>
              <TableHead
                colSpan={numPracticeColumns}
                className="text-center text-zinc-800 border-b font-bold bg-gray-50 uppercase tracking-widest"
              >
                {MONTH_NAMES[Number(selectedMonth) - 1]}
              </TableHead>
            </TableRow>
            <TableRow>
              {Array.from({ length: numPracticeColumns / 3 }).map(
                (_, weekIdx) => (
                  <TableHead
                    key={weekIdx}
                    colSpan={3}
                    className="text-center border-r border-b font-bold text-zinc-800 bg-gray-50"
                  >
                    {weekIdx + 1}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
        )}

        <TableBody>
          {filteredStudents.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  selectedFeeType === "monthly" ? 14 : numPracticeColumns + 2
                }
                className="text-center text-zinc-500 py-12"
              >
                Tidak ada data siswa untuk filter ini.
              </TableCell>
            </TableRow>
          ) : (
            filteredStudents.map((student, idx) => (
              <TableRow
                key={student.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <TableCell>
                  <div>
                    <span className="text-sm text-zinc-800 uppercase">
                      {student.fullName}
                    </span>
                  </div>
                </TableCell>

                {selectedFeeType === "monthly"
                  ? Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <TableCell key={month} className="text-center">
                        {renderStatus(getMonthlyCellStatus(student.id, month))}
                      </TableCell>
                    ))
                  : Array.from({ length: numPracticeColumns }, (_, i) => {
                      const practices =
                        studentPracticeMap.get(student.id) || [];
                      const status =
                        i < practices.length ? practices[i] : "none";
                      return (
                        <TableCell key={i} className="text-center">
                          {renderStatus(status)}
                        </TableCell>
                      );
                    })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Keterangan */}
      <div className="flex items-center gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span>Lunas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span>Belum Lunas</span>
        </div>
      </div>
      </TabsContent>
      </Tabs>
    </div>
  );
}

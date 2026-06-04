"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveAttendance, StudentAttendanceData } from "@/modules/coach/actions";

type Props = {
  initialYear: string;
  initialStudents: {
    id: string;
    name: string;
    classId: string;
    totalOwedMonths: number;
  }[];
  availableYears: number[];
};

type StudentFormState = Omit<StudentAttendanceData, "status"> & {
  status?: "present" | "permission" | "sick" | "absent";
};

export function AttendanceForm({
  initialYear,
  initialStudents,
  availableYears,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [students, setStudents] = useState<StudentFormState[]>([]);

  useEffect(() => {
    setStudents(
      initialStudents.map((s) => ({
        studentId: s.id,
        classId: s.classId,
        status: undefined,
        feeStatus: "unpaid",
        monthsToPay: 0,
      })),
    );
  }, [initialStudents]);

  const [isSaving, setIsSaving] = useState(false);

  const handleYearChange = (year: string | null) => {
    if (!year) return;
    startTransition(() => {
      if (year === "all") {
        router.push("?");
      } else {
        router.push(`?year=${year}`);
      }
    });
  };

  const updateStatus = (
    studentId: string,
    field: keyof StudentFormState,
    value: string | number,
  ) => {
    setStudents(
      students.map((s) =>
        s.studentId === studentId ? { ...s, [field]: value } : s,
      ),
    );
  };

  const handleSave = async () => {
    const incomplete = students.some((s) => !s.status);
    if (incomplete) {
      toast.error("Mohon lengkapi absensi semua siswa!");
      return;
    }

    setIsSaving(true);

    try {
      const res = await saveAttendance(students as StudentAttendanceData[]);
      if (res.success) {
        toast.success("Kehadiran dan iuran berhasil dicatat!");
        router.push("/coach");
      } else {
        toast.error(res.error || "Gagal menyimpan absensi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <>
      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        {/* filter */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{currentDate}</p>
          <Select value={initialYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-full max-w-40 border-0 shadow-none focus:ring-0 bg-transparent text-gray-900 font-medium">
              <SelectValue placeholder="Tahun Kelahiran" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tahun Kelahiran</SelectLabel>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {isPending ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">
            Memuat data...
          </div>
        ) : initialStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Tidak ada siswa terdaftar{" "}
            {initialYear !== "all" ? `untuk tahun ${initialYear}` : ""}.
          </div>
        ) : (
          initialStudents.map((student) => {
            const studentState = students.find(
              (s) => s.studentId === student.id,
            )!;
            if (!studentState) return null;

            return (
              <Card
                key={student.id}
                className="glass border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 space-y-4 bg-white/50">
                  {/* info siswa */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="border border-gray-200 shadow-sm">
                        <AvatarFallback className="bg-[var(--color-brand-emerald)] text-white">
                          {student.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-gray-900 text-sm capitalize">
                          {student.name}
                        </h3>

                        {student.totalOwedMonths === 0 ? (
                          <div className="flex items-center mt-1 gap-1.5 py-1 bg-emerald-50 rounded-full border border-emerald-100 px-2 w-fit">
                            <span className="text-[10px] font-medium text-[var(--color-brand-emerald)] uppercase tracking-wider">
                              SPP Lunas
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center mt-1 gap-1.5 py-1 bg-red-50 rounded-full border border-red-100 px-2 w-fit">
                            <span className="text-[10px] font-medium text-red-700 uppercase tracking-wider">
                              Bulanan nunggak {student.totalOwedMonths} Bulan
                              (Rp
                              {(student.totalOwedMonths * 25000).toLocaleString(
                                "id-ID",
                              )}
                              )
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    {/* form kehadiran */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-600 font-medium">
                        Kehadiran
                      </label>
                      <div className="flex items-center gap-2">
                        {[
                          {
                            value: "present",
                            label: "Hadir",
                            activeClass:
                              "bg-green-100 text-green-700 border-green-200 ring-1 ring-green-400",
                          },
                          {
                            value: "permission",
                            label: "Izin",
                            activeClass:
                              "bg-blue-100 text-blue-700 border-blue-200 ring-1 ring-blue-400",
                          },
                          {
                            value: "sick",
                            label: "Sakit",
                            activeClass:
                              "bg-yellow-100 text-yellow-700 border-yellow-200 ring-1 ring-yellow-400",
                          },
                          {
                            value: "absent",
                            label: "Alfa",
                            activeClass:
                              "bg-red-100 text-red-700 border-red-200 ring-1 ring-red-400",
                          },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              updateStatus(student.id, "status", opt.value)
                            }
                            className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                              studentState.status === opt.value
                                ? opt.activeClass
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* iuran harian */}
                    {studentState.status === "present" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-600 font-medium">
                          Iuran per Pertemuan
                        </label>
                        <div className="flex items-center gap-2">
                          {[
                            {
                              value: "paid",
                              label: "Lunas (Cash)",
                              activeClass:
                                "bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border-[var(--color-brand-gold)]/30 ring-1 ring-[var(--color-brand-gold)]",
                            },
                            {
                              value: "unpaid",
                              label: "Belum",
                              activeClass:
                                "bg-orange-50 text-orange-600 border-orange-200 ring-1 ring-orange-400",
                            },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                updateStatus(student.id, "feeStatus", opt.value)
                              }
                              className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                                (studentState.feeStatus || "unpaid") ===
                                opt.value
                                  ? opt.activeClass
                                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* iuran bulanan */}
                    {student.totalOwedMonths > 0 &&
                      studentState.status === "present" && (
                        <div className="flex flex-col gap-2 border-t border-gray-100">
                          <label className="text-xs text-gray-600 font-medium">
                            Pelunasan Iuran Bulanan
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const options = [
                                {
                                  value: 0,
                                  label: "Belum",
                                  activeClass:
                                    "bg-red-50 text-red-600 border-red-200 ring-1 ring-red-400",
                                },
                              ];

                              if (student.totalOwedMonths === 1) {
                                options.push({
                                  value: 1,
                                  label: "Lunas (Rp25.000)",
                                  activeClass:
                                    "bg-[var(--color-brand-emerald)]/10 text-[var(--color-brand-emerald)] border-[var(--color-brand-emerald)]/30 ring-1 ring-[var(--color-brand-emerald)]",
                                });
                              } else {
                                options.push({
                                  value: 1,
                                  label: "Bayar 1 Bln",
                                  activeClass:
                                    "bg-blue-50 text-blue-600 border-blue-200 ring-1 ring-blue-400",
                                });

                                if (student.totalOwedMonths > 2) {
                                  options.push({
                                    value: 2,
                                    label: "Bayar 2 Bln",
                                    activeClass:
                                      "bg-blue-50 text-blue-600 border-blue-200 ring-1 ring-blue-400",
                                  });
                                }

                                options.push({
                                  value: student.totalOwedMonths,
                                  label: `Lunas (${student.totalOwedMonths} Bln)`,
                                  activeClass:
                                    "bg-[var(--color-brand-emerald)]/10 text-[var(--color-brand-emerald)] border-[var(--color-brand-emerald)]/30 ring-1 ring-[var(--color-brand-emerald)]",
                                });
                              }

                              return options.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      student.id,
                                      "monthsToPay",
                                      opt.value,
                                    )
                                  }
                                  className={`flex-1 min-w-[80px] py-2 px-1 text-[10px] font-semibold rounded-lg border transition-all ${
                                    (studentState.monthsToPay || 0) ===
                                    opt.value
                                      ? opt.activeClass
                                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ));
                            })()}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* button submit */}
      {initialStudents.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl mx-auto">
            <Button
              className="cursor-pointer w-full h-9 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/90 text-xs"
              onClick={handleSave}
              disabled={isSaving || isPending}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Simpan Absensi
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

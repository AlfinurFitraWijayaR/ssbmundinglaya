"use client";

import { ArrowLeft, Printer, Activity, Trophy, Medal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

// Dummy Data
const studentProfile = {
  name: "Alfin",
  class: "U-12",
  position: "Gelandang Serang (AMF)",
  coachName: "Coach Budi",
  attendance: {
    present: 24,
    permission: 2,
    sick: 1,
    absent: 0,
    total: 27,
  },
};

const skills = [
  { name: "Passing / Umpan", score: 85, color: "bg-blue-500" },
  { name: "Shooting / Tembakan", score: 75, color: "bg-red-500" },
  { name: "Dribbling / Menggiring", score: 88, color: "bg-emerald-500" },
  { name: "Pace / Kecepatan", score: 82, color: "bg-yellow-500" },
  { name: "Stamina", score: 70, color: "bg-purple-500" },
  { name: "Defending / Bertahan", score: 65, color: "bg-slate-500" },
  { name: "Mental / Visi", score: 80, color: "bg-[var(--color-brand-gold)]" },
];

export default function StudentReportPage() {
  const handlePrint = () => {
    window.print();
  };

  const attendanceRate = Math.round(
    (studentProfile.attendance.present / studentProfile.attendance.total) * 100,
  );

  return (
    <p>Proses Maintenance</p>
    // <div className="min-h-screen bg-[#F8FAFC] pb-24 print:bg-white print:pb-0">
    //   {/* Header - Hide on print */}
    //   <div className="bg-white border-b border-gray-200 sticky top-0 z-10 print:hidden">
    //     <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
    //       <div className="flex items-center gap-3">
    //         <Link
    //           href="/student"
    //           className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
    //         >
    //           <ArrowLeft className="w-5 h-5" />
    //         </Link>
    //         <h1 className="font-bold text-lg text-gray-900">Rapor Evaluasi Siswa</h1>
    //       </div>
    //       <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
    //         <Printer className="w-4 h-4" /> Export PDF
    //       </Button>
    //     </div>
    //   </div>

    //   <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 print:mt-0">

    //     {/* Print Header */}
    //     <div className="hidden print:block text-center mb-8 border-b-2 border-gray-900 pb-4 mt-8">
    //       <h1 className="text-2xl font-bold uppercase tracking-wider">Rapor Evaluasi Siswa</h1>
    //       <p className="text-lg text-gray-600 mt-1">SSB Mundinglaya</p>
    //       <p className="text-sm text-gray-500 mt-2">Periode: {dayjs().format("MMMM YYYY")}</p>
    //     </div>

    //     {/* Profile Card */}
    //     <Card className="mb-6 border-slate-200 shadow-sm print:shadow-none print:border-gray-300">
    //       <CardContent className="p-6">
    //         <div className="flex items-center gap-6">
    //           <Avatar className="w-20 h-20 border-4 border-gray-100 shadow-sm print:hidden">
    //             <AvatarImage src={`https://ui-avatars.com/api/?name=${studentProfile.name}&background=025C3B&color=fff`} />
    //             <AvatarFallback>A</AvatarFallback>
    //           </Avatar>
    //           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
    //             <div>
    //               <p className="text-sm text-gray-500 font-medium">Nama Siswa</p>
    //               <p className="font-bold text-lg">{studentProfile.name}</p>
    //             </div>
    //             <div>
    //               <p className="text-sm text-gray-500 font-medium">Kelas / Kelompok Umur</p>
    //               <p className="font-bold text-lg">{studentProfile.class}</p>
    //             </div>
    //             <div>
    //               <p className="text-sm text-gray-500 font-medium">Posisi Utama</p>
    //               <p className="font-semibold text-gray-900">{studentProfile.position}</p>
    //             </div>
    //             <div>
    //               <p className="text-sm text-gray-500 font-medium">Pelatih Utama</p>
    //               <p className="font-semibold text-gray-900">{studentProfile.coachName}</p>
    //             </div>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     {/* 2 Column Layout for large screens */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    //       {/* Kehadiran */}
    //       <div className="space-y-6">
    //         <Card className="border-slate-200 shadow-sm print:shadow-none print:border-gray-300">
    //           <CardHeader className="pb-3 border-b border-gray-100">
    //             <CardTitle className="text-lg flex items-center gap-2">
    //               <Activity className="w-5 h-5 text-blue-500" />
    //               Statistik Kehadiran
    //             </CardTitle>
    //           </CardHeader>
    //           <CardContent className="p-6">
    //             <div className="flex items-center justify-between mb-6">
    //               <div>
    //                 <p className="text-sm text-gray-500">Tingkat Kehadiran</p>
    //                 <p className="text-3xl font-bold text-[var(--color-brand-emerald)]">{attendanceRate}%</p>
    //               </div>
    //               <div className="text-right">
    //                 <p className="text-sm text-gray-500">Total Sesi</p>
    //                 <p className="text-xl font-bold">{studentProfile.attendance.total}</p>
    //               </div>
    //             </div>

    //             <div className="grid grid-cols-4 gap-2 text-center">
    //               <div className="bg-emerald-50 rounded-lg p-2 print:border print:border-emerald-200 print:bg-transparent">
    //                 <p className="text-2xl font-bold text-emerald-600">{studentProfile.attendance.present}</p>
    //                 <p className="text-xs text-emerald-600 font-medium mt-1 uppercase">Hadir</p>
    //               </div>
    //               <div className="bg-blue-50 rounded-lg p-2 print:border print:border-blue-200 print:bg-transparent">
    //                 <p className="text-2xl font-bold text-blue-600">{studentProfile.attendance.permission}</p>
    //                 <p className="text-xs text-blue-600 font-medium mt-1 uppercase">Izin</p>
    //               </div>
    //               <div className="bg-yellow-50 rounded-lg p-2 print:border print:border-yellow-200 print:bg-transparent">
    //                 <p className="text-2xl font-bold text-yellow-600">{studentProfile.attendance.sick}</p>
    //                 <p className="text-xs text-yellow-600 font-medium mt-1 uppercase">Sakit</p>
    //               </div>
    //               <div className="bg-red-50 rounded-lg p-2 print:border print:border-red-200 print:bg-transparent">
    //                 <p className="text-2xl font-bold text-red-600">{studentProfile.attendance.absent}</p>
    //                 <p className="text-xs text-red-600 font-medium mt-1 uppercase">Alfa</p>
    //               </div>
    //             </div>
    //           </CardContent>
    //         </Card>

    //         <Card className="border-slate-200 shadow-sm print:shadow-none print:border-gray-300">
    //           <CardHeader className="pb-3 border-b border-gray-100">
    //             <CardTitle className="text-lg flex items-center gap-2">
    //               <Medal className="w-5 h-5 text-yellow-500" />
    //               Catatan Pelatih
    //             </CardTitle>
    //           </CardHeader>
    //           <CardContent className="p-6">
    //             <p className="text-gray-700 italic leading-relaxed text-sm">
    //               "Alfin menunjukkan perkembangan yang sangat signifikan dalam hal visi bermain dan kualitas passing. Dia mampu menjadi pengatur serangan yang baik. Namun, stamina dan fisik saat membantu pertahanan masih perlu banyak dilatih agar lebih stabil bermain full time."
    //             </p>
    //             <div className="mt-6 text-right hidden print:block">
    //               <p className="text-gray-900 font-semibold mb-16">{studentProfile.coachName}</p>
    //               <div className="w-40 border-b border-gray-400 ml-auto"></div>
    //               <p className="text-sm text-gray-500 mt-1">Tanda Tangan Pelatih</p>
    //             </div>
    //           </CardContent>
    //         </Card>
    //       </div>

    //       {/* Skor Kemampuan */}
    //       <Card className="border-slate-200 shadow-sm print:shadow-none print:border-gray-300">
    //         <CardHeader className="pb-3 border-b border-gray-100">
    //           <CardTitle className="text-lg flex items-center gap-2">
    //             <Trophy className="w-5 h-5 text-[var(--color-brand-gold)]" />
    //             Penilaian Skill
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent className="p-6 space-y-6">
    //           {skills.map((skill, index) => (
    //             <div key={index}>
    //               <div className="flex justify-between items-end mb-2">
    //                 <span className="text-sm font-semibold text-gray-700">{skill.name}</span>
    //                 <span className="text-sm font-bold">{skill.score} <span className="text-xs text-gray-400 font-normal">/100</span></span>
    //               </div>
    //               <div className="w-full bg-gray-100 rounded-full h-2.5 print:border print:border-gray-300 print:bg-white overflow-hidden">
    //                 <div
    //                   className={`h-2.5 rounded-full ${skill.color} print:!bg-gray-700`}
    //                   style={{ width: `${skill.score}%` }}
    //                 ></div>
    //               </div>
    //             </div>
    //           ))}
    //         </CardContent>
    //       </Card>

    //     </div>
    //   </div>
    // </div>
  );
}

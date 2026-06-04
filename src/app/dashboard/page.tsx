import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/modules/shared/db";
import { students, routineFees } from "@/modules/shared/schema";
import { eq, and, lt, count, sql } from "drizzle-orm";
import MonthlyFeeChart from "./MonthlyFeeChart";
import StudentDemographicChart from "./StudentDemographicChart";
import dayjs from "dayjs";
import "dayjs/locale/id";
import Link from "next/link";

dayjs.locale("id");

export default async function DashboardPage() {
  const todayStr = dayjs().format("YYYY-MM-DD");

  // Fetch Total Active Students
  const [studentsResult] = await db
    .select({ total: count() })
    .from(students)
    .where(eq(students.isActive, true));

  const totalStudents = studentsResult?.total || 0;

  // Fetch Overdue Count
  const [overdueCountResult] = await db
    .select({ total: count() })
    .from(routineFees)
    .where(
      and(eq(routineFees.status, "unpaid"), lt(routineFees.dueDate, todayStr)),
    );

  const totalOverdue = overdueCountResult?.total || 0;

  const summary = [
    {
      title: "Total Siswa",
      value: `${totalStudents} Siswa`,
    },
    {
      title: "Iuran Menunggak",
      value: `${totalOverdue} Siswa`,
    },
  ];

  // Fetch Monthly Fees (paid)
  const monthlyFeesResult = await db
    .select({
      month: routineFees.periodMonth,
      year: routineFees.periodYear,
      totalAmount: sql<number>`sum(CAST(${routineFees.amount} AS DECIMAL))`,
    })
    .from(routineFees)
    .where(eq(routineFees.status, "paid"))
    .groupBy(routineFees.periodYear, routineFees.periodMonth)
    .orderBy(routineFees.periodYear, routineFees.periodMonth);

  const monthlyFeeData = monthlyFeesResult.map((row) => {
    // Convert month number to month name
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ags",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const mName = row.month ? monthNames[row.month - 1] : "";
    return {
      month: `${mName} ${row.year}`,
      amount: Number(row.totalAmount),
    };
  });

  // Fetch Student Demographics (by birthYear)
  const studentDemoResult = await db
    .select({
      year: sql<number>`EXTRACT(YEAR FROM ${students.birthDate})`,
      count: count(),
    })
    .from(students)
    .where(eq(students.isActive, true))
    .groupBy(sql`EXTRACT(YEAR FROM ${students.birthDate})`)
    .orderBy(sql`EXTRACT(YEAR FROM ${students.birthDate})`);

  const studentDemoData = studentDemoResult
    .map((row) => ({
      year: String(row.year),
      count: Number(row.count),
    }))
    .filter((r) => r.year !== "null");

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-800">
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Card */}
        <Card className="glass border-gray-200 shadow-sm flex ">
          <CardHeader>
            <CardTitle className="text-md font-semibold text-zinc-800">
              Ringkasan Singkat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col align-center gap-2">
              {summary.map((item, index) => (
                <div key={index} className="flex align-center">
                  <div className="w-35">
                    <p className="text-sm text-zinc-500">{item.title}</p>
                  </div>
                  <div className="text-sm font-semibold text-zinc-800">
                    {item.value}
                  </div>
                </div>
              ))}
              <Link
                href="/coach"
                className="text-xs text-blue-500 underline cursor-pointer hover:text-zinc-800"
              >
                <p>Masuk ke halaman Coach</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Monthly Fee Area Chart */}
        <Card className="glass border-gray-200 lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-800">
              Grafik Arus Kas (SPP)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pb-6 px-2">
            {monthlyFeeData.length > 0 ? (
              <MonthlyFeeChart data={monthlyFeeData} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-400 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 mx-4">
                Belum ada data pembayaran
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Demographics Bar Chart */}
        <Card className="glass border-gray-200 lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-zinc-800">
              Siswa per Tahun Kelahiran
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pb-6 px-2">
            {studentDemoData.length > 0 ? (
              <StudentDemographicChart data={studentDemoData} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-400 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 mx-4">
                Belum ada data siswa
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

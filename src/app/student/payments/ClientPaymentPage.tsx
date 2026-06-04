"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PaymentCard } from "./PaymentCard";
import { KwitansiPayment } from "./KwitansiPayment";

export type Fee = {
  id: string;
  amount: string;
  status: "paid" | "unpaid";
  dueDate: string;
  paidAt: string | null;
  periodMonth: number | null;
  periodYear: number | null;
  sessionId: string | null;
  paymentMethod: string | null;
  evidenceUrl: string | null;
};

export default function ClientPaymentPage({
  fees,
  studentName,
  studentClass,
}: {
  fees: Fee[];
  studentName: string;
  studentClass: string;
}) {
  const [selectedPrintId, setSelectedPrintId] = useState<string | null>(null);

  useEffect(() => {
    const afterPrint = () => setSelectedPrintId(null);
    window.addEventListener("afterprint", afterPrint);
    return () => window.removeEventListener("afterprint", afterPrint);
  }, []);

  const handlePrintReceipt = (id: string) => {
    setSelectedPrintId(id);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const dailyFees = fees.filter((f) => f.sessionId);
  const monthlyFees = fees.filter((f) => !f.sessionId);
  const selectedPayment = fees.find((f) => f.id === selectedPrintId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 print:bg-white print:pb-0">
      {/* Normal Content - hide during specific receipt print */}
      <div className={selectedPrintId ? "print:hidden" : ""}>
        {/* Header - Hide on print */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 print:hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/student">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </Button>
              </Link>
              <h1 className="font-semibold text-zinc-800">Pembayaran Iuran</h1>
            </div>
          </div>
        </div>

        {/* Print Header - Show only on print (when printing all history, although button removed, fallback) */}
        <div className="hidden print:block text-center mb-8 border-b-2 border-gray-900 pb-4 mt-8">
          <h1 className="text-2xl font-bold uppercase tracking-wider">
            Laporan Pembayaran Siswa
          </h1>
          <p className="text-lg text-gray-600 mt-1">SSB Mundinglaya</p>
          <p className="font-semibold mt-4">Nama Siswa: {studentName}</p>
          <p className="text-sm text-gray-500">
            Dicetak pada: {dayjs().format("DD MMMM YYYY")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
          <Tabs defaultValue="bulanan" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 print:hidden bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="bulanan" className="rounded-lg">
                Iuran Bulanan
              </TabsTrigger>
              <TabsTrigger value="harian" className="rounded-lg">
                Iuran Harian
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bulanan" className="space-y-4 print:block">
              <div className="hidden print:block mb-4">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                  Riwayat Iuran Bulanan
                </h2>
              </div>
              {monthlyFees.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300 print:border-none">
                  <p className="text-gray-500">
                    Belum ada riwayat iuran bulanan.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {monthlyFees.map((payment) => (
                    <PaymentCard
                      key={payment.id}
                      payment={payment}
                      handlePrintReceipt={handlePrintReceipt}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="harian" className="space-y-4 print:block">
              <div className="hidden print:block mb-4 mt-8">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                  Riwayat Iuran Sesi Latihan
                </h2>
              </div>
              {dailyFees.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300 print:border-none">
                  <p className="text-gray-500">
                    Belum ada riwayat iuran harian.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {dailyFees.map((payment) => (
                    <PaymentCard
                      key={payment.id}
                      payment={payment}
                      handlePrintReceipt={handlePrintReceipt}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Specific Receipt Print View */}
      {selectedPrintId && selectedPayment && (
        <KwitansiPayment
          selectedPayment={selectedPayment}
          studentName={studentName}
          studentClass={studentClass}
        />
      )}
    </div>
  );
}

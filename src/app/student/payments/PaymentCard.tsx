import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Printer, CreditCard, Clock } from "lucide-react";
import dayjs from "dayjs";
import { Fee } from "./ClientPaymentPage";
import { useState } from "react";
import { UploadPaymentDialog } from "./UploadPaymentDialog";

export const PaymentCard = ({
  payment,
  handlePrintReceipt,
}: {
  payment: Fee;
  handlePrintReceipt: (id: string) => void;
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const isPaid = payment.status === "paid";
  const isLate = !isPaid && new Date(payment.dueDate) < new Date();
  const isWaitingVerification = !isPaid && !!payment.evidenceUrl;

  let title = "";
  if (payment.sessionId) {
    title = "Iuran Sesi Latihan";
  } else if (payment.periodMonth) {
    const monthName = dayjs()
      .month(payment.periodMonth - 1)
      .format("MMMM");
    title = `Iuran Bulanan ${monthName} ${payment.periodYear}`;
  }

  return (
    <Card
      className={`bg-white border-slate-100 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow ${
        !isPaid ? "border-red-100" : ""
      } break-inside-avoid`}
    >
      <div
        className={`absolute top-0 left-0 w-1 h-full ${
          isPaid ? "bg-[var(--color-brand-emerald)]" : "bg-red-500"
        }`}
      />
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-md text-zinc-900">{title}</p>
            <p className="text-sm text-zinc-600">
              Rp {Number(payment.amount).toLocaleString("id-ID")}
            </p>
          </div>
          {isPaid ? (
            <Badge className="bg-[var(--color-brand-emerald)] text-white hover:bg-[var(--color-brand-emerald)]/90 print:bg-emerald-600">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Lunas
            </Badge>
          ) : isWaitingVerification ? (
            <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 print:bg-yellow-500 print:text-white">
              <Clock className="w-3 h-3 mr-1" /> Menunggu Verifikasi
            </Badge>
          ) : (
            <Badge
              variant="destructive"
              className="bg-red-500 text-white hover:bg-red-600 print:bg-red-600 print:text-white"
            >
              <AlertCircle className="w-3 h-3 mr-1" />{" "}
              {isLate ? "Terlambat" : "Belum Lunas"}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {isPaid
              ? `Dibayar pada ${
                  payment.paidAt
                    ? dayjs(payment.paidAt).format("DD MMM YYYY")
                    : "-"
                }`
              : `Jatuh tempo: ${dayjs(payment.dueDate).format("DD MMM YYYY")}`}
          </span>
          {isPaid && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-xs h-7 print:hidden gap-1 text-[var(--color-brand-emerald)] border-[var(--color-brand-emerald)] hover:bg-emerald-50"
              onClick={() => handlePrintReceipt(payment.id)}
            >
              <Printer className="w-3 h-3" /> Kuitansi
            </Button>
          )}
          {!isPaid && !isWaitingVerification && (
            <Button
              size="sm"
              className="cursor-pointer text-xs h-7 print:hidden gap-1 bg-zinc-900 text-white hover:bg-zinc-800"
              onClick={() => setIsUploadOpen(true)}
            >
              <CreditCard className="w-3 h-3" /> Bayar Sekarang
            </Button>
          )}
        </div>
      </CardContent>

      <UploadPaymentDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        payment={payment}
      />
    </Card>
  );
};

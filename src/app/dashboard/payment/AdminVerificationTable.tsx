"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  approvePayment,
  rejectPayment,
} from "@/modules/dashboard/paymentActions";
import dayjs from "dayjs";

export type PendingVerification = {
  id: string;
  amount: string;
  periodMonth: number | null;
  periodYear: number | null;
  sessionId: string | null;
  evidenceUrl: string | null;
  studentId: string;
  studentName: string;
  className: string;
};

export default function AdminVerificationTable({
  data,
}: {
  data: PendingVerification[];
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getPublicUrl = (path: string | null) => {
    if (!path) return "";
    return `${process.env.NEXT_PUBLIC_BASE_CDN_URL}/${path}`;
  };

  const handleApprove = async (feeId: string) => {
    setLoadingId(feeId);
    try {
      const res = await approvePayment(feeId);
      if (res.success) {
        toast.success("Pembayaran berhasil diverifikasi!");
        window.location.reload();
      } else {
        toast.error(res.error || "Gagal menyetujui pembayaran.");
      }
    } catch (err: any) {
      toast.error(err.message || "Kesalahan server.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (feeId: string) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menolak dan menghapus bukti transfer ini?",
      )
    )
      return;

    setLoadingId(feeId);
    try {
      const res = await rejectPayment(feeId);
      if (res.success) {
        toast.success("Pembayaran ditolak. Bukti dihapus.");
        window.location.reload();
      } else {
        toast.error(res.error || "Gagal menolak pembayaran.");
      }
    } catch (err: any) {
      toast.error(err.message || "Kesalahan server.");
    } finally {
      setLoadingId(null);
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-200 rounded-xl">
        <Check className="w-12 h-12 text-gray-300 mb-2" />
        <p className="text-gray-500 font-medium">
          Tidak ada pembayaran yang perlu diverifikasi.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Nama Siswa</TableHead>
            <TableHead>Kelas</TableHead>
            <TableHead>Jenis Iuran</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead className="text-center">Bukti Transfer</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            let iuranLabel = "";
            if (item.sessionId) {
              iuranLabel = "Sesi Latihan";
            } else if (item.periodMonth) {
              const monthName = dayjs()
                .month(item.periodMonth - 1)
                .format("MMMM");
              iuranLabel = `Bulanan - ${monthName} ${item.periodYear}`;
            }

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-zinc-900">
                  {item.studentName}
                </TableCell>
                <TableCell>{item.className}</TableCell>
                <TableCell>{iuranLabel}</TableCell>
                <TableCell>
                  Rp {Number(item.amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() =>
                      setSelectedImage(getPublicUrl(item.evidenceUrl))
                    }
                  >
                    <Eye className="w-4 h-4" /> Lihat Bukti
                  </Button>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white"
                    disabled={loadingId === item.id}
                    onClick={() => handleApprove(item.id)}
                  >
                    {loadingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-1" />
                    )}
                    Setujui
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8"
                    disabled={loadingId === item.id}
                    onClick={() => handleReject(item.id)}
                  >
                    {loadingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4 mr-1" />
                    )}
                    Tolak
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="sm:max-w-xl border-0 shadow-2xl p-0 overflow-hidden bg-black/95">
          <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Bukti Transfer"
                className="max-w-full max-h-full object-contain rounded-md"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

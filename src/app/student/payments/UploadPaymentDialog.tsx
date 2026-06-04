"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, FileImage } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { createClient } from "@supabase/supabase-js";
import { submitPaymentEvidence } from "@/modules/student/paymentActions";
import { Fee } from "./ClientPaymentPage";

// Make sure these match your actual env vars if they are exposed to NEXT_PUBLIC
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function UploadPaymentDialog({
  open,
  onOpenChange,
  payment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Fee | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreview(null);
      return;
    }
    const selectedFile = e.target.files[0];

    // Quick preview before compression
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !payment) {
      toast.error("Pilih file bukti transfer terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Compress Image
      const options = {
        maxSizeMB: 0.1, // 100 KB
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp",
      };

      const compressedFile = await imageCompression(file, options);

      // 2. Upload to Supabase Storage
      // Gunakan bucket "public" dengan folder "payment-evidences"
      // Sesuai konfirmasi untuk memakai bucket yang sudah ada
      const fileName = `payment-evidences/${payment.id}_${Date.now()}.webp`;

      const { data, error: uploadError } = await supabase.storage
        .from("public")
        .upload(fileName, compressedFile, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Gagal upload: ${uploadError.message}`);
      }

      // 3. Simpan ke database via Server Action
      // data.path akan berisi 'payment-evidences/xxx.webp'
      const res = await submitPaymentEvidence(payment.id, data.path);
      if (res.success) {
        toast.success("Bukti pembayaran berhasil diunggah!");
        onOpenChange(false);
        // Page akan di-refresh atau state direload setelah action sukses
        window.location.reload();
      } else {
        throw new Error(res.error || "Gagal menyimpan ke database");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat mengunggah.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 bg-white shadow-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Silakan transfer tagihan sebesar{" "}
            <strong className="text-zinc-600">
              Rp {payment ? Number(payment.amount).toLocaleString("id-ID") : 0}
            </strong>{" "}
            ke rekening ini:
          </DialogDescription>
        </DialogHeader>

        {/* Info Rekening Hardcoded (Placeholder) */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col gap-1 mb-2">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
            Bank BCA
          </p>
          <p className="text-lg font-mono font-bold text-zinc-900">
            123 456 7890
          </p>
          <p className="text-sm font-medium text-zinc-600">
            a/n SSB Mundinglaya
          </p>
        </div>

        <div className="flex flex-col gap-4 py-2">
          <label
            htmlFor="evidence-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {preview ? (
              <div className="relative w-full h-full p-2 flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-1 text-sm text-gray-500">
                  <span className="font-semibold">Unggah bukti pembayaran</span>
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG (Max 5MB)
                </p>
              </div>
            )}
            <input
              id="evidence-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <div className="flex items-center gap-2 text-sm text-zinc-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <FileImage className="w-4 h-4 text-emerald-500" />
              <span className="truncate max-w-[200px]">{file.name}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
            className="rounded-full"
          >
            Batal
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="bg-[var(--color-brand-emerald)] hover:bg-[var(--color-brand-emerald)]/90 text-white rounded-full px-6"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengunggah...
              </>
            ) : (
              "Kirim Bukti"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

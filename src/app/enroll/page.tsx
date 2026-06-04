"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, UploadCloud } from "lucide-react";
import Link from "next/link";
import { compressProfileImage } from "@/lib/image-utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { enrollStudentOnline } from "@/modules/student/actions";

export default function EnrollPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [kkPreview, setKkPreview] = useState<string | null>(null);
  const [compressedKkFile, setCompressedKkFile] = useState<File | null>(null);
  const [aktePreview, setAktePreview] = useState<string | null>(null);
  const [compressedAkteFile, setCompressedAkteFile] = useState<File | null>(
    null,
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      try {
        const compressed = await compressProfileImage(file);
        setCompressedFile(compressed);
        toast.success("Foto profil berhasil dikompresi (~100KB WebP)");
      } catch (error) {
        toast.error("Gagal mengkompresi gambar");
      }
    }
  };

  const handleKkChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKkPreview(URL.createObjectURL(file));
      try {
        const compressed = await compressProfileImage(file);
        setCompressedKkFile(compressed);
        toast.success("Foto Kartu Keluarga berhasil dikompresi");
      } catch (error) {
        toast.error("Gagal mengkompresi gambar KK");
      }
    }
  };

  const handleAkteChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAktePreview(URL.createObjectURL(file));
      try {
        const compressed = await compressProfileImage(file);
        setCompressedAkteFile(compressed);
        toast.success("Foto Akte Kelahiran berhasil dikompresi");
      } catch (error) {
        toast.error("Gagal mengkompresi gambar Akte");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (compressedFile) formData.set("avatarFile", compressedFile);
    if (compressedKkFile) formData.set("kkFile", compressedKkFile);
    if (compressedAkteFile) formData.set("akteFile", compressedAkteFile);

    try {
      const result = await enrollStudentOnline(formData);

      if (result.success) {
        toast.success(
          "Data siswa berhasil didaftarkan! Silakan tunggu pesan dari kami.",
        );
        // Redirect to a success page or back to home
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(result.error || "Gagal mendaftar");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center">
            <Image src="logossb.svg" alt="logo" width={50} height={50} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Form Daftar Online
          </h1>
          <p className="text-md text-zinc-500 mt-2">
            Daftar online dengan mudah dan cepat. Setelah selesai mengisi form
            pendaftaran online, admin akan memproses data anda untuk ngecek
            administrasi dan akan segera menghubungi anda. Lets try it!!
          </p>
        </div>

        <Card className="bg-white border-gray-200 shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <label
                htmlFor="avatar"
                className="cursor-pointer flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[var(--color-brand-gold)] transition-colors bg-gray-50/50"
              >
                {avatarPreview ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-brand-gold)]">
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                )}
                <div className="text-center">
                  <span className="text-xs font-medium text-[var(--color-brand-gold)] hover:underline">
                    Unggah Foto Setengah Badan (Maks 2MB)
                  </span>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </label>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-zinc-700">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="cth: Mark Antony Klok"
                    // required
                    className="bg-white border-gray-200 text-zinc-900 focus-visible:ring-[var(--color-brand-gold)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-zinc-700">
                    Nama Panggilan
                  </Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    placeholder="cth: Klok"
                    className="bg-white border-gray-200 text-zinc-900 focus-visible:ring-[var(--color-brand-gold)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="text-zinc-700">
                    Tempat Lahir
                  </Label>
                  <Input
                    id="birthPlace"
                    name="birthPlace"
                    type="text"
                    placeholder="cth: Majalengka"
                    // required
                    className="bg-white border-gray-200 text-zinc-900 focus-visible:ring-[var(--color-brand-gold)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-zinc-700">
                    Tanggal Lahir
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    // required
                    className="bg-white border-gray-200 text-zinc-900 focus-visible:ring-[var(--color-brand-gold)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-zinc-700">
                    Alamat Rumah
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="cth: Blok Calingcing, Sukasari Kidul"
                    className="bg-white border-gray-200 text-zinc-900 focus-visible:ring-[var(--color-brand-gold)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-zinc-700">
                    Nomor WhatsApp
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="cth: 08120000000"
                    className="bg-white border-gray-200 text-zinc-900 focus-visible:ring-[var(--color-brand-gold)]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="position" className="text-zinc-700">
                    Posisi Bermain (Opsional)
                  </Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="cth: Bek Kanan, Kiper, Striker..."
                    className="bg-white border-gray-200 text-zinc-900 focus-visible:ring-[var(--color-brand-gold)]"
                  />
                </div>
              </div>

              {/* KK and Akte Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* KK Upload */}
                <label
                  htmlFor="kk"
                  className="cursor-pointer flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[var(--color-brand-gold)] transition-colors bg-gray-50/50"
                >
                  {kkPreview ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-[var(--color-brand-gold)]">
                      <img
                        src={kkPreview}
                        alt="KK Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                  )}
                  <div className="text-center">
                    <span className="text-xs font-medium text-[var(--color-brand-gold)] hover:underline">
                      Unggah Foto Kartu Keluarga (KK)
                    </span>
                    <Input
                      id="kk"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleKkChange}
                    />
                  </div>
                </label>

                {/* Akte Upload */}
                <label
                  htmlFor="akte"
                  className="cursor-pointer flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[var(--color-brand-gold)] transition-colors bg-gray-50/50"
                >
                  {aktePreview ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-[var(--color-brand-gold)]">
                      <img
                        src={aktePreview}
                        alt="Akte Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                  )}
                  <div className="text-center">
                    <span className="text-xs font-medium text-[var(--color-brand-gold)] hover:underline">
                      Unggah Foto Akte Kelahiran
                    </span>
                    <Input
                      id="akte"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAkteChange}
                    />
                  </div>
                </label>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100 pt-6 mt-4 flex justify-between items-center">
              <Link
                href="/dashboard"
                className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Nanti Saja
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[var(--color-brand-gold)] text-white hover:bg-[var(--color-brand-gold)]/90"
              >
                {isSubmitting ? "Menyimpan..." : "Daftar Sekarang"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

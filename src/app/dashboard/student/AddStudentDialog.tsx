"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { addStudent } from "@/modules/student/actions";
import imageCompression from "browser-image-compression";
import Image from "next/image";

export function AddStudentDialog({
  classes,
}: {
  classes: { id: string; className: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar.");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (selectedImage) {
        toast.info("Mengkompresi gambar...");
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: "image/webp" as const,
        };
        const compressedBlob = await imageCompression(selectedImage, options);
        const compressedFile = new File([compressedBlob], "avatar.webp", {
          type: "image/webp",
        });
        formData.append("avatarFile", compressedFile);
      }
      const res = await addStudent(formData);
      if (res.success) {
        toast.success("Siswa berhasil ditambahkan!");
        setIsOpen(false);
        removeImage();
      } else {
        toast.error(res.error || "Gagal menambahkan siswa.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[var(--color-brand-emerald)] text-white hover:bg-[var(--color-brand-emerald)]/90" />
        }
      >
        <Plus className="w-4 h-4 mr-2" /> Tambah Siswa
      </DialogTrigger>
      <DialogContent className="glass border-gray-200 text-zinc-900 sm:max-w-md bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Siswa Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="space-y-2">
              <Label>Foto Profil</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
                <div className="text-xs text-zinc-500">
                  <p>Format: JPG, PNG, WEBP</p>
                  <p>Maks. ukuran 1MB</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input
                name="fullName"
                required
                placeholder="Contoh: Bima Sakti"
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Nomor Telepon (Opsional)</Label>
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="Contoh: 08123456789"
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Kelahiran</Label>
              <Select name="classId" required>
                <SelectTrigger className="bg-white border-gray-300 focus:ring-[var(--color-brand-emerald)]">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tanggal Lahir</Label>
              <Input
                name="birthDate"
                type="date"
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Alamat Rumah</Label>
              <Input
                name="address"
                placeholder="Contoh: Jl. Merdeka No. 1"
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Posisi Bermain (Opsional)</Label>
              <Input
                name="position"
                placeholder="Contoh: Sayap Kanan, Kiper, CF..."
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[var(--color-brand-emerald)] text-white hover:bg-[var(--color-brand-emerald)]/90"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

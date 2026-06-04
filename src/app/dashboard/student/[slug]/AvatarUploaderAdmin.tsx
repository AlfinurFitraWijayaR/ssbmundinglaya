"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { updateStudentAvatarAdmin } from "@/modules/student/actions";

export function AvatarUploaderAdmin({
  student,
}: {
  student: { id: string; slug: string; name: string; avatar: string | null };
}) {
  const [isPending, setIsPending] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }

    setIsPending(true);
    toast.info("Mengkompresi gambar...");

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp" as const,
      };
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], "avatar.webp", {
        type: "image/webp",
      });

      const formData = new FormData();
      formData.append("studentId", student.id);
      formData.append("slug", student.slug);
      formData.append("avatarFile", compressedFile);

      toast.info("Mengunggah gambar...");
      const res = await updateStudentAvatarAdmin(formData);

      if (res.success) {
        toast.success("Foto profil berhasil diperbarui!");
      } else {
        toast.error(res.error || "Gagal memperbarui foto profil.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative group rounded-full overflow-hidden">
      <Avatar
        className={`h-32 w-32 border-4 border-[var(--color-brand-gold)] shadow-md transition-opacity ${
          isPending ? "opacity-50" : ""
        }`}
      >
        <AvatarImage src={student.avatar || ""} />
        <AvatarFallback className="bg-[var(--color-brand-emerald)] text-white text-4xl font-bold">
          {student.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <label
        className={`absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white cursor-pointer opacity-0 transition-opacity ${
          isPending ? "hidden" : "group-hover:opacity-100"
        }`}
      >
        <Camera className="w-8 h-8 mb-1 text-white/90" />
        <span className="text-xs font-semibold">Ubah Foto</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={isPending}
        />
      </label>
    </div>
  );
}

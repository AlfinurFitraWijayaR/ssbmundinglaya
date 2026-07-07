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
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { updateStudentAdmin } from "@/modules/student/actions";

export function EditStudentModal({
  student,
  classes,
}: {
  student: {
    id: string;
    name: string;
    nickname: string | null;
    ku: string;
    classId: string;
    position: string | null;
    address: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    isActive: boolean;
  };
  classes: { id: string; className: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    formData.append("studentId", student.id);

    try {
      const res = await updateStudentAdmin(formData);
      if (res.success) {
        toast.success("Profil siswa berhasil diperbarui!");
        setIsOpen(false);
      } else {
        toast.error(res.error || "Gagal memperbarui profil siswa.");
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
          <Button
            className="w-full border-gray-300 text-zinc-700 hover:bg-gray-50"
            variant="outline"
          />
        }
      >
        <Edit className="w-4 h-4 mr-2" /> Edit Profil
      </DialogTrigger>
      <DialogContent className="glass border-gray-200 text-zinc-900 sm:max-w-md bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profil Siswa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input
                name="fullName"
                required
                defaultValue={student.name}
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Panggilan</Label>
              <Input
                name="nickname"
                defaultValue={student.nickname || ""}
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Kelahiran (Kelas)</Label>
              <Select name="classId" defaultValue={student.classId} required>
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
              <Label>Tempat Lahir</Label>
              <Input
                name="birthPlace"
                defaultValue={student.birthPlace || ""}
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Lahir</Label>
              <Input
                name="birthDate"
                type="date"
                defaultValue={student.birthDate || ""}
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Alamat Rumah</Label>
              <Input
                name="address"
                defaultValue={student.address || ""}
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Posisi Bermain</Label>
              <Input
                name="position"
                defaultValue={student.position || ""}
                className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="isActive" defaultValue={student.isActive ? "true" : "false"}>
                <SelectTrigger className="bg-white border-gray-300 focus:ring-[var(--color-brand-emerald)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
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

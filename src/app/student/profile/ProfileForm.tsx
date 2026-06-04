"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { updateStudentProfile } from "@/modules/student/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function ProfileForm({
  student,
  profile,
}: {
  student: any;
  profile: any;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateStudentProfile(formData);
      if (result.success) {
        toast.success("Profil berhasil diperbarui!");
        router.push("/student");
      } else {
        toast.error(result.error || "Gagal memperbarui profil.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 aurora-bg text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link href="/student">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
        </Link>
        <div>
          <h1 className="font-semibold text-zinc-800">Profil Saya</h1>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto space-y-6 mt-4">
        <form action={onSubmit} className="space-y-6">
          <Card className="glass border-gray-200 shadow-sm">
            <CardContent className="p-6 space-y-6 bg-white/50">
              {/* foto profile & nama siswa */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-200 pb-6">
                {/* foto profile */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--color-brand-gold)] shadow-md bg-gray-100 flex items-center justify-center">
                    {student.avatarUrl ? (
                      <Image
                        src={`/api/file/${student.avatarUrl}`}
                        alt="Avatar"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-[var(--color-brand-emerald)]">
                        {student.fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* name and class */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg text-zinc-800 capitalize">
                    {student.fullName}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Kelahiran{" "}
                    <span className="font-semibold">
                      {student.class?.className}
                    </span>
                  </p>
                  <p className="text-sm text-zinc-500">
                    Kode login:{" "}
                    <span className="font-semibold">{profile.loginCode}</span>
                  </p>
                </div>
              </div>

              {/* form main */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Tanggal Lahir</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    defaultValue={student.birthDate || ""}
                    className="bg-white border-gray-300"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={student.address || ""}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="cth: 08200000000"
                    defaultValue={profile.phoneNumber || ""}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Posisi</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="cth: striker"
                    defaultValue={student.position || ""}
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* button submit */}
          <div className="flex items-center">
            <Button
              type="submit"
              className="cursor-pointer flex-1 h-10 bg-[var(--color-brand-emerald)] hover:bg-[var(--color-brand-emerald)]/90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

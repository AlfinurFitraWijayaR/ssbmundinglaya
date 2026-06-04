"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  students: {
    id: string;
    name: string;
    ku: string;
  }[];
};

export function ReportForm({ students }: Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate saving evaluation report
    setTimeout(() => {
      toast.success("Laporan evaluasi berhasil disimpan dan dikirim ke siswa!");
      setIsSaving(false);
      router.push("/coach");
    }, 1500);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 mt-4">
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass border-gray-200 shadow-sm">
          <CardContent className="p-6 space-y-6 bg-white/50">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Pilih Siswa</label>
              <Select required>
                <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="-- Pilih Siswa --" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name} ({s.ku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2">
                Penilaian Aspek
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 font-medium">Fisik (Kekuatan & Stamina)</label>
                  <Select required>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Nilai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Sangat Baik (A)</SelectItem>
                      <SelectItem value="B">Baik (B)</SelectItem>
                      <SelectItem value="C">Cukup (C)</SelectItem>
                      <SelectItem value="D">Kurang (D)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 font-medium">Teknik (Dribbling/Passing)</label>
                  <Select required>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Nilai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Sangat Baik (A)</SelectItem>
                      <SelectItem value="B">Baik (B)</SelectItem>
                      <SelectItem value="C">Cukup (C)</SelectItem>
                      <SelectItem value="D">Kurang (D)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 font-medium">Taktik & Visi Bermain</label>
                  <Select required>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Nilai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Sangat Baik (A)</SelectItem>
                      <SelectItem value="B">Baik (B)</SelectItem>
                      <SelectItem value="C">Cukup (C)</SelectItem>
                      <SelectItem value="D">Kurang (D)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 font-medium">Mental & Disiplin</label>
                  <Select required>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Nilai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Sangat Baik (A)</SelectItem>
                      <SelectItem value="B">Baik (B)</SelectItem>
                      <SelectItem value="C">Cukup (C)</SelectItem>
                      <SelectItem value="D">Kurang (D)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Catatan Pelatih</label>
              <Textarea
                placeholder="Tuliskan catatan khusus atau saran untuk perkembangan siswa ini..."
                className="min-h-[120px] bg-white border-gray-300 text-gray-900 resize-none"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full h-12 bg-[var(--color-brand-emerald)] text-white font-bold hover:bg-[var(--color-brand-emerald)]/90 text-lg rounded-xl shadow-md shadow-green-900/20"
          disabled={isSaving}
        >
          {isSaving ? "Mengirim Laporan..." : (
            <><Save className="w-5 h-5 mr-2" /> Kirim Laporan ke Siswa</>
          )}
        </Button>
      </form>
    </div>
  );
}

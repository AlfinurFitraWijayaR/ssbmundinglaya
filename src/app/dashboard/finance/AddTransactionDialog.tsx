"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addCashFlow } from "@/modules/finance/actions";

export function AddTransactionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await addCashFlow(formData);
      if (res.success) {
        toast.success("Transaksi berhasil dicatat!");
        setIsOpen(false);
      } else {
        toast.error(res.error || "Gagal mencatat transaksi.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={
        <Button className="bg-[var(--color-brand-emerald)] text-white hover:bg-[var(--color-brand-emerald)]/90">
          <Plus className="w-4 h-4 mr-2" /> Catat Transaksi Baru
        </Button>
      } />
      <DialogContent className="glass border-gray-200 text-zinc-900 sm:max-w-md bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Input Transaksi Kas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Jenis Transaksi</Label>
              <Select name="type" required defaultValue="in">
                <SelectTrigger className="bg-white border-gray-300 focus:ring-[var(--color-brand-emerald)]">
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Kas Masuk</SelectItem>
                  <SelectItem value="out">Kas Keluar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Keterangan</Label>
              <Input name="title" required placeholder="Contoh: Beli Bola Latihan" className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]" />
            </div>
            <div className="space-y-2">
              <Label>Nominal (Rp)</Label>
              <Input name="amount" type="number" required placeholder="100000" className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]" />
            </div>
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input name="date" type="date" required className="bg-white border-gray-300 focus-visible:ring-[var(--color-brand-emerald)]" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="border-gray-300 text-gray-700" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending} className="bg-[var(--color-brand-emerald)] text-white hover:bg-[var(--color-brand-emerald)]/90">
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

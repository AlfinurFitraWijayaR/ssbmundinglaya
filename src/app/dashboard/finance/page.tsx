import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { db } from "@/modules/shared/db";
import { cashFlow } from "@/modules/shared/schema";
import { desc } from "drizzle-orm";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { AddTransactionDialog } from "./AddTransactionDialog";

dayjs.locale("id");

export default async function FinancePage() {
  const cashFlows = await db.select().from(cashFlow).orderBy(desc(cashFlow.transactionDate));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-800">Manajemen Keuangan</h1>
          <p className="text-muted-foreground mt-1 text-sm">Pencatatan kas masuk dan keluar di luar iuran sistem.</p>
        </div>
        
        <AddTransactionDialog />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-zinc-600 font-semibold">Tanggal</TableHead>
              <TableHead className="text-zinc-600 font-semibold">Keterangan</TableHead>
              <TableHead className="text-zinc-600 font-semibold">Jenis</TableHead>
              <TableHead className="text-right text-zinc-600 font-semibold">Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashFlows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-zinc-500 py-8">
                  Belum ada data transaksi.
                </TableCell>
              </TableRow>
            ) : (
              cashFlows.map((cf) => (
                <TableRow key={cf.id} className="border-gray-100 hover:bg-gray-50 transition-colors">
                  <TableCell className="text-zinc-600">
                    {dayjs(cf.transactionDate).format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell className="font-medium text-zinc-900">{cf.title}</TableCell>
                  <TableCell>
                    {cf.type === "in" ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                        <ArrowUpRight className="w-3 h-3 mr-1" /> Masuk
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">
                        <ArrowDownRight className="w-3 h-3 mr-1" /> Keluar
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${cf.type === "in" ? "text-green-600" : "text-red-600"}`}>
                    {cf.type === "in" ? "+" : "-"} Rp {Number(cf.amount).toLocaleString('id-ID')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

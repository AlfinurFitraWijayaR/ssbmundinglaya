import dayjs from "dayjs";
import { Fee } from "./ClientPaymentPage";

function terbilang(angka: number): string {
  const bilangan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];
  if (angka < 12) return bilangan[angka];
  if (angka < 20) return terbilang(angka - 10) + " Belas";
  if (angka < 100)
    return (
      terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10)
    );
  if (angka < 200) return "Seratus " + terbilang(angka - 100);
  if (angka < 1000)
    return (
      terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100)
    );
  if (angka < 2000) return "Seribu " + terbilang(angka - 1000);
  if (angka < 1000000)
    return (
      terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000)
    );
  if (angka < 1000000000)
    return (
      terbilang(Math.floor(angka / 1000000)) +
      " Juta " +
      terbilang(angka % 1000000)
    );
  return "";
}

export const KwitansiPayment = ({
  selectedPayment,
  studentName,
  studentClass,
}: {
  selectedPayment: Fee;
  studentName: string;
  studentClass: string;
}) => {
  return (
    <div className="hidden print:block w-[600px] mx-auto bg-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 flex items-center justify-center p-2 bg-white">
          <img
            src="/logossb.svg"
            alt="Logo"
            className="w-20 object-contain"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-zinc-800">
            SSB Mundinglaya
          </h1>
          <p className="text-sm text-gray-600">
            Lapang Munding Laya, Jl. Sukasari Kidul
          </p>
          <p className="text-sm text-gray-600">Kec. Argapura, Majalengka</p>
        </div>
      </div>

      {/* Student Info */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2 h-12 bg-gray-800"></div>
        <div>
          <p className="text-sm text-zinc-600 font-medium">
            Kelahiran {studentClass}
          </p>
          <p className="text-lg font-bold text-zinc-700 capitalize">
            {studentName}
          </p>
        </div>
      </div>

      {/* Amount Section */}
      <div className="mb-12">
        <p className="text-sm text-gray-600 mb-1">
          Telah terima pembayaran senilai
        </p>
        <p className="text-[54px] leading-none font-bold text-gray-900 mb-2">
          Rp {Number(selectedPayment.amount).toLocaleString("id-ID")}
        </p>
        <p className="text-lg font-bold text-gray-900 capitalize">
          {terbilang(Number(selectedPayment.amount))
            .trim()
            .replace(/\s+/g, " ")}{" "}
          Rupiah
        </p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-6">
        <div>
          <p className="text-sm text-gray-600">Metode Pembayaran</p>
          <p className="text-lg font-bold text-gray-900 uppercase">
            {selectedPayment.paymentMethod || "TUNAI"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Untuk Pembayaran</p>
          <p className="text-lg font-bold text-gray-900">
            {selectedPayment.sessionId
              ? "Iuran Sesi Latihan"
              : `Iuran Bulanan ${dayjs()
                  .month((selectedPayment.periodMonth || 1) - 1)
                  .format("MMMM")} ${selectedPayment.periodYear}`}
          </p>
        </div>
      </div>

      <div className="mt-24 flex justify-end">
        <div className="text-center mr-6">
          <p className="text-sm text-zinc-600 mb-22">
            Mengetahui,
            <br />
            Kepala Pelatih
          </p>
          <p className="text-zinc-700 font-semibold">Yoga Anggita P</p>
          <div className="w-56 border-b border-gray-900 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

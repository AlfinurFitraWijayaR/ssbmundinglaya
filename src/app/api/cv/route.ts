import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file) {
    return new NextResponse("Parameter file tidak ditemukan", { status: 400 });
  }

  try {
    const cdnUrl = process.env.NEXT_PUBLIC_BASE_CDN_URL;
    if (!cdnUrl) {
      console.error("NEXT_PUBLIC_BASE_CDN_URL tidak diatur");
      return new NextResponse("Konfigurasi server salah", { status: 500 });
    }

    // Mengambil file dari Supabase Storage
    const fileUrl = `${cdnUrl}/${file}`;
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return new NextResponse("File tidak ditemukan", { status: 404 });
    }

    // Mengambil tipe konten (misal: application/pdf)
    const contentType = response.headers.get("content-type") || "application/pdf";
    const arrayBuffer = await response.arrayBuffer();
    
    // Ambil nama file dari path untuk ditampilkan di browser
    const filename = file.split("/").pop() || "cv.pdf";

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error mengambil file CV:", error);
    return new NextResponse("Terjadi kesalahan internal server", { status: 500 });
  }
}

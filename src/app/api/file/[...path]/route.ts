import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: any }
) {
  try {
    const params = await context.params;
    const pathArray = params.path;
    const file = pathArray.join("/");

    if (!file) {
      return new NextResponse("Parameter file tidak ditemukan", { status: 400 });
    }

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

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();
    
    const filename = file.split("/").pop() || "file";

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        // Tambahkan cache agar gambar tidak diload berulang kali
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error mengambil file:", error);
    return new NextResponse("Terjadi kesalahan internal server", { status: 500 });
  }
}

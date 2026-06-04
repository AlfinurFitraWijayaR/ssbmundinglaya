import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file in the browser before uploading.
 * Converts to WebP and targets ~100KB size.
 */
export async function compressProfileImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.1, // ~100KB
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: 'image/webp'
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    // Create a new File object from the Blob
    return new File(
      [compressedBlob], 
      file.name.replace(/\.[^/.]+$/, "") + ".webp", 
      { type: "image/webp" }
    );
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}

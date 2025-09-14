export const useFormatPriceIntl = (
  value: number | null | undefined,
  notation: "compact" | "standard" = "standard",
  compactDisplay: "long" | "short" = "long"
): string => {
  if (value === undefined || value === null) {
    return "";
  }

  const num = Math.round(value);

  // Menggunakan Intl.NumberFormat untuk format mata uang lokal
  // 'id-ID' untuk lokal Indonesia
  // 'currency' untuk format mata uang
  // 'IDR' untuk kode mata uang Rupiah Indonesia
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: notation,
    compactDisplay: compactDisplay,
    minimumFractionDigits: 0, // Tidak ada desimal
    maximumFractionDigits: 0, // Tidak ada desimal
  }).format(num);
};

// Contoh output: "Rp15.000.000"

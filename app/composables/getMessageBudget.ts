export const getBudgetMessage = (value: number) => {
  if (value === 0) return "Masih aman, belum ada pengeluaran sama sekali 😎";
  if (value <= 10)
    return `${value}% kepake, masih chill tapi tetap dicatat ya 📲`;
  if (value <= 24)
    return `${value}% jalan, kecil-kecil lama-lama jadi bukit 🧾`;
  if (value === 25)
    return "Baru 25% kepake, tetap santai tapi jangan kebablasan 💸";
  if (value <= 49) return `${value}% udah lewat, yuk cek pengeluaranmu 👀`;
  if (value === 50)
    return "Setengah jalan nih! Waktunya cek ulang belanjaan 🧐";
  if (value <= 74) return `${value}% kepake, makin dekat ke batas 🚧`;
  if (value === 75) return "Udah 75%! Jangan sampai zonk di akhir bulan 🚨";
  if (value <= 99) return `${value}% jalan terus, siap-siap rem belanja 🛑`;
  return "Anggaran full kepake! Saatnya tahan diri dulu 🧘";
};

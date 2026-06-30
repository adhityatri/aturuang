# Design.md — Bauhaus Style Mobile UI

## 1. Konsep Utama

Desain aplikasi mobile ini menggunakan pendekatan **Bauhaus-inspired UI**, yaitu menggabungkan prinsip Bauhaus klasik dengan kebutuhan usability aplikasi Android modern.

Tujuan utama desain:

- Tampilan lebih berkarakter dan mudah dikenali.
- Informasi finansial tetap jelas dan cepat dibaca.
- Layout tetap nyaman digunakan pada layar mobile.
- Elemen visual dibuat tegas, geometris, dan minimalis.
- Warna primer digunakan sebagai aksen, bukan dekorasi berlebihan.

---

## 2. Prinsip Desain

### 2.1 Function First

Setiap elemen harus memiliki fungsi yang jelas.

Contoh:

- Saldo utama dibuat besar karena merupakan informasi paling penting.
- Tombol aksi dibuat kontras agar mudah ditemukan.
- Riwayat transaksi tetap menggunakan struktur list agar mudah dipindai.

### 2.2 Geometric Composition

Gunakan elemen visual khas Bauhaus:

- Lingkaran
- Persegi
- Segitiga
- Garis tebal
- Dot grid
- Blok warna

Elemen geometris digunakan sebagai aksen visual, bukan pengganggu konten.

### 2.3 Strong Typography

Tipografi dibuat tegas dan kontras.

Rekomendasi:

- Heading besar, uppercase, bold.
- Label kecil menggunakan uppercase.
- Nominal uang menggunakan font weight tinggi.
- Jarak antar teks dibuat lega.

### 2.4 High Contrast

Gunakan kombinasi warna dengan kontras kuat:

- Putih / off-white sebagai background utama.
- Hitam untuk teks utama.
- Biru sebagai warna utama aplikasi.
- Kuning dan merah sebagai aksen Bauhaus.

---

## 3. Design Direction

### Style Name

**Neo-Bauhaus Finance Mobile UI**

### Keywords

- Bold
- Geometric
- Editorial
- Functional
- Minimal
- High contrast
- Modular
- Grid-based

### Mood

Desain terasa:

- Modern
- Berani
- Artistik
- Profesional
- Tidak terlalu playful
- Tetap usable untuk aplikasi finansial

---

## 4. Color Palette

| Role | Color | Hex |
|---|---:|---|
| Primary Blue | Bauhaus Blue | `#064EAF` |
| Deep Blue | Dark Primary | `#073B82` |
| Accent Red | Bauhaus Red | `#EF2B24` |
| Accent Yellow | Bauhaus Yellow | `#FFD21E` |
| Text Black | Main Text | `#0A0A0A` |
| Soft Background | Canvas | `#F8F5ED` |
| White | Card Surface | `#FFFFFF` |
| Border | Strong Line | `#111111` |
| Muted Text | Secondary Text | `#6B7280` |

### Usage Rules

- Biru digunakan untuk saldo utama, active navigation, dan CTA utama.
- Kuning digunakan untuk tombol sekunder atau highlight.
- Merah digunakan untuk transaksi keluar atau aksen visual.
- Hitam digunakan untuk border, divider, icon, dan teks penting.
- Background sebaiknya off-white agar tidak terlalu tajam di mata.

---

## 5. Typography

### Recommended Fonts

Gunakan salah satu:

- **Inter**
- **Space Grotesk**
- **Archivo**
- **Montserrat**
- **Poppins**

### Font Scale

| Element | Size | Weight | Style |
|---|---:|---:|---|
| Date Label | 12–14px | 500 | Uppercase, letter spacing |
| Greeting | 40–52px | 800 | Uppercase |
| Section Title | 20–24px | 800 | Uppercase |
| Balance | 40–48px | 800 | Large |
| Card Title | 14–16px | 700 | Uppercase |
| Body Text | 13–15px | 400–500 | Normal |
| Navigation Label | 11–12px | 700 | Uppercase |

---

## 6. Layout Structure

### Screen Layout

```txt
┌─────────────────────────────┐
│ Date                        │
│ HALO                        │
│ ADMIN        Circle Action  │
│                             │
│ [Saldo Card]                │
│                             │
│ Section: Kantong Saya       │
│ [Kantong Baru]              │
│                             │
│ [Kantong Utama] [Tabungan]  │
│ [Lihat Semua]               │
│                             │
│ [Riwayat Transaksi]         │
│                             │
│ Bottom Navigation           │
└─────────────────────────────┘
```

### Layout Rules

- Gunakan grid 4 kolom untuk mobile.
- Margin horizontal: `24px`.
- Gap antar section: `28px–36px`.
- Card tidak perlu terlalu rounded.
- Gunakan border hitam tipis atau sedang.
- Hindari shadow besar.
- Gunakan garis dan bentuk sebagai pemisah visual.

---

## 7. Component Guidelines

## 7.1 Header

### Original

Header sebelumnya menggunakan teks kecil dan avatar/icon berbentuk soft neumorphic.

### Bauhaus Version

Gunakan:

- Tanggal uppercase dengan letter spacing.
- Sapaan dibuat besar dan tegas.
- Icon action berbentuk lingkaran hitam atau putih dengan border kuat.
- Tambahkan shape kuning atau biru sebagai background decorative element.

```txt
RABU, 10 JUNI 2026

HALO
ADMIN
```

### Rules

- Jangan gunakan terlalu banyak shadow.
- Sapaan harus menjadi visual anchor.
- Elemen dekoratif tidak boleh menutupi teks.

---

## 7.2 Balance Card

### Purpose

Menampilkan saldo utama sebagai informasi paling penting.

### Design

- Background biru solid.
- Bentuk card lebih tegas, rounded kecil atau tanpa rounded.
- Tambahkan aksen lingkaran merah atau garis vertikal.
- Informasi pemasukan/pengeluaran berada dalam panel putih di dalam card.

### Structure

```txt
┌─────────────────────────────┐
│ SALDO SAAT INI              │
│ Rp 11.870.400               │
│                             │
│ ┌─────────────────────────┐ │
│ │ ● PEMASUKAN | PENGELUARAN ● │
│ │   Rp 0      | Rp 0        │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Rules

- Saldo harus tetap paling besar.
- Jangan gunakan gradient berlebihan.
- Panel pemasukan/pengeluaran dibuat kontras.
- Warna merah hanya untuk pengeluaran.
- Warna biru untuk pemasukan.

---

## 7.3 Kantong Saya Section

### Design

- Section title menggunakan uppercase bold.
- Tambahkan kotak hitam kecil sebagai marker.
- Tombol “Kantong Baru” menggunakan background kuning.
- Card kantong menggunakan border hitam dan aksen geometris di sudut.

### Button

```txt
[ + KANTONG BARU ]
```

### Pocket Card

```txt
┌──────────────────┐
│ KANTONG UTAMA    │
│ Rp 6.528.300     │
└──────────────────┘
```

### Rules

- Gunakan 2 card per row jika layar cukup.
- Card harus tetap mudah disentuh.
- Minimum tap target: `44px`.
- Nominal harus lebih dominan dari label.

---

## 7.4 Lihat Semua Button

### Design

Tombol outline dengan border hitam.

```txt
┌──────────────────────┐
│ LIHAT SEMUA       →  │
└──────────────────────┘
```

### Rules

- Jangan gunakan tombol biru penuh terlalu sering.
- Untuk secondary action, gunakan outline.
- Icon panah cocok untuk gaya Bauhaus.

---

## 7.5 Transaction History

### Design

- Container putih/off-white dengan border hitam.
- Sisi kiri bisa diberi blok merah vertikal.
- Setiap transaksi menggunakan ikon kotak berwarna.
- Nominal keluar menggunakan merah.
- Divider garis hitam tipis.

### Item

```txt
[↗]  TK
     29 November 2025 | 22:24            Rp 41.000
```

### Rules

- List transaksi tetap linear agar mudah dibaca.
- Jangan terlalu eksperimental pada area data.
- Gunakan warna untuk membantu kategori, bukan hanya dekorasi.

---

## 7.6 Floating Action Button

### Design

FAB dibuat berbentuk lingkaran biru besar dengan label singkat.

```txt
     ┌─────┐
     │  +  │
     │BARU │
     └─────┘
```

### Rules

- FAB boleh berbentuk lingkaran untuk kontras dengan elemen kotak.
- Pastikan tidak menutup nominal transaksi penting.
- Gunakan shadow ringan saja.

---

## 7.7 Bottom Navigation

### Design

Bottom navigation dibuat modular seperti grid Bauhaus.

- Active item menggunakan background biru.
- Inactive item putih dengan border hitam.
- Icon dibuat sederhana.
- Label uppercase.

```txt
┌──────┬──────────────┬─────────┬─────────┐
│ HOME │ TRANSACTIONS │ INSIGHT │ PROFILE │
└──────┴──────────────┴─────────┴─────────┘
```

### Rules

- Active state harus sangat jelas.
- Hindari icon terlalu detail.
- Gunakan border antar item.

---

## 8. Spacing System

Gunakan spacing berbasis kelipatan 4.

| Token | Value |
|---|---:|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |

### Recommended Screen Padding

```css
padding-inline: 24px;
padding-block: 32px;
```

---

## 9. Border & Radius

### Border

```css
border: 1.5px solid #111111;
```

### Radius

| Element | Radius |
|---|---:|
| Main Card | 0–16px |
| Small Card | 0–8px |
| Button | 0–8px |
| FAB | 999px |
| Icon Circle | 999px |

### Rule

Bauhaus tidak bergantung pada rounded besar. Gunakan radius secukupnya agar tetap nyaman di mobile.

---

## 10. Shadow

Gunakan shadow minimal.

```css
box-shadow: 4px 4px 0 #111111;
```

Atau:

```css
box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
```

### Rule

Untuk Bauhaus, shadow bisa diganti dengan:

- Border tebal
- Offset shadow solid
- Kontras warna

---

## 11. Icon Style

Gunakan icon yang:

- Sederhana
- Solid atau outline tebal
- Mudah dibaca
- Tidak terlalu dekoratif

Rekomendasi:

- Lucide Icons
- Heroicons
- Material Symbols Rounded

Untuk gaya Bauhaus, icon boleh dibuat dalam:

- Kotak biru
- Kotak merah
- Kotak kuning
- Lingkaran hitam

---

## 12. Motion / Animation

Animasi harus sederhana.

### Recommended

- Button press scale: `0.96`
- Card appear: fade + slight translate
- Active nav transition: background color
- Shape movement sangat halus

### Avoid

- Animasi bouncing berlebihan
- Gradient animation
- Blur/glass effect berat
- Parallax berlebihan

---

## 13. Accessibility

Walaupun visual Bauhaus kuat, accessibility tetap wajib.

### Rules

- Minimum contrast ratio: 4.5:1 untuk teks normal.
- Jangan hanya bergantung pada warna merah/biru untuk status.
- Minimum touch target: 44x44px.
- Font body minimal 13–14px.
- Jaga jarak antar tombol.

### Financial App Priority

Karena ini aplikasi finansial:

- Angka harus sangat jelas.
- Jangan gunakan font terlalu eksperimental untuk nominal.
- Pastikan saldo dan transaksi mudah dibaca.
- Error dan warning harus sangat eksplisit.

---

## 14. Tailwind Token Example

```ts
export const bauhausTheme = {
  colors: {
    primary: '#064EAF',
    primaryDark: '#073B82',
    red: '#EF2B24',
    yellow: '#FFD21E',
    black: '#0A0A0A',
    canvas: '#F8F5ED',
    surface: '#FFFFFF',
    muted: '#6B7280',
  },
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '999px',
  },
}
```

---

## 15. Example CSS Utilities

```css
.bauhaus-card {
  background: #ffffff;
  border: 1.5px solid #111111;
  border-radius: 8px;
}

.bauhaus-button-primary {
  background: #064EAF;
  color: #ffffff;
  border: 1.5px solid #111111;
  font-weight: 800;
  text-transform: uppercase;
}

.bauhaus-button-yellow {
  background: #FFD21E;
  color: #0A0A0A;
  border: 1.5px solid #111111;
  font-weight: 800;
  text-transform: uppercase;
}

.bauhaus-section-title {
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}
```

---

## 16. UI Do & Don't

### Do

- Gunakan grid yang jelas.
- Gunakan typography besar untuk hierarchy.
- Gunakan warna primer sebagai aksen.
- Gunakan border tegas.
- Gunakan shape geometris dengan tujuan visual.
- Pertahankan struktur data yang mudah dibaca.

### Don't

- Jangan terlalu banyak warna dalam satu area.
- Jangan membuat layout terlalu abstrak.
- Jangan menaruh shape di atas teks.
- Jangan menggunakan shadow/glassmorphism berlebihan.
- Jangan mengorbankan readability demi style.
- Jangan membuat tombol terlalu kecil.

---

## 17. Implementation Notes for Android

Jika diterapkan di Android native atau cross-platform:

### Jetpack Compose

- Gunakan `MaterialTheme` sebagai dasar.
- Override color scheme dengan palette Bauhaus.
- Gunakan `Card` dengan border custom.
- Gunakan `Box` untuk shape dekoratif.
- Bottom navigation tetap mengikuti pola Material.

### Flutter

- Gunakan `ThemeData` custom.
- Buat reusable component:
  - `BauhausCard`
  - `BauhausButton`
  - `BauhausSectionTitle`
  - `BauhausTransactionTile`
- Gunakan `Stack` untuk shape decorative.

### React Native

- Gunakan StyleSheet token.
- Hindari blur berat.
- Gunakan SVG untuk shape geometris.
- Pastikan performa list transaksi dengan `FlatList`.

### Nuxt / Web Mobile

- Gunakan TailwindCSS.
- Buat token warna di `tailwind.config`.
- Gunakan component reusable.
- Pastikan responsive di viewport 360px–430px.

---

## 18. Final Design Summary

Desain ini bukan Bauhaus klasik 100%, tetapi **Neo-Bauhaus Mobile UI** yang lebih cocok untuk aplikasi Android modern.

Karakter utamanya:

- Background bersih.
- Heading besar dan kuat.
- Saldo menjadi fokus utama.
- Card menggunakan bentuk geometris.
- Warna biru, merah, kuning digunakan sebagai identitas.
- Bottom navigation tetap familiar.
- UX finansial tetap jelas dan aman.

Pendekatan ini cocok untuk aplikasi keuangan personal yang ingin terlihat lebih unik, modern, dan memorable tanpa kehilangan fungsi utama.

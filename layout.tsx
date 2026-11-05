import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arabee — Belajar Bahasa Arab Jadi Seru",
  description: "Platform pembelajaran Bahasa Arab interaktif untuk siswa kelas X Madrasah Aliyah.",
  applicationName: "Arabee"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

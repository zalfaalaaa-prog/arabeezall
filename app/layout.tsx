import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARABEEZA — Belajar Bahasa Arab Jadi Seru",
  description: "Bahan ajar Bahasa Arab inklusif berbasis website untuk siswa kelas X Madrasah Aliyah. Mulai dari Materi 1: At-Ta‘āruf.",
  applicationName: "Arabeeza",
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "ARABEEZA — Belajar Bahasa Arab Jadi Seru",
    description: "Belajar kosakata, gramatika, dan percakapan Bahasa Arab melalui empat maharah.",
    siteName: "Arabeeza",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

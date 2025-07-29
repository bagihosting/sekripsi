import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skripsikilat.com';

export const metadata: Metadata = {
  title: 'SkripsiKilat: Jual Skrip & Web Siap Pakai untuk Tugas Akhir',
  description: 'Butuh skrip & website jadi untuk skripsi? SkripsiKilat menyediakan template & skrip siap pakai yang dijamin membuat dosen ACC. Lulus cepat tanpa pusing koding!',
  keywords: ['jual skrip skripsi', 'tugas akhir', 'website siap pakai', 'template skripsi', 'sistem informasi', 'source code', 'lulus cepat'],
  authors: [{ name: 'SkripsiKilat' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'SkripsiKilat: Jual Skrip & Web Siap Pakai untuk Tugas Akhir',
    description: 'Deadline mepet? Dapatkan skrip dan website siap pakai untuk tugas akhir Anda di SkripsiKilat. Dijamin cepat, mudah, dan langsung di-ACC dosen!',
    url: siteUrl,
    siteName: 'SkripsiKilat',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SkripsiKilat - Solusi Cepat Tugas Akhir',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkripsiKilat: Jual Skrip & Web Siap Pakai untuk Tugas Akhir',
    description: 'Jangan biarkan skripsi menghambat kelulusanmu! Dapatkan source code dan web jadi di SkripsiKilat.',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

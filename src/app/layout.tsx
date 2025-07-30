
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { getAllTools } from '@/lib/actions';
import MainLayout from '@/components/main-layout';
import type { AiTool } from '@/lib/types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sekripsi.com';

export const metadata: Metadata = {
  title: 'sekripsi.com: Akselerator Skripsi Berbasis AI',
  description: 'Percepat kelulusanmu dengan alat bantu AI canggih. Mulai dari generator judul, pemeriksa argumen, hingga simulasi sidang. Skripsi jadi lebih mudah dan cepat.',
  keywords: ['skripsi', 'tesis', 'tugas akhir', 'bantuan skripsi', 'AI untuk skripsi', 'generator judul', 'pemeriksa plagiarisme', 'konsultasi skripsi'],
  authors: [{ name: 'Tim sekripsi.com' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'sekripsi.com: Akselerator Skripsi Berbasis AI',
    description: 'Buntu ngerjain skripsi? Dapatkan bantuan dari AI untuk mempercepat penelitian dan penulisanmu. Coba gratis sekarang!',
    url: siteUrl,
    siteName: 'sekripsi.com',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'sekripsi.com - Alat Bantu Skripsi AI',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sekripsi.com: Akselerator Skripsi Berbasis AI',
    description: 'Jangan biarkan skripsi menghambatmu. Gunakan alat AI dari sekripsi.com untuk lulus lebih cepat.',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tools: AiTool[] = await getAllTools();
  
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
          <MainLayout aiToolsLinks={tools}>
            {children}
          </MainLayout>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://designbloom.com';

export const metadata: Metadata = {
  title: 'DesignBloom: Curated Website Templates for Creatives',
  description: 'Discover and purchase high-quality, professionally designed website templates. Perfect for portfolios, e-commerce, blogs, and businesses.',
  keywords: ['website templates', 'Next.js templates', 'React templates', 'creative portfolio', 'e-commerce theme', 'professional website design'],
  authors: [{ name: 'DesignBloom' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'DesignBloom: Curated Website Templates for Creatives',
    description: 'Find the perfect design for your next project. Explore our curated collection of beautiful and functional website templates.',
    url: siteUrl,
    siteName: 'DesignBloom',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'DesignBloom - Curated Website Templates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DesignBloom: Curated Website Templates for Creatives',
    description: 'Elevate your online presence with stunning templates from DesignBloom.',
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
    <html lang="en" className="scroll-smooth">
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

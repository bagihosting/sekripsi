
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { SekripsiComIcon } from '@/components/icons';
import { ArrowRight, Menu, Sparkles, ChevronDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';

const aiToolsLinks = [
    { href: '/generator-draf', label: 'Generator Draf Instan (Bab 1-5)' },
    { href: '/generator-judul', label: 'Generator Judul' },
    { href: '/pertanyaan-penelitian', label: 'Pertanyaan Penelitian' },
    { href: '/generator-hipotesis', label: 'Generator Hipotesis' },
    { href: '/kerangka-ai', label: 'Generator Kerangka' },
    { href: '/referensi-ai', label: 'Asisten Referensi' },
    { href: '/parafrase-ai', label: 'Alat Parafrase' },
    { href: '/panduan-spss', label: 'Panduan Analisis SPSS' },
    { href: '/generator-abstrak', label: 'Generator Abstrak' },
    { href: '/korektor-ai', label: 'Korektor Tulisan' },
    { href: '/cek-argumen', label: 'Pengecek Argumen' },
    { href: '/simulasi-sidang', label: 'Simulasi Sidang' },
    { href: '/story-generator', label: 'Generator Cerita' },
];

const mainNavLinks = [
    { href: '/blog', label: 'Trik Cepat Lulus' },
    { href: '/dukungan', label: 'Bantuan Kilat' },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <SekripsiComIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">sekripsi.com</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn(
                    "flex items-center gap-1 transition-colors hover:text-primary",
                    pathname.startsWith('/alat-ai') || aiToolsLinks.some(l => pathname === l.href) ? "text-primary" : "text-foreground/60"
                )}>
                    Pusat AI <ChevronDown className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link href="/alat-ai">
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span>Lihat Semua Alat</span>
                    </Link>
                </DropdownMenuItem>
                 {aiToolsLinks.map(link => (
                    <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            href="/blog"
            prefetch={false}
            className={cn(
                "transition-colors hover:text-primary",
                pathname === '/blog' ? "text-primary" : "text-foreground/60"
            )}
            >
            Trik Cepat Lulus
          </Link>
          <Link 
            href="/harga"
            prefetch={false}
            className={cn(
                "transition-colors hover:text-primary",
                pathname === '/harga' ? "text-primary" : "text-foreground/60"
            )}
            >
            Harga
          </Link>
          <Link 
            href="/dukungan"
            prefetch={false}
            className={cn(
                "transition-colors hover:text-primary",
                pathname === '/dukungan' ? "text-primary" : "text-foreground/60"
            )}
            >
            Bantuan Kilat
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/harga" prefetch={false}>
              <Star className="h-4 w-4 fill-current"/>
              <span className='hidden sm:inline'>Upgrade ke Pro</span>
            </Link>
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm">
                <SheetHeader className="text-left sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigasi utama untuk sekripsi.com.
                  </SheetDescription>
                </SheetHeader>
               <div className="h-full overflow-y-auto">
                  <div className="flex flex-col gap-1 pt-12">
                    <Link href="/" className="mb-4 flex items-center gap-2" onClick={() => setOpen(false)}>
                      <SekripsiComIcon className="h-8 w-8 text-primary" />
                      <span className="font-headline text-xl font-bold text-foreground">sekripsi.com</span>
                    </Link>

                    <Link
                        href="/alat-ai"
                        onClick={() => setOpen(false)}
                        className="px-2 py-1.5 text-lg font-medium transition-colors hover:text-primary"
                    >
                        Pusat AI
                    </Link>
                     <div className='flex flex-col gap-1 pl-6'>
                        {aiToolsLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "text-sm transition-colors hover:text-primary",
                                    pathname.startsWith(link.href) ? "text-primary" : "text-foreground/70"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    
                    <Separator className='my-2' />

                    {mainNavLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                            "px-2 py-1.5 text-lg font-medium transition-colors hover:text-primary",
                            pathname.startsWith(link.href) ? "text-primary" : "text-foreground/80"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                     <Link
                        href="/harga"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "px-2 py-1.5 text-lg font-medium transition-colors hover:text-primary",
                            pathname.startsWith('/harga') ? "text-primary" : "text-foreground/80"
                        )}
                      >
                        Harga
                      </Link>

                    <Button asChild className="mt-4">
                      <Link href="/harga" onClick={() => setOpen(false)}>
                        <Star className="mr-2 h-4 w-4 fill-current"/>
                        Upgrade ke Pro
                      </Link>
                    </Button>
                  </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

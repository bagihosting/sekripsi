
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SkripsiKilatIcon } from '@/components/icons';
import { ArrowRight, ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const aiTools = [
    { href: '/rekomendasi-ai', label: 'Rekomendasi Skrip' },
    { href: '/generator-judul', label: 'Generator Judul' },
    { href: '/pertanyaan-penelitian', label: 'Pertanyaan Penelitian' },
    { href: '/generator-hipotesis', label: 'Generator Hipotesis' },
    { href: '/kerangka-ai', label: 'Generator Kerangka' },
    { href: '/referensi-ai', label: 'Asisten Referensi' },
    { href: '/parafrase-ai', label: 'Alat Parafrase' },
    { href: '/korektor-ai', label: 'Korektor Tulisan' },
    { href: '/cek-argumen', label: 'Pengecek Argumen' },
    { href: '/simulasi-sidang', label: 'Simulasi Sidang' },
    { href: '/story-generator', label: 'Generator Cerita' },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  const mainNavLinks = [
    { href: '/produk', label: 'Produk' },
    { href: '/blog', label: 'Blog' },
    { href: '/dukungan', label: 'Dukungan' },
  ];

  const isAiToolActive = aiTools.some(tool => pathname.startsWith(tool.href));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <SkripsiKilatIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold text-foreground">SkripsiKilat</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {mainNavLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              prefetch={false}
              className={cn(
                "transition-colors hover:text-primary",
                pathname.startsWith(link.href) ? "text-primary" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(
                "gap-1 px-2 transition-colors hover:text-primary focus:bg-accent focus:text-accent-foreground",
                isAiToolActive ? "text-primary" : "text-foreground/60"
              )}>
                Alat Bantu AI
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {aiTools.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild>
                  <Link href={tool.href}>{tool.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/produk" prefetch={false}>
              Lihat Produk <ArrowRight className="ml-2 h-4 w-4" />
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
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu for SkripsiKilat.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 pt-12">
                <Link href="/" className="mb-4 flex items-center gap-2">
                  <SkripsiKilatIcon className="h-8 w-8 text-primary" />
                  <span className="font-headline text-xl font-bold text-foreground">SkripsiKilat</span>
                </Link>
                
                {mainNavLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname.startsWith(link.href) ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t pt-4">
                  <h4 className="mb-2 text-lg font-medium">Alat Bantu AI</h4>
                  <div className="flex flex-col gap-4">
                  {aiTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                          "text-base font-medium transition-colors hover:text-primary",
                          pathname.startsWith(tool.href) ? "text-primary" : "text-foreground/70"
                      )}
                    >
                      {tool.label}
                    </Link>
                  ))}
                  </div>
                </div>

                <Button asChild className="mt-4">
                  <Link href="/produk" onClick={() => setOpen(false)}>
                    Lihat Produk
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};


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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { SkripsiKilatIcon } from '@/components/icons';
import { ArrowRight, ChevronDown, Menu, Sparkles, Wand2, Target, TestTubeDiagonal, BookMarked, Library, PenSquare, SpellCheck, BrainCircuit, ShieldQuestion, Wand, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavLinks = [
    { href: '/produk', label: 'Produk' },
    { href: '/blog', label: 'Blog' },
    { href: '/dukungan', label: 'Dukungan' },
];

const aiToolGroups = [
  {
    title: 'Perencanaan & Ideasi',
    tools: [
      { href: '/rekomendasi-ai', label: 'Rekomendasi Skrip', icon: Sparkles },
      { href: '/generator-judul', label: 'Generator Judul', icon: Wand2 },
      { href: '/pertanyaan-penelitian', label: 'Pertanyaan Penelitian', icon: Target },
      { href: '/generator-hipotesis', label: 'Generator Hipotesis', icon: TestTubeDiagonal },
      { href: '/kerangka-ai', label: 'Generator Kerangka', icon: BookMarked },
    ]
  },
  {
    title: 'Penulisan & Riset',
    tools: [
      { href: '/referensi-ai', label: 'Asisten Referensi', icon: Library },
      { href: '/parafrase-ai', label: 'Alat Parafrase', icon: PenSquare },
    ]
  },
  {
    title: 'Analisis Data',
    tools: [
      { href: '/panduan-spss', label: 'Panduan Analisis SPSS', icon: Database },
    ]
  },
  {
    title: 'Koreksi & Finalisasi',
    tools: [
      { href: '/korektor-ai', label: 'Korektor Tulisan', icon: SpellCheck },
      { href: '/cek-argumen', label: 'Pengecek Argumen', icon: BrainCircuit },
      { href: '/simulasi-sidang', label: 'Simulasi Sidang', icon: ShieldQuestion },
    ]
  },
  {
    title: 'Kreatif',
    tools: [
      { href: '/story-generator', label: 'Generator Cerita', icon: Wand },
    ]
  }
];

const allAiTools = aiToolGroups.flatMap(group => group.tools);


export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  const isAiToolActive = allAiTools.some(tool => pathname.startsWith(tool.href)) || pathname === '/alat-ai';

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
              <Button
                variant="ghost"
                className={cn(
                  "gap-1 px-2 text-sm font-medium transition-colors hover:bg-transparent hover:text-primary focus-visible:ring-0",
                   isAiToolActive ? "text-primary" : "text-foreground/60"
                )}
              >
                <Sparkles className="h-4 w-4" />
                Alat Bantu AI
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem asChild>
                <Link href="/alat-ai" className="font-semibold">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Lihat Semua Alat AI
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {aiToolGroups.map((group, index) => (
                <DropdownMenuGroup key={index}>
                  <DropdownMenuLabel>{group.title}</DropdownMenuLabel>
                  {group.tools.map(tool => (
                    <DropdownMenuItem key={tool.href} asChild>
                      <Link href={tool.href}>
                        <tool.icon className="mr-2 h-4 w-4" />
                        {tool.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {index < aiToolGroups.length - 1 && <DropdownMenuSeparator />}
                </DropdownMenuGroup>
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
            <SheetContent side="right" className="w-full max-w-sm">
               <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigasi utama untuk SkripsiKilat. Pilih dari produk, blog, dukungan, atau jelajahi alat bantu AI kami.
                  </SheetDescription>
                </SheetHeader>
               <div className="h-full overflow-y-auto">
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
                    <Link
                        href="/alat-ai"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "text-lg font-medium transition-colors hover:text-primary flex items-center gap-2",
                            isAiToolActive ? "text-primary" : "text-foreground/80"
                        )}
                      >
                        <Sparkles className="h-5 w-5" />
                        Dasbor Alat AI
                      </Link>

                    <div className="border-t pt-4 mt-2">
                      <h4 className="mb-2 text-base font-medium text-muted-foreground">Detail Alat AI:</h4>
                      <div className="flex flex-col gap-4">
                      {allAiTools.map((tool) => (
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
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

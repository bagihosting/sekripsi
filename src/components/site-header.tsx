"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { SkripsiKilatIcon } from '@/components/icons';
import { ArrowRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navLinks = [
    { href: '/produk', label: 'Produk' },
    { href: '/rekomendasi-ai', label: 'Rekomendasi AI' },
    { href: '/generator-judul', label: 'Generator Judul' },
    { href: '/parafrase-ai', label: 'Parafrase AI' },
    { href: '/blog', label: 'Blog' },
    { href: '/dukungan', label: 'Dukungan' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <SkripsiKilatIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold text-foreground">SkripsiKilat</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map(link => (
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
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/produk" prefetch={false}>
              Lihat Produk <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Main navigation menu for SkripsiKilat.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-12">
                <Link href="/" className="mb-4 flex items-center gap-2">
                  <SkripsiKilatIcon className="h-8 w-8 text-primary" />
                  <span className="font-headline text-xl font-bold text-foreground">SkripsiKilat</span>
                </Link>
                {navLinks.map(link => (
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

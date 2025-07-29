
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SkripsiKilatIcon } from '@/components/icons';

export const SiteFooter = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="border-t py-8">
            <div className="container flex max-w-screen-xl flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="flex items-center gap-2">
                    <SkripsiKilatIcon className="h-8 w-8 text-primary" />
                    <span className="font-headline text-xl font-bold">SkripsiKilat</span>
                </div>
                <p className="text-center text-sm text-muted-foreground sm:text-left">
                    &copy; {year} SkripsiKilat. Jalan Pintas Menuju Wisuda.
                </p>
                <div className="flex items-center gap-4">
                    <Link href="/kebijakan-privasi" className="text-sm text-muted-foreground transition-colors hover:text-primary">Kebijakan Privasi</Link>
                    <Link href="/ketentuan-layanan" className="text-sm text-muted-foreground transition-colors hover:text-primary">Ketentuan Layanan</Link>
                </div>
            </div>
        </footer>
    );
};

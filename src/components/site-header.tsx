
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { SekripsiComIcon } from '@/components/icons';
import { ArrowRight, Menu, Sparkles, ChevronDown, Star, User, LogOut, LayoutDashboard, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { logout } from '@/lib/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getAllTools, AiTool } from '@/lib/plugins';

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, userProfile } = useAuth();
  const [aiToolsLinks, setAiToolsLinks] = useState<AiTool[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      const tools = await getAllTools();
      setAiToolsLinks(tools);
      setLoadingTools(false);
    }
    fetchTools();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Desktop Header */}
      <div className="container hidden h-16 max-w-screen-xl items-center justify-between md:flex">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <SekripsiComIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">sekripsi.com</span>
        </Link>
        
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
                 <DropdownMenuSeparator />
                 {!loadingTools && aiToolsLinks.map(link => (
                    <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>{link.title}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            href="/blog"
            prefetch={false}
            className={cn(
                "transition-colors hover:text-primary",
                pathname.startsWith('/blog') ? "text-primary" : "text-foreground/60"
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
          {user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile?.photoURL || undefined} alt={userProfile?.displayName || 'User Avatar'} />
                        <AvatarFallback>{(userProfile?.displayName || userProfile?.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                   <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex flex-col items-start" disabled>
                  <p className="font-medium">{userProfile?.displayName || userProfile?.email}</p>
                   <p className="text-xs text-muted-foreground capitalize">{userProfile?.role} ({userProfile?.plan})</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dasbor</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/profil">
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Profil Saya</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
               <Button asChild>
                 <Link href="/register">
                  <span className="sm:hidden">Daftar</span>
                  <span className="hidden sm:inline">Daftar Gratis</span>
                </Link>
              </Button>
            </>
          )}
          
          {userProfile && userProfile.plan === 'free' && (
             <Button asChild size="sm" className="hidden sm:flex items-center gap-1">
                <Link href="/harga">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="hidden lg:inline-block">Upgrade ke Pro</span>
                </Link>
              </Button>
          )}
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="container flex h-16 items-center justify-center md:hidden">
         <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <SekripsiComIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">sekripsi.com</span>
        </Link>
      </div>
    </header>
  );
};

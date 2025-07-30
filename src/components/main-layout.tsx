
'use client';

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import RecentUpgradeToast from "@/components/recent-upgrade-toast";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { AiTool } from "@/lib/types";

const specialLayoutRoutes = ['/login', '/register', '/upgrade'];
const dashboardRoute = '/dashboard';

interface MainLayoutProps {
  children: React.ReactNode;
  aiToolsLinks: AiTool[];
}

export default function MainLayout({ children, aiToolsLinks }: MainLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  // Special layout for login, register, upgrade
  if (specialLayoutRoutes.some(route => pathname.startsWith(route))) {
    return (
      <>
        {children}
        <RecentUpgradeToast />
        {isMobile && <BottomNavBar />}
      </>
    );
  }

  // Special layout for dashboard
  if (pathname.startsWith(dashboardRoute)) {
     return (
      <>
        {children}
        <RecentUpgradeToast />
        {isMobile && <BottomNavBar />}
      </>
    );
  }

  // Default layout for all other pages
  return (
     <div className="flex min-h-screen flex-col">
        <SiteHeader aiToolsLinks={aiToolsLinks} />
        <main className={cn("flex-1", isMobile && "pb-16")}>{children}</main>
        <SiteFooter />
        <BottomNavBar />
        <RecentUpgradeToast />
    </div>
  );
}

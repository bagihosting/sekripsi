
'use client';

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import RecentUpgradeToast from "@/components/recent-upgrade-toast";
import { usePathname } from "next/navigation";

const noNavRoutes = ['/login', '/register', '/dashboard', '/upgrade'];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the current path starts with any of the noNavRoutes
  const hideNav = noNavRoutes.some(route => pathname.startsWith(route));

  if (hideNav) {
    return <>{children}</>;
  }

  return (
     <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <SiteFooter />
        <BottomNavBar />
        <RecentUpgradeToast />
    </div>
  );
}

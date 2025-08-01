
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Star, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export const BottomNavBar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/alat-ai", label: "Alat AI", icon: Sparkles },
    { href: "/harga", label: "Harga", icon: Star },
    { href: user ? "/dashboard" : "/login", label: user ? "Dasbor" : "Login", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background shadow-t-lg z-50">
      <div className="grid h-full grid-cols-4">
        {navLinks.map((link) => {
          // The logic to determine if a link is active.
          // For the homepage, it must be an exact match.
          // For other links, it's active if the current path starts with the link's href.
          const isActive =
            link.href === "/"
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <link.icon className="h-6 w-6" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

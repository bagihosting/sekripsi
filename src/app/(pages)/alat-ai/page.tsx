
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lock, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { groupTools, AiTool, getAllTools } from '@/lib/plugins';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { AiToolGroup } from '@/lib/plugins';
import { Skeleton } from '@/components/ui/skeleton';

function ToolCard({ tool }: { tool: AiTool }) {
  return (
    <Card className="flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1">
       <CardHeader>
        <div className="flex items-center justify-between">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                 <tool.icon className="h-8 w-8" />
            </div>
             <div className="flex gap-2">
                {tool.price > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1 border-yellow-400/50">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> Dimiliki
                  </Badge>
              )}
              {tool.badge && (
                  <Badge variant="secondary">{tool.badge}</Badge>
              )}
            </div>
        </div>
        <CardTitle className="pt-4 font-headline text-xl">{tool.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{tool.description}</p>
      </CardContent>
      <div className="p-6 pt-0">
          <Button asChild className="w-full">
              <Link href={tool.href}>
                 Gunakan Alat <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
          </Button>
      </div>
    </Card>
  );
}

export default function AiToolsPage() {
  const { userProfile, loading } = useAuth();
  const [toolGroups, setToolGroups] = useState<AiToolGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchAndFilterTools() {
      if (loading) return; // Wait for auth to finish loading
      
      const allTools = await getAllTools();
      let visibleTools: AiTool[];

      if (!userProfile) {
        // Show only free tools for logged-out users
        visibleTools = allTools.filter(tool => tool.price === 0);
      } else {
        // Show tools that the user has activated (free + purchased)
        visibleTools = allTools.filter(tool => userProfile.activatedTools?.includes(tool.id));
      }
      
      setToolGroups(groupTools(visibleTools));
      setIsLoading(false);
    }

    fetchAndFilterTools();
  }, [userProfile, loading]);

  if (isLoading || loading) {
    return (
       <div className="container max-w-screen-xl py-12 lg:py-16">
          <div className="mx-auto mb-12 max-w-3xl text-center space-y-4">
            <Skeleton className="h-12 w-2/3 mx-auto" />
            <Skeleton className="h-6 w-full mx-auto" />
          </div>
          <div className="space-y-12">
            {[1, 2].map(i => (
              <div key={i}>
                <div className="mb-8 space-y-2">
                  <Skeleton className="h-10 w-1/3" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ))}
          </div>
       </div>
    );
  }

  if (!userProfile) {
    return (
       <div className="container max-w-screen-xl py-12 lg:py-16">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Pusat Senjata AI sekripsi.com</h1>
          <p className="mt-4 text-lg text-foreground/70">
            Silakan <Link href="/login" className="text-primary font-bold hover:underline">login</Link> atau <Link href="/register" className="text-primary font-bold hover:underline">daftar</Link> untuk melihat semua alat yang tersedia dan menambah koleksimu.
          </p>
        </div>
         <div className="space-y-12">
            {toolGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="mb-8">
                  <h2 className="font-headline text-2xl font-bold md:text-3xl">{group.title}</h2>
                  <p className="mt-2 text-md text-foreground/70">{group.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.tools.map((tool) => (
                    <ToolCard key={tool.href} tool={tool} />
                  ))}
                </div>
              </div>
            ))}
         </div>
      </div>
    )
  }

  return (
    <div className="container max-w-screen-xl py-12 lg:py-16">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Pusat Senjata AI-mu</h1>
        <p className="mt-4 text-lg text-foreground/70">
          Semua alat yang telah kamu aktifkan ada di sini. Butuh lebih banyak? <Link href="/produk" className="text-primary font-bold hover:underline">Kunjungi Toko Alat AI</Link> untuk menambah koleksimu.
        </p>
      </div>

       {toolGroups.length > 0 ? (
          <div className="space-y-12">
            {toolGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="mb-8">
                  <h2 className="font-headline text-2xl font-bold md:text-3xl">{group.title}</h2>
                  <p className="mt-2 text-md text-foreground/70">{group.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.tools.map((tool) => (
                    <ToolCard key={tool.href} tool={tool} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-card">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Koleksi Alat AI Anda Masih Kosong</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Kunjungi toko untuk mulai membeli alat-alat canggih.
              </p>
              <Button asChild className="mt-6">
                <Link href="/produk">Kunjungi Toko Alat AI</Link>
              </Button>
          </div>
        )}
    </div>
  );
}


import type { AiTool, AiToolGroup } from '@/lib/types';
import { iconMap } from '@/lib/plugins';
import { Wand, ArrowRight, Star, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AiToolsGridProps {
    toolGroups: AiToolGroup[];
}

function ToolCard({ tool }: { tool: AiTool }) {
  const IconComponent = typeof tool.icon === 'string' ? iconMap[tool.icon] || Wand : Wand;
  return (
    <Card className="flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1">
       <CardHeader>
        <div className="flex items-center justify-between">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                 <IconComponent className="h-8 w-8" />
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

export default function AiToolsGrid({ toolGroups }: AiToolsGridProps) {
    if (toolGroups.length === 0) {
        return (
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
        )
    }

    return (
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
    )
}

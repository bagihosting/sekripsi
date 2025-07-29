
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { aiToolGroups, AiTool } from '@/lib/plugins';

function ToolCard({ icon: Icon, title, description, href, badge }: AiTool) {
  return (
    <Card className="flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                 <Icon className="h-8 w-8" />
            </div>
            {badge && (
                <div className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{badge}</div>
            )}
        </div>
        <CardTitle className="pt-4 font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
      <div className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={href}>
            Gunakan Alat <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export default function AiToolsPage() {
  return (
    <div className="container max-w-screen-xl py-12 lg:py-16">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Pusat Senjata AI sekripsi.com</h1>
        <p className="mt-4 text-lg text-foreground/70">
          Semua yang kamu butuhkan untuk mempercepat kelulusan ada di sini. Pilih alat yang sesuai dengan tahap pengerjaan skripsimu, dari perencanaan hingga persiapan sidang.
        </p>
      </div>

      <div className="space-y-12">
        {aiToolGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="mb-8">
              <h2 className="font-headline text-2xl font-bold md:text-3xl">{group.title}</h2>
              <p className="mt-2 text-md text-foreground/70">{group.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <ToolCard key={tool.href} {...tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

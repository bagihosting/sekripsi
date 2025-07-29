
import { getTemplateById, getTemplates, Template } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronRight, Home, ShoppingCart, Zap } from 'lucide-react';

type Props = {
  params: { id: string }
}

// Generate metadata for each product page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  const template = getTemplateById(id);

  if (!template) {
    return {
      title: 'Template Not Found',
    }
  }

  const title = `${template.name} - Website Template | sekripsi.com`;
  const description = `Get the '${template.name}' website template. ${template.shortDescription}. A high-quality solution for your next project.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: template.imageUrl,
          width: 600,
          height: 400,
          alt: template.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [template.imageUrl],
    }
  }
}

// Statically generate routes at build time
export async function generateStaticParams() {
  const templates = getTemplates();
  return templates.map((template) => ({
    id: template.id.toString(),
  }));
}


export default function ProductDetailPage({ params }: Props) {
  const id = parseInt(params.id, 10);
  const template = getTemplateById(id);

  if (!template) {
    notFound();
  }

  return (
    <div className="container max-w-screen-xl py-8 md:py-12">
        <Breadcrumbs template={template} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-6">
            <div className="w-full">
                <Image
                    src={template.imageUrl}
                    alt={template.name}
                    width={1200}
                    height={800}
                    data-ai-hint={template.aiHint}
                    className="aspect-video object-cover rounded-lg shadow-lg border"
                    priority
                />
            </div>
            <div className="flex flex-col">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">{template.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary">{template.category}</Badge>
                    <Badge variant="secondary">{template.style}</Badge>
                </div>
                <p className="mt-4 text-lg text-foreground/80">{template.shortDescription}</p>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Key Features:</h2>
                    <ul className="space-y-2">
                        {template.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-foreground/90">{feature}</span>
                        </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto pt-8">
                     <div className="text-3xl font-bold mb-4">
                        ${template.price}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="flex-1">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Buy This Template
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1" asChild>
                            <Link href={template.liveDemoUrl} target="_blank">
                                <Zap className="mr-2 h-5 w-5" />
                                Live Demo
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

function Breadcrumbs({ template }: { template: Template }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                Home
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <Link href="/produk" className="hover:text-primary transition-colors">
                Templates
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="font-medium text-foreground truncate">{template.name}</span>
        </nav>
    )
}


'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTemplates, Template } from '@/lib/data';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import AiRecommender from '@/components/ai-recommender';

export default function Home() {
  const allTemplates = getTemplates();
  const trendingTemplates = allTemplates.filter(t => t.trending).slice(0, 4);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <TrendingSection templates={trendingTemplates} />
        <AiSection />
      </main>
      <SiteFooter />
    </div>
  );
}

const HeroSection = () => (
  <section className="w-full">
    <div className="container grid min-h-[calc(100dvh-4rem)] content-center text-center max-w-screen-xl">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Where Creativity Blossoms into Beautiful Websites
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
          Stop wrestling with code from scratch. Our curated collection of stunning, professional templates is your shortcut to a brilliant online presence. Ready to use, easy to customize.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/produk">Explore Templates</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="#ai-recommender">
              <Sparkles className="mr-2 h-5 w-5" />
              Get AI Recommendation
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const TrendingSection = ({ templates }: { templates: Template[] }) => (
  <section id="trending" className="w-full py-16 lg:py-24 bg-secondary/50">
    <div className="container max-w-screen-xl">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Trending Designs</h2>
        <p className="mt-4 text-lg text-foreground/70">
          Join hundreds of creatives and businesses who have launched their sites with our most popular designs. This isn't just a template; it's your next masterpiece.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/produk">
            View All Templates <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

const AiSection = () => (
  <section id="ai-recommender" className="py-16 lg:py-24">
    <div className="container max-w-screen-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
            <Sparkles className="h-12 w-12 text-accent mb-4" />
            <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Unsure Where to Start? Let Our AI Find Your Perfect Template!</h2>
            <p className="mt-4 text-lg text-foreground/70">
              Don't waste precious time scrolling. Just describe your project, style, and content needs, and let DesignBloom's AI recommend the perfect template to bring your vision to life. It's fast, smart, and free!
            </p>
        </div>
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <AiRecommender />
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

const TemplateCard = ({ template }: { template: Template }) => (
  <Card className="group overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
    <CardContent className="p-0">
      <Link href={`/produk/${template.id}`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-t-lg">
        <div className="relative">
          <Image
            src={template.imageUrl}
            alt={template.name}
            width={600}
            height={400}
            data-ai-hint={template.aiHint}
            className="aspect-[3/2] w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="font-headline text-xl font-semibold text-white">{template.name}</h3>
            <p className="text-sm text-white/80">{template.category}</p>
          </div>
          <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
            ${template.price}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <p className="mb-4 text-sm text-muted-foreground h-10">{template.shortDescription}</p>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={template.liveDemoUrl} target="_blank">Live Demo</Link>
          </Button>
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href={`/produk/${template.id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

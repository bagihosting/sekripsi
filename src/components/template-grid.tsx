

"use client";

import { useState, useMemo } from 'react';
import { DigitalProduct } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

export default function TemplateGrid({ templates }: { templates: DigitalProduct[] }) {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('name-asc');

  const categories = useMemo(() => {
    const allCategories = new Set(templates.map(t => t.category));
    return ['all', ...Array.from(allCategories)];
  }, [templates]);

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates;

    if (category !== 'all') {
      filtered = filtered.filter(t => t.category === category);
    }

    return filtered.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [templates, category, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-col items-stretch justify-between gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 flex-grow">
          <Label htmlFor="category-filter" className="text-sm font-medium shrink-0">Filter by Category:</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category-filter" className="w-full sm:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize">{cat === 'all' ? 'All Categories' : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 flex-grow">
           <Label htmlFor="sort-filter" className="text-sm font-medium shrink-0">Sort by:</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="sort-filter" className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAndSortedTemplates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
        {filteredAndSortedTemplates.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">No templates found for this category.</p>
        )}
      </div>
    </div>
  );
}

const TemplateCard = ({ template }: { template: DigitalProduct }) => (
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
        <p className="mb-4 h-10 text-sm text-muted-foreground">{template.shortDescription}</p>
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

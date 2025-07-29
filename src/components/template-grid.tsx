"use client";

import { useState, useMemo } from 'react';
import { Template } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TemplateGrid({ templates }: { templates: Template[] }) {
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
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
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
      <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-lg border bg-card p-4 sm:flex-row">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          <span className="text-sm font-medium">Filter berdasarkan:</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize">{cat === 'all' ? 'Semua' : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full items-center gap-4 sm:w-auto">
          <span className="text-sm font-medium">Urutkan berdasarkan:</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
              <SelectItem value="price-asc">Harga (Rendah ke Tinggi)</SelectItem>
              <SelectItem value="price-desc">Harga (Tinggi ke Rendah)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAndSortedTemplates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}

const TemplateCard = ({ template }: { template: Template }) => (
  <Card className="group overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
    <CardContent className="p-0">
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
          ${template.price.toFixed(2)}
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground">{template.shortDescription}</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href="#">Demo Langsung</Link>
          </Button>
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href="#">Detail</Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

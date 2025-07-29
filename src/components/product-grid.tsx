
"use client";

import { useState, useMemo } from 'react';
import { DigitalProduct } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Badge } from './ui/badge';

export default function ProductGrid({ products }: { products: DigitalProduct[] }) {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('name-asc');

  const categories = useMemo(() => {
    const allCategories = new Set(products.map(p => p.category));
    return ['all', ...Array.from(allCategories)];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    return filtered.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [products, category, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-col items-stretch justify-between gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 flex-grow">
          <Label htmlFor="category-filter" className="text-sm font-medium shrink-0">Filter berdasarkan Kategori:</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category-filter" className="w-full sm:w-[200px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize">{cat === 'all' ? 'Semua Kategori' : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 flex-grow">
           <Label htmlFor="sort-filter" className="text-sm font-medium shrink-0">Urutkan berdasarkan:</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="sort-filter" className="w-full sm:w-[200px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredAndSortedProducts.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">Tidak ada alat yang ditemukan untuk kategori ini.</p>
        )}
      </div>
    </div>
  );
}

const ProductCard = ({ product }: { product: DigitalProduct }) => (
  <Card className="group flex flex-col overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
    <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex-1">
            <div className="mb-4 aspect-video flex items-center justify-center rounded-md bg-secondary">
                <product.icon className="h-16 w-16 text-primary" />
            </div>
            <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">{product.category}</Badge>
                {product.badge && <Badge>{product.badge}</Badge>}
            </div>
            <h3 className="font-headline text-xl font-semibold leading-snug">
                <Link href={`/produk/${product.id}`} className="hover:text-primary transition-colors">{product.name}</Link>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground h-12 line-clamp-2">{product.description}</p>
        </div>
        <div className="mt-4">
            <Button className="w-full" asChild>
                <Link href={`/produk/${product.id}`}>Lihat Detail & Aktifkan</Link>
            </Button>
        </div>
    </CardContent>
  </Card>
);

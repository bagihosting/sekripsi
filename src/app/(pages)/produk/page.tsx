
import ProductGrid from '@/components/product-grid';
import { getAllTools } from '@/lib/plugins';
import type { AiTool } from '@/lib/plugins';

export default async function ProdukPage() {
  const allProducts: AiTool[] = await getAllTools();
  
  return (
    <section id="templates" className="w-full bg-background py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Toko Alat AI</h1>
          <p className="mt-4 text-lg text-foreground/70">
            Perluas persenjataan skripsimu. Beli alat-alat canggih secara individual untuk membantumu lulus lebih cepat.
          </p>
        </div>
        <ProductGrid products={allProducts} />
      </div>
    </section>
  );
}

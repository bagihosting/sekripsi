
import { getToolById, AiTool, iconMap } from '@/lib/plugins';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronRight, Home, Percent, Wand } from 'lucide-react';
import ProductPurchaseButton from '@/components/product-purchase-button';

type Props = {
    params: { id: string };
};

// This Server Component fetches the data.
export default async function ProductDetailPage({ params }: Props) {
  const { id } = params;
  const product = await getToolById(id);

  if (!product) {
    notFound();
  }
  
  const IconComponent = typeof product.icon === 'string' ? iconMap[product.icon] || Wand : product.icon;
  
  const productFeatures = [
      `Membantu dalam tahap ${product.category}`,
      "Didukung oleh model AI canggih",
      "Menghemat waktu pengerjaan skripsi secara signifikan"
  ];

  return (
    <div className="container max-w-screen-xl py-8 md:py-12">
        <Breadcrumbs product={product} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-6">
            <div className="w-full">
                <div className="aspect-video relative rounded-lg shadow-lg border bg-card p-4 flex items-center justify-center">
                    <IconComponent className="h-32 w-32 text-primary" />
                </div>
            </div>
            <div className="flex flex-col">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">{product.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    {product.badge && <Badge>{product.badge}</Badge>}
                </div>
                <p className="mt-4 text-lg text-foreground/80">{product.description}</p>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Kegunaan Utama:</h2>
                    <ul className="space-y-2">
                        {productFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-foreground/90">{feature}</span>
                        </li>
                        ))}
                    </ul>
                </div>
                
                {/* Client component for handling purchase logic */}
                <ProductPurchaseButton product={product} />
            </div>
        </div>
    </div>
  );
}

function Breadcrumbs({ product }: { product: AiTool }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                Home
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <Link href="/produk" className="hover:text-primary transition-colors">
                Toko Alat AI
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="font-medium text-foreground truncate">{product.title}</span>
        </nav>
    )
}

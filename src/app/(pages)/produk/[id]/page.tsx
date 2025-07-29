
'use client';

import { getToolById, AiTool, iconMap } from '@/lib/plugins';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronRight, Home, ShoppingCart, Star, Percent, Wand } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useTransition, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  params: { id: string }
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = params;
  const [product, setProduct] = useState<AiTool | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  
  const { userProfile, loading: authLoading } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchTool() {
      const tool = await getToolById(id);
      if (tool) {
        setProduct(tool);
      }
      setLoadingProduct(false);
    }
    fetchTool();
  }, [id]);

  if (loadingProduct || authLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }
  
  const IconComponent = typeof product.icon === 'string' ? iconMap[product.icon] || Wand : product.icon;
  const hasTool = userProfile?.activatedTools?.includes(product.id);
  const isFree = product.price === 0;
  const isPro = userProfile?.plan === 'pro';
  const displayPrice = isPro && !isFree ? product.price / 2 : product.price;

  const handleAction = () => {
    if (!userProfile) {
        router.push(`/login?redirect=/produk/${id}`);
        return;
    }
    if (hasTool) return; // Already have it
    if (isFree) {
        // In a real scenario, you'd have a server action to add free tools.
        // For now, we assume free tools are activated on registration.
        toast({ title: "Alat Gratis", description: "Alat ini sudah otomatis tersedia untukmu." });
    } else {
        router.push(`/upgrade/${product.id}`);
    }
  }

  const getButtonState = () => {
      if(hasTool) return { text: 'Sudah Dimiliki', disabled: true };
      if(isPending) return { text: 'Memproses...', disabled: true };
      if(isFree) return { text: 'Alat Gratis', disabled: true };
      return { text: `Beli Alat Ini - Rp ${displayPrice?.toLocaleString('id-ID')}`, disabled: false };
  }

  const { text: buttonText, disabled: isButtonDisabled } = getButtonState();

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

                <div className="mt-auto pt-8">
                     <div className="mb-4">
                        {isFree ? (
                             <p className="text-2xl font-bold text-green-600">Gratis</p>
                        ) : isPro ? (
                            <div className="flex items-center gap-3">
                                <p className="text-3xl font-bold text-primary">Rp {displayPrice.toLocaleString('id-ID')}</p>
                                <p className="text-xl font-medium text-muted-foreground line-through">Rp {product.price.toLocaleString('id-ID')}</p>
                                <Badge variant="destructive" className="flex gap-1">
                                    <Percent className="h-4 w-4" /> 50% OFF
                                </Badge>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold">Rp {displayPrice.toLocaleString('id-ID')}</p>
                        )}
                        {!isFree && !isPro && userProfile && (
                            <p className="text-sm text-muted-foreground mt-1">
                                <Link href="/harga" className="text-primary font-semibold hover:underline">Upgrade ke Pro</Link> untuk diskon 50%!
                            </p>
                        )}
                     </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="flex-1" onClick={handleAction} disabled={isButtonDisabled || authLoading}>
                            {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
                            {buttonText}
                        </Button>
                    </div>
                </div>
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

function ProductDetailSkeleton() {
    return (
        <div className="container max-w-screen-xl py-8 md:py-12">
            <Skeleton className="h-6 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-6">
                <div><Skeleton className="w-full aspect-video rounded-lg" /></div>
                <div className="flex flex-col space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                    <div className="mt-auto pt-8 space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

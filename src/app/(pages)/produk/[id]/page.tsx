
'use client';

import { getProductById, DigitalProduct } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronRight, Home, ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { activateAiTool } from '@/lib/actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type Props = {
  params: { id: string }
}

export default function ProductDetailPage({ params }: Props) {
  const id = params.id;
  const product = getProductById(id);
  const { userProfile, loading } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  if (!product) {
    notFound();
  }
  
  const hasTool = userProfile?.activatedTools?.includes(product.id);
  const canActivate = userProfile?.plan === 'pro';

  const handleActivate = () => {
    if (!userProfile) {
        router.push(`/login?redirect=/produk/${id}`);
        return;
    }
    if (!canActivate) {
        router.push('/harga');
        return;
    }

    startTransition(async () => {
        const result = await activateAiTool({ toolId: product.id });
        if(result.success) {
            toast({
                title: "Aktivasi Berhasil!",
                description: `Alat "${product.name}" sekarang tersedia di Pusat AI Anda.`
            });
            router.push('/alat-ai');
        } else {
            toast({
                title: "Aktivasi Gagal",
                description: result.error,
                variant: 'destructive'
            });
        }
    });
  }

  const getButtonState = () => {
      if(hasTool) return { text: 'Sudah Diaktifkan', disabled: true };
      if(isPending) return { text: 'Mengaktifkan...', disabled: true };
      if(!userProfile) return { text: 'Login untuk Aktivasi', disabled: false };
      if(!canActivate) return { text: 'Upgrade ke Pro untuk Aktivasi', disabled: false };
      return { text: 'Aktifkan Alat Ini (Gratis untuk Pro)', disabled: false };
  }

  const { text: buttonText, disabled: isButtonDisabled } = getButtonState();

  return (
    <div className="container max-w-screen-xl py-8 md:py-12">
        <Breadcrumbs product={product} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-6">
            <div className="w-full">
                <div className="aspect-video relative rounded-lg shadow-lg border bg-card p-4 flex items-center justify-center">
                    <product.icon className="h-32 w-32 text-primary" />
                </div>
            </div>
            <div className="flex flex-col">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    {product.badge && <Badge>{product.badge}</Badge>}
                </div>
                <p className="mt-4 text-lg text-foreground/80">{product.description}</p>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Kegunaan Utama:</h2>
                    <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-foreground/90">{feature}</span>
                        </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto pt-8">
                     <div className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span>Hanya untuk member <span className="text-primary">PRO</span></span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="flex-1" onClick={handleActivate} disabled={isButtonDisabled || loading}>
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

function Breadcrumbs({ product }: { product: DigitalProduct }) {
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
            <span className="font-medium text-foreground truncate">{product.name}</span>
        </nav>
    )
}

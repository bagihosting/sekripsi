
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AiTool } from '@/lib/plugins';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Percent, ShoppingCart } from 'lucide-react';

interface ProductPurchaseButtonProps {
    product: AiTool;
}

export default function ProductPurchaseButton({ product }: ProductPurchaseButtonProps) {
    const { userProfile, loading: authLoading } = useAuth();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    const hasTool = userProfile?.activatedTools?.includes(product.id);
    const isFree = product.price === 0;
    const isPro = userProfile?.plan === 'pro';
    const displayPrice = isPro && !isFree ? product.price / 2 : product.price;

    const handleAction = () => {
        if (!userProfile) {
            router.push(`/login?redirect=/produk/${product.id}`);
            return;
        }
        if (hasTool) return;
        if (isFree) {
            toast({ title: "Alat Gratis", description: "Alat ini sudah otomatis tersedia untukmu." });
        } else {
            router.push(`/upgrade/${product.id}`);
        }
    };

    const getButtonState = () => {
        if (authLoading) return { text: 'Memuat...', disabled: true };
        if (hasTool) return { text: 'Sudah Dimiliki', disabled: true };
        if (isPending) return { text: 'Memproses...', disabled: true };
        if (isFree) return { text: 'Alat Gratis', disabled: true };
        return { text: `Beli Alat Ini - Rp ${displayPrice?.toLocaleString('id-ID')}`, disabled: false };
    };

    const { text: buttonText, disabled: isButtonDisabled } = getButtonState();

    return (
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
                <Button size="lg" className="flex-1" onClick={handleAction} disabled={isButtonDisabled}>
                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}

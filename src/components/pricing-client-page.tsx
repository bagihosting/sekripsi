
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Check, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PricingPlan } from "@/lib/types";

interface PricingClientPageProps {
  plans: PricingPlan[];
}

export default function PricingClientPage({ plans }: PricingClientPageProps) {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleUpgradeClick = () => {
    if (!user) {
      router.push('/login?redirect=/harga');
    } else {
      // Logic for upgrade can be a server action or a redirect
      router.push('/upgrade');
    }
  };

  const getButtonText = (plan: PricingPlan) => {
    if (plan.id === 'pro') {
        if (!userProfile) return plan.buttonText || "Upgrade ke Pro";
        if (userProfile.plan === 'pro') return "Anda Sudah Pro";
        if (userProfile.paymentStatus === 'pending') return "Menunggu Konfirmasi";
        return plan.buttonText || "Upgrade ke Pro";
    }
    if (plan.id === 'free') {
        if (userProfile?.plan === 'free') return "Paket Anda Saat Ini";
        return plan.buttonText || "Mulai Gratis";
    }
    return plan.buttonText || "Hubungi Kami";
  };

  const isButtonDisabled = (plan: PricingPlan) => {
    if (plan.id === 'pro') {
        return userProfile?.plan === 'pro' || userProfile?.paymentStatus === 'pending';
    }
    if (plan.id === 'free') {
        return userProfile?.plan === 'free';
    }
    return false;
  };

  const handleAction = (plan: PricingPlan) => {
    switch (plan.actionType) {
        case 'auth_action':
            handleUpgradeClick();
            break;
        case 'link':
            if (plan.actionLink) router.push(plan.actionLink);
            break;
        case 'current':
            // No action needed for current plan
            break;
        default:
            break;
    }
  };

  const getButtonVariant = (plan: PricingPlan) => {
    if (plan.id === 'free' && userProfile?.plan === 'free') return 'outline';
    if (plan.isRecommended) return 'default';
    return 'outline';
  }


  return (
    <section id="pricing" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Investasi Terbaik untuk Kelulusanmu</h1>
          <p className="mt-4 text-lg text-foreground/70">
            Pilih paket yang paling sesuai dengan kecepatan dan kebutuhanmu. Berhenti menunda, mulai berakselerasi.
          </p>
        </div>

        <div className="grid max-w-md mx-auto grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col ${plan.isRecommended ? 'border-primary shadow-lg ring-2 ring-primary' : ''}`}>
              {plan.isRecommended && (
                <div className="py-2 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg flex items-center justify-center">
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  Rekomendasi Terbaik
                </div>
              )}
              <CardHeader className="flex-grow-0">
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.priceDescription}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                    className="w-full" 
                    variant={getButtonVariant(plan)}
                    disabled={isButtonDisabled(plan)}
                    onClick={() => handleAction(plan)}
                >
                  {getButtonText(plan)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

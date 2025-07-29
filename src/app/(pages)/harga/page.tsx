
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HargaPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleUpgradeClick = () => {
    if (!user) {
      router.push('/login?redirect=/harga');
    } else {
      router.push('/upgrade');
    }
  };

  const getButtonText = () => {
    if (!userProfile) return "Upgrade ke Pro";
    if (userProfile.plan === 'pro') return "Anda Sudah Pro";
    if (userProfile.paymentStatus === 'pending') return "Menunggu Konfirmasi";
    return "Upgrade ke Pro";
  };

  const isButtonDisabled = userProfile?.plan === 'pro' || userProfile?.paymentStatus === 'pending';


  const tiers = [
    {
      name: "Mahasiswa Gratis",
      price: "Rp 0",
      priceDescription: "selamanya",
      features: [
        "Akses ke semua 12+ alat AI",
        "Penggunaan terbatas harian",
        "Dukungan komunitas",
      ],
      buttonText: "Paket Anda Saat Ini",
      buttonVariant: "outline",
      isRecommended: false,
      isDisabled: true,
      action: () => {}
    },
    {
      name: "Pejuang Skripsi Pro",
      price: "Rp 79.000",
      priceDescription: "/bulan",
      features: [
        "Semua yang ada di paket Gratis",
        "Penggunaan tanpa batas",
        "Prioritas pemrosesan AI",
        "Akses ke fitur & alat beta",
        "Dukungan prioritas via email",
      ],
      buttonText: getButtonText(),
      buttonVariant: "default",
      isRecommended: true,
      isDisabled: isButtonDisabled,
      action: handleUpgradeClick
    },
    {
      name: "Profesor & Tim",
      price: "Hubungi Kami",
      priceDescription: "untuk demo",
      features: [
        "Semua yang ada di paket Pro",
        "Manajemen multi-akun untuk tim",
        "Analitik penggunaan",
        "Dukungan khusus",
        "Kustomisasi model AI (add-on)",
      ],
      buttonText: "Jadwalkan Demo",
      buttonVariant: "outline",
      isRecommended: false,
      isDisabled: false,
      action: () => router.push('/dukungan')
    },
  ];

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
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.isRecommended ? 'border-primary shadow-lg ring-2 ring-primary' : ''}`}>
              {tier.isRecommended && (
                <div className="py-2 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg flex items-center justify-center">
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  Rekomendasi Terbaik
                </div>
              )}
              <CardHeader className="flex-grow-0">
                <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                <CardDescription>
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.priceDescription}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                    className="w-full" 
                    variant={tier.buttonVariant as "default" | "outline"}
                    disabled={tier.isDisabled}
                    onClick={tier.action}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

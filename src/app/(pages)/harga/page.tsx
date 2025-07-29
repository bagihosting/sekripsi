
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

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
    buttonText: "Upgrade ke Pro",
    buttonVariant: "default",
    isRecommended: true,
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
  },
];

export default function HargaPage() {
  return (
    <section id="pricing" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Investasi Terbaik untuk Kelulusanmu</h1>
          <p className="mt-4 text-lg text-foreground/70">
            Pilih paket yang paling sesuai dengan kecepatan dan kebutuhanmu. Berhenti menunda, mulai berakselerasi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.isRecommended ? 'border-primary shadow-lg' : ''}`}>
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
                    disabled={tier.name === "Mahasiswa Gratis"}
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

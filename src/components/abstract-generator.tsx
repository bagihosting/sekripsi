"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { generateAbstract, AbstractGeneratorOutput } from "@/ai/flows/abstract-generator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookText, Wand2 } from "lucide-react";
import { Label } from "./ui/label";

type AbstractGeneratorState = {
  result: AbstractGeneratorOutput | null;
  error: string | null;
};

export default function AbstractGenerator() {
  const [state, setState] = useState<AbstractGeneratorState>({
    result: null,
    error: null,
  });

  async function handleAction(formData: FormData) {
    const background = formData.get("background") as string;
    const methods = formData.get("methods") as string;
    const results = formData.get("results") as string;
    const conclusion = formData.get("conclusion") as string;

    if (!background || !methods || !results || !conclusion) {
      setState({ result: null, error: "Harap isi semua bagian untuk menghasilkan abstrak." });
      return;
    }

    setState({ result: null, error: null });

    try {
      const result = await generateAbstract({ background, methods, results, conclusion });
      if (result.abstract) {
        setState({ result, error: null });
      } else {
        setState({ result: null, error: "Tidak dapat menghasilkan abstrak. Silakan coba lagi." });
      }
    } catch (e) {
      console.error(e);
      setState({ result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." });
    }
  }

  return (
    <div className="space-y-6">
      <form action={handleAction} className="space-y-4">
        <div className="grid gap-2">
            <Label htmlFor="background">Latar Belakang & Tujuan</Label>
            <Textarea
                id="background"
                name="background"
                placeholder="Jelaskan secara singkat masalah, tujuan, dan pentingnya penelitian Anda."
                rows={3}
                className="bg-background"
                required
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="methods">Metode Penelitian</Label>
            <Textarea
                id="methods"
                name="methods"
                placeholder="Sebutkan pendekatan, desain, sampel, dan teknik analisis data yang digunakan."
                rows={3}
                className="bg-background"
                required
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="results">Hasil & Temuan Utama</Label>
            <Textarea
                id="results"
                name="results"
                placeholder="Tuliskan temuan paling signifikan dan relevan dari penelitian Anda."
                rows={3}
                className="bg-background"
                required
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="conclusion">Kesimpulan & Implikasi</Label>
            <Textarea
                id="conclusion"
                name="conclusion"
                placeholder="Simpulkan hasil penelitian dan sebutkan implikasi atau kontribusinya."
                rows={3}
                className="bg-background"
                required
            />
        </div>
        
        <SubmitButton />
        {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
      </form>
      
      {state.result && (
        <div className="pt-4 space-y-4">
            <h4 className="font-headline text-xl font-semibold flex items-center">
                <BookText className="w-6 h-6 mr-2 text-primary" />
                Draf Abstrak Anda
            </h4>
            <Card className="bg-secondary/50">
                <CardContent className="p-6">
                    <p className="text-foreground/90 whitespace-pre-wrap">{state.result.abstract}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-5 w-5" />
      )}
      {pending ? "Menyusun Abstrak..." : "Buatkan Abstrak"}
    </Button>
  );
}

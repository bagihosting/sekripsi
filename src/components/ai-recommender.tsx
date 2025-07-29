"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { recommendTemplates } from "@/ai/flows/template-recommendation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";

type RecommendationState = {
  recommendations: string[] | null;
  error: string | null;
};

export default function AiRecommender() {
  const [state, setState] = useState<RecommendationState>({
    recommendations: null,
    error: null,
  });

  async function handleAction(formData: FormData) {
    const projectDescription = formData.get("projectDescription") as string;
    if (!projectDescription) {
      setState({ recommendations: null, error: "Silakan masukkan deskripsi proyek." });
      return;
    }

    setState({ recommendations: null, error: null });

    try {
      const result = await recommendTemplates({ projectDescription });
      if (result.templateRecommendations) {
        setState({ recommendations: result.templateRecommendations, error: null });
      } else {
        setState({ recommendations: null, error: "Tidak dapat memperoleh rekomendasi. Silakan coba lagi." });
      }
    } catch (e) {
      setState({ recommendations: null, error: "Terjadi kesalahan yang tidak terduga." });
    }
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div>
        <Textarea
          name="projectDescription"
          placeholder="cth., 'Saya sedang membangun portofolio modern untuk seorang fotografer, dengan gaya minimalis yang bersih dan galeri gambar yang besar.'"
          rows={5}
          className="bg-background"
          required
        />
      </div>
      <SubmitButton />
      {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
      
      {state.recommendations && (
        <div className="pt-4">
            <h4 className="font-headline text-lg font-semibold mb-2 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                Rekomendasi Kami
            </h4>
            <ul className="list-disc list-inside space-y-1 text-foreground/80">
                {state.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-5 w-5" />
      )}
      {pending ? "Menganalisis..." : "Dapatkan Rekomendasi"}
    </Button>
  );
}

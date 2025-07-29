"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { generateTitles, GenerateTitlesOutput } from "@/ai/flows/title-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, Wand2, Lightbulb } from "lucide-react";

type TitleGeneratorState = {
  result: GenerateTitlesOutput | null;
  error: string | null;
};

export default function TitleGenerator() {
  const [state, setState] = useState<TitleGeneratorState>({
    result: null,
    error: null,
  });

  async function handleAction(formData: FormData) {
    const fieldOfStudy = formData.get("fieldOfStudy") as string;
    if (!fieldOfStudy) {
      setState({ result: null, error: "Silakan masukkan bidang studi atau kata kunci." });
      return;
    }

    setState({ result: null, error: null });

    try {
      const result = await generateTitles({ fieldOfStudy });
      if (result.titles) {
        setState({ result, error: null });
      } else {
        setState({ result: null, error: "Tidak dapat menghasilkan judul. Silakan coba lagi." });
      }
    } catch (e) {
      console.error(e);
      setState({ result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." });
    }
  }

  return (
    <div className="space-y-6">
      <form action={handleAction} className="space-y-4">
        <div>
          <Input
            name="fieldOfStudy"
            placeholder="cth., 'Sistem Informasi', 'Manajemen Keuangan'"
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
                <Lightbulb className="w-6 h-6 mr-2 text-primary" />
                Ide Judul Skripsi Untukmu
            </h4>
            <div className="grid gap-4">
                {state.result.titles.map((item, index) => (
                    <Card key={index} className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                            <CardDescription className="text-foreground/80 pt-1">{item.description}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
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
      {pending ? "Mencari Inspirasi..." : "Buatkan Judul"}
    </Button>
  );
}

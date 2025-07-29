"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { findReferences, FindReferencesOutput } from "@/ai/flows/reference-finder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Library, Link as LinkIcon } from "lucide-react";

type ReferenceFinderState = {
  result: FindReferencesOutput | null;
  error: string | null;
};

export default function ReferenceFinder() {
  const [state, setState] = useState<ReferenceFinderState>({
    result: null,
    error: null,
  });

  async function handleAction(formData: FormData) {
    const topic = formData.get("topic") as string;
    if (!topic) {
      setState({ result: null, error: "Silakan masukkan topik penelitian." });
      return;
    }

    setState({ result: null, error: null });

    try {
      const result = await findReferences({ topic });
      if (result.references) {
        setState({ result, error: null });
      } else {
        setState({ result: null, error: "Tidak dapat menemukan referensi. Silakan coba lagi." });
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
            name="topic"
            placeholder="cth., 'Pengaruh AI terhadap produktivitas kerja'"
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
                <Library className="w-6 h-6 mr-2 text-primary" />
                Rekomendasi Referensi
            </h4>
            <div className="grid gap-4">
                {state.result.references.map((item, index) => (
                    <Card key={index} className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                            <CardDescription className="text-foreground/80 pt-1 text-sm">{item.author} ({item.year})</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground/90 text-sm mb-3">{item.summary}</p>
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                            >
                                <LinkIcon className="h-3.5 w-3.5" />
                                Kunjungi Sumber
                            </a>
                        </CardContent>
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
        <Library className="mr-2 h-5 w-5" />
      )}
      {pending ? "Mencari Referensi..." : "Cari Referensi"}
    </Button>
  );
}

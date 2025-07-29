"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { checkArgument, ArgumentCheckOutput } from "@/ai/flows/argument-checker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BrainCircuit, Lightbulb, MessageSquareQuote, Pencil } from "lucide-react";
import { Badge } from "./ui/badge";

const initialState: {
  result: ArgumentCheckOutput | null;
  error: string | null;
} = {
  result: null,
  error: null,
};

async function checkArgumentAction(
  prevState: any,
  formData: FormData
): Promise<{ result: ArgumentCheckOutput | null; error: string | null; }> {
  const text = formData.get("text") as string;
  if (!text) {
    return { result: null, error: "Silakan masukkan teks argumen Anda." };
  }

  try {
    const result = await checkArgument({ text });
    if (result.weaknesses) {
      return { result, error: null };
    } else {
      return { result: null, error: "Tidak dapat menganalisis teks. Silakan coba lagi." };
    }
  } catch (e) {
    console.error(e);
    return { result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." };
  }
}


export default function ArgumentChecker() {
  const [state, formAction] = useFormState(checkArgumentAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Textarea
            name="text"
            placeholder="Tempel bagian dari pembahasan atau kesimpulan Anda di sini..."
            rows={10}
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
                Hasil Analisis Argumen
            </h4>
            {state.result.weaknesses.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ditemukan kelemahan signifikan. Argumen Anda terlihat kuat!</p>
            ) : (
                <div className="grid gap-4">
                    {state.result.weaknesses.map((item, index) => (
                        <Card key={index} className="bg-secondary/50">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-start gap-3">
                                  <Badge variant="destructive" className="mt-1">Potensi Kelemahan</Badge>
                                  <span>{item.weakness}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h5 className="text-sm font-semibold flex items-center gap-2 mb-1"><MessageSquareQuote className="w-4 h-4 text-muted-foreground" /> Teks Terkait</h5>
                                    <blockquote className="border-l-2 pl-3 italic text-sm text-foreground/80">"{item.quote}"</blockquote>
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold flex items-center gap-2 mb-1"><Pencil className="w-4 h-4 text-muted-foreground" /> Saran Perbaikan</h5>
                                    <p className="text-sm text-foreground/90">{item.suggestion}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
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
        <BrainCircuit className="mr-2 h-5 w-5" />
      )}
      {pending ? "Menganalisis..." : "Periksa Argumen Saya"}
    </Button>
  );
}

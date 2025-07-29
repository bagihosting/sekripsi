"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { checkGrammar, GrammarCheckOutput } from "@/ai/flows/grammar-checker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, SpellCheck, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { diffWordsWithSpace } from 'diff';

type GrammarCheckerState = {
  result: GrammarCheckOutput | null;
  error: string | null;
  originalText: string | null;
};

function TextDiff({ text1, text2 }: { text1: string; text2: string }) {
    const differences = diffWordsWithSpace(text1, text2);
    return (
        <span>
            {differences.map((part, index) => {
                const style = part.added
                    ? { backgroundColor: 'hsl(var(--primary)/0.2)', color: 'hsl(var(--primary))', textDecoration: 'none' }
                    : part.removed
                    ? { backgroundColor: 'hsl(var(--destructive)/0.2)', color: 'hsl(var(--destructive))', textDecoration: 'line-through' }
                    : {};
                return <span key={index} style={style}>{part.value}</span>;
            })}
        </span>
    );
}

export default function GrammarChecker() {
  const [state, setState = useState < GrammarCheckerState >> ({
    result: null,
    error: null,
    originalText: null,
  });

  async function handleAction(formData: FormData) {
    const text = formData.get("originalText") as string;
    if (!text) {
      setState({ result: null, error: "Silakan masukkan teks yang ingin diperiksa.", originalText: null });
      return;
    }

    setState({ result: null, error: null, originalText: text });

    try {
      const result = await checkGrammar({ text });
      if (result.correctedText) {
        setState(prevState => ({ ...prevState, result, error: null }));
      } else {
        setState(prevState => ({ ...prevState, result: null, error: "Tidak dapat memeriksa teks. Silakan coba lagi." }));
      }
    } catch (e) {
      console.error(e);
      setState(prevState => ({ ...prevState, result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." }));
    }
  }

  return (
    <div className="space-y-6">
      <form action={handleAction} className="space-y-4">
        <div>
          <Textarea
            name="originalText"
            placeholder="Tempel tulisan Anda di sini untuk diperiksa..."
            rows={8}
            className="bg-background"
            required
          />
        </div>
        <SubmitButton />
        {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
      </form>
      
      {state.result && state.originalText && (
        <div className="pt-4 space-y-6">
          <div>
            <h4 className="font-headline text-xl font-semibold mb-2">Teks yang Diperbaiki</h4>
            <Card className="bg-secondary/30">
                <CardContent className="p-4 text-sm leading-relaxed">
                    <TextDiff text1={state.originalText} text2={state.result.correctedText} />
                </CardContent>
            </Card>
          </div>
          <div>
            <h4 className="font-headline text-xl font-semibold mb-2">Detail Koreksi</h4>
            <div className="space-y-3">
              {state.result.corrections.length > 0 ? (
                state.result.corrections.map((correction, index) => (
                  <Card key={index} className="bg-secondary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                         <Badge variant="secondary">{correction.reason}</Badge>
                      </div>
                      <div className="grid gap-1 text-sm">
                          <p className="flex items-start gap-2 text-destructive/80">
                            <XCircle className="h-4 w-4 mt-0.5 shrink-0"/> 
                            <span className="line-through">{correction.original}</span>
                          </p>
                          <p className="flex items-start gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0"/> 
                            <span>{correction.corrected}</span>
                          </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Tidak ada koreksi yang ditemukan. Tulisan Anda sudah bagus!</p>
              )}
            </div>
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
        <SpellCheck className="mr-2 h-5 w-5" />
      )}
      {pending ? "Memeriksa..." : "Periksa Tulisan Saya"}
    </Button>
  );
}

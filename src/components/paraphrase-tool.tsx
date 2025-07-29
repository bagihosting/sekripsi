"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { paraphraseText, ParaphraseTextOutput } from "@/ai/flows/paraphrase-flow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PenSquare, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type ParaphraseState = {
  result: ParaphraseTextOutput | null;
  error: string | null;
};

export default function ParaphraseTool() {
  const [state, setState] = useState<ParaphraseState>({
    result: null,
    error: null,
  });

  async function handleAction(formData: FormData) {
    const text = formData.get("originalText") as string;
    if (!text) {
      setState({ result: null, error: "Silakan masukkan teks yang ingin diubah." });
      return;
    }

    setState({ result: null, error: null });

    try {
      const result = await paraphraseText({ text });
      if (result.paraphrasedOptions) {
        setState({ result, error: null });
      } else {
        setState({ result: null, error: "Tidak dapat memproses teks. Silakan coba lagi." });
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
          <Textarea
            name="originalText"
            placeholder="Masukkan kalimat atau paragraf yang ingin Anda tulis ulang di sini..."
            rows={7}
            className="bg-background"
            required
          />
        </div>
        <SubmitButton />
        {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
      </form>
      
      {state.result && (
        <div className="pt-4 space-y-4">
            <h4 className="font-headline text-xl font-semibold">
                Hasil Parafrase
            </h4>
            <div className="grid gap-4">
                {state.result.paraphrasedOptions.map((item, index) => (
                    <ParaphraseResultCard key={index} option={item.option} focus={item.focus} />
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
        <PenSquare className="mr-2 h-5 w-5" />
      )}
      {pending ? "Memproses..." : "Tulis Ulang Sekarang"}
    </Button>
  );
}

function ParaphraseResultCard({ option, focus }: { option: string, focus: string }) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(option);
        setCopied(true);
        toast({
            description: "Teks berhasil disalin!",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="bg-secondary/50 relative group">
            <CardHeader>
                <Badge variant="secondary" className="absolute top-3 left-3">{focus}</Badge>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/90">{option}</p>
            </CardContent>
        </Card>
    );
}

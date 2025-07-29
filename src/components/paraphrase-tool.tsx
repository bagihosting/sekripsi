"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { paraphraseText, ParaphraseTextOutput } from "@/ai/flows/paraphrase-flow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PenSquare, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const initialState: {
  result: ParaphraseTextOutput | null;
  error: string | null;
} = {
  result: null,
  error: null,
};

async function paraphraseTextAction(
  prevState: any,
  formData: FormData
): Promise<{ result: ParaphraseTextOutput | null; error: string | null; }> {
  const text = formData.get("originalText") as string;
  if (!text) {
    return { result: null, error: "Silakan masukkan teks yang ingin diubah." };
  }

  try {
    const result = await paraphraseText({ text });
    if (result.paraphrasedOptions) {
      return { result, error: null };
    } else {
      return { result: null, error: "Tidak dapat memproses teks. Silakan coba lagi." };
    }
  } catch (e) {
    console.error(e);
    return { result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." };
  }
}

export default function ParaphraseTool() {
  const [state, formAction] = useActionState(paraphraseTextAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Textarea
            name="originalText"
            placeholder="Masukkan kalimat atau paragraf yang ingin Anda tulis ulang di sini..."
            rows={7}
            className="bg-background"
            required
            key={state.result ? Date.now() : 'textarea'}
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
            <div className="p-4">
                 <Badge variant="secondary" className="mb-2">{focus}</Badge>
                 <p className="text-foreground/90">{option}</p>
            </div>
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleCopy}
            >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
        </Card>
    );
}

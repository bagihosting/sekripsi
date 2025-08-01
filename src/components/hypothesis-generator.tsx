"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateHypotheses, HypothesisGeneratorOutput } from "@/ai/flows/hypothesis-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TestTubeDiagonal, Beaker } from "lucide-react";
import { Badge } from "./ui/badge";

const initialState: {
  result: HypothesisGeneratorOutput | null;
  error: string | null;
} = {
  result: null,
  error: null,
};

async function generateHypothesesAction(
  prevState: any,
  formData: FormData
): Promise<{ result: HypothesisGeneratorOutput | null; error: string | null; }> {
  const researchTopic = formData.get("researchTopic") as string;
  if (!researchTopic) {
    return { result: null, error: "Silakan masukkan topik penelitian Anda." };
  }

  try {
    const result = await generateHypotheses({ researchTopic });
    if (result.hypotheses) {
      return { result, error: null };
    } else {
      return { result: null, error: "Tidak dapat menghasilkan hipotesis. Silakan coba lagi." };
    }
  } catch (e) {
    console.error(e);
    return { result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." };
  }
}

export default function HypothesisGenerator() {
  const [state, formAction] = useActionState(generateHypothesesAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Input
            name="researchTopic"
            placeholder="cth., 'Pengaruh penggunaan media sosial terhadap prestasi akademik mahasiswa'"
            className="bg-background"
            required
            key={state.result ? Date.now() : 'input'}
          />
        </div>
        <SubmitButton />
        {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
      </form>
      
      {state.result && (
        <div className="pt-4 space-y-4">
            <h4 className="font-headline text-xl font-semibold flex items-center">
                <Beaker className="w-6 h-6 mr-2 text-primary" />
                Rancangan Hipotesis
            </h4>
            <div className="grid gap-4">
                {state.result.hypotheses.map((item, index) => (
                    <Card key={index} className="bg-secondary/50">
                        <CardHeader>
                            <Badge 
                                variant={item.type.includes('H1') ? "default" : "secondary"} 
                                className="w-fit"
                            >
                                {item.type}
                            </Badge>
                            <CardTitle className="text-lg font-semibold pt-2">{item.hypothesis}</CardTitle>
                            <CardDescription className="text-foreground/80 pt-1">{item.explanation}</CardDescription>
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
        <TestTubeDiagonal className="mr-2 h-5 w-5" />
      )}
      {pending ? "Merumuskan..." : "Buatkan Hipotesis"}
    </Button>
  );
}

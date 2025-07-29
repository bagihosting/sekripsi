"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { simulateDefense, DefenseSimulatorOutput } from "@/ai/flows/defense-simulator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldQuestion, HelpCircle } from "lucide-react";
import { Badge } from "./ui/badge";

type SimulatorState = {
  result: DefenseSimulatorOutput | null;
  error: string | null;
};

export default function DefenseSimulator() {
  const [state, setState] = useState<SimulatorState>({
    result: null,
    error: null,
  });

  async function handleAction(formData: FormData) {
    const summary = formData.get("summary") as string;
    if (!summary) {
      setState({ result: null, error: "Silakan masukkan abstrak atau ringkasan skripsi." });
      return;
    }

    setState({ result: null, error: null });

    try {
      const result = await simulateDefense({ summary });
      if (result.questions) {
        setState({ result, error: null });
      } else {
        setState({ result: null, error: "Tidak dapat menghasilkan pertanyaan. Silakan coba lagi." });
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
            name="summary"
            placeholder="Tempel abstrak atau ringkasan skripsi Anda di sini..."
            rows={8}
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
                <HelpCircle className="w-6 h-6 mr-2 text-primary" />
                Prediksi Pertanyaan Sidang
            </h4>
            <div className="grid gap-4">
                {state.result.questions.map((item, index) => (
                    <Card key={index} className="bg-secondary/50">
                        <CardContent className="p-4">
                            <Badge variant="secondary" className="mb-2">{item.focusArea}</Badge>
                            <p className="font-medium text-foreground/90">{item.question}</p>
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
        <ShieldQuestion className="mr-2 h-5 w-5" />
      )}
      {pending ? "Menganalisis..." : "Mulai Simulasi"}
    </Button>
  );
}

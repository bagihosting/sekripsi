"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { generateQuestions, QuestionGeneratorOutput } from "@/ai/flows/question-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Target, HelpCircle } from "lucide-react";
import { Badge } from "./ui/badge";

type QuestionGeneratorState = {
  result: QuestionGeneratorOutput | null;
  error: string | null;
};

export default function QuestionGenerator() {
  const [state, setState] = useState<QuestionGeneratorState>({
    result: null,
    error: null,
  });

  async function handleAction(formData: FormData) {
    const topic = formData.get("topic") as string;
    if (!topic) {
      setState({ result: null, error: "Silakan masukkan topik penelitian Anda." });
      return;
    }

    setState({ result: null, error: null });

    try {
      const result = await generateQuestions({ topic });
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
          <Input
            name="topic"
            placeholder="cth., 'Dampak kerja jarak jauh pada budaya perusahaan'"
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
                Saran Pertanyaan Penelitian
            </h4>
            <div className="grid gap-4">
                {state.result.questions.map((item, index) => (
                    <Card key={index} className="bg-secondary/50">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold">{item.question}</CardTitle>
                                <Badge variant="outline">{item.type}</Badge>
                            </div>
                            <CardDescription className="text-foreground/80 pt-2">{item.description}</CardDescription>
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
        <Target className="mr-2 h-5 w-5" />
      )}
      {pending ? "Merumuskan..." : "Buatkan Pertanyaan"}
    </Button>
  );
}

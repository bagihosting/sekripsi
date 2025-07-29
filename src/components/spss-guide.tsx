"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { guideSpssAnalysis, SpssGuideOutput } from "@/ai/flows/spss-guide";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Database, TestTube, ChevronRight, FileText, Lightbulb } from "lucide-react";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const initialState: {
  result: SpssGuideOutput | null;
  error: string | null;
} = {
  result: null,
  error: null,
};

async function spssGuideAction(
  prevState: any,
  formData: FormData
): Promise<{ result: SpssGuideOutput | null; error: string | null; }> {
  const problemDescription = formData.get("problemDescription") as string;
  if (!problemDescription) {
    return { result: null, error: "Silakan masukkan deskripsi masalah penelitian Anda." };
  }

  try {
    const result = await guideSpssAnalysis({ problemDescription });
    if (result) {
      return { result, error: null };
    } else {
      return { result: null, error: "Tidak dapat menghasilkan panduan. Silakan coba lagi." };
    }
  } catch (e) {
    console.error(e);
    return { result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." };
  }
}

export default function SpssGuide() {
  const [state, formAction] = useActionState(spssGuideAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Textarea
            name="problemDescription"
            placeholder="cth., 'Saya ingin mengetahui apakah ada perbedaan rata-rata hasil belajar antara kelompok A yang menggunakan metode X dan kelompok B yang menggunakan metode Y.'"
            rows={6}
            className="bg-background"
            required
          />
        </div>
        <SubmitButton />
        {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
      </form>
      
      {state.result && (
        <div className="pt-4 space-y-6">
            <Card className="bg-primary/5">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <TestTube className="h-6 w-6 text-primary" />
                        <h4 className="font-headline text-xl font-semibold">Rekomendasi Uji Statistik</h4>
                    </div>
                    <CardTitle className="text-2xl pt-2">{state.result.recommendedTest}</CardTitle>
                    <CardDescription className="text-foreground/80 pt-1">{state.result.testRationale}</CardDescription>
                </CardHeader>
            </Card>

            <div>
                <h4 className="font-headline text-xl font-semibold flex items-center mb-2">
                    <FileText className="w-6 h-6 mr-2 text-primary" />
                    Langkah-langkah di SPSS
                </h4>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {state.result.analysisSteps.map((step, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary">{`Langkah ${step.stepNumber}`}</Badge>
                                    <span className="font-semibold text-left">{step.stepTitle}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="whitespace-pre-wrap">{step.stepInstruction}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div>
                <h4 className="font-headline text-xl font-semibold flex items-center mb-2">
                    <Lightbulb className="w-6 h-6 mr-2 text-primary" />
                    Panduan Interpretasi Hasil
                </h4>
                <Card className="bg-secondary/50">
                    <CardContent className="p-4">
                       <p className="text-foreground/90 whitespace-pre-wrap">{state.result.interpretationGuide}</p>
                    </CardContent>
                </Card>
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
        <Database className="mr-2 h-5 w-5" />
      )}
      {pending ? "Menganalisis..." : "Dapatkan Panduan SPSS"}
    </Button>
  );
}

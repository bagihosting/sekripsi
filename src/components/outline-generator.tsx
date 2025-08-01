"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateOutline, GenerateOutlineOutput } from "@/ai/flows/outline-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, BookMarked, FileText } from "lucide-react";
import { Badge } from "./ui/badge";

const initialState: {
  result: GenerateOutlineOutput | null;
  error: string | null;
} = {
  result: null,
  error: null,
};


async function generateOutlineAction(
  prevState: any,
  formData: FormData
): Promise<{ result: GenerateOutlineOutput | null; error: string | null; }> {
  const topic = formData.get("topic") as string;
  if (!topic) {
    return { result: null, error: "Silakan masukkan topik atau judul skripsi." };
  }

  try {
    const result = await generateOutline({ topic });
    if (result.outline) {
      return { result, error: null };
    } else {
      return { result: null, error: "Tidak dapat menghasilkan kerangka. Silakan coba lagi." };
    }
  } catch (e) {
    console.error(e);
    return { result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." };
  }
}

export default function OutlineGenerator() {
  const [state, formAction] = useActionState(generateOutlineAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Input
            name="topic"
            placeholder="cth., 'Analisis Sentimen Media Sosial Terhadap...'"
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
                <FileText className="w-6 h-6 mr-2 text-primary" />
                Rancangan Kerangka Skripsi
            </h4>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {state.result.outline.map((chapter, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary">{`Bab ${index + 1}`}</Badge>
                                <span className="font-semibold">{chapter.chapterTitle.replace(/Bab \w+:\s*/, '')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="italic text-muted-foreground mb-4">{chapter.description}</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                {chapter.points.map((point, pIndex) => (
                                    <li key={pIndex}>{point}</li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
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
        <BookMarked className="mr-2 h-5 w-5" />
      )}
      {pending ? "Menyusun Kerangka..." : "Buatkan Kerangka"}
    </Button>
  );
}

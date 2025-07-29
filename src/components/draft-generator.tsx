"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateDraft, DraftGeneratorOutput } from "@/ai/flows/draft-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, FileText, Wand2 } from "lucide-react";
import { Badge } from "./ui/badge";

const initialState: {
  result: DraftGeneratorOutput | null;
  error: string | null;
} = {
  result: null,
  error: null,
};

async function generateDraftAction(
  prevState: any,
  formData: FormData
): Promise<{ result: DraftGeneratorOutput | null; error: string | null; }> {
  const topic = formData.get("topic") as string;
  if (!topic) {
    return { result: null, error: "Silakan masukkan topik atau judul skripsi Anda." };
  }

  try {
    const result = await generateDraft({ topic });
    if (result.draft) {
      return { result, error: null };
    } else {
      return { result: null, error: "Tidak dapat menghasilkan draf. Silakan coba lagi." };
    }
  } catch (e) {
    console.error(e);
    return { result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." };
  }
}

export default function DraftGenerator() {
  const [state, formAction] = useActionState(generateDraftAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Input
            name="topic"
            placeholder="Masukkan judul atau topik skripsi lengkap Anda..."
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
                <FileText className="w-6 h-6 mr-2 text-primary" />
                Draf Instan Anda (Bab 1-5 & Pustaka)
            </h4>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {state.result.draft.map((chapter, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                            <div className="flex items-center gap-3">
                                <span className="font-semibold">{chapter.chapterTitle}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                              {chapter.content}
                            </div>
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
        <Wand2 className="mr-2 h-5 w-5" />
      )}
      {pending ? "Menyusun Draf Ajaib..." : "Buatkan Draf Sekarang"}
    </Button>
  );
}

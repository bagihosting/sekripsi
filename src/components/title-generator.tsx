"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateTitles, GenerateTitlesOutput } from "@/ai/flows/title-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Wand2, Lightbulb } from "lucide-react";

const initialState: {
  result: GenerateTitlesOutput | null;
  error: string | null;
} = {
  result: null,
  error: null,
};

async function generateTitlesAction(
  prevState: any,
  formData: FormData
): Promise<{ result: GenerateTitlesOutput | null; error: string | null; }> {
  const fieldOfStudy = formData.get("fieldOfStudy") as string;
  if (!fieldOfStudy) {
    return { result: null, error: "Silakan masukkan bidang studi atau kata kunci." };
  }

  try {
    const result = await generateTitles({ fieldOfStudy });
    if (result.titles) {
      return { result, error: null };
    } else {
      return { result: null, error: "Tidak dapat menghasilkan judul. Silakan coba lagi." };
    }
  } catch (e) {
    console.error(e);
    return { result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." };
  }
}

export default function TitleGenerator() {
  const [state, formAction] = useActionState(generateTitlesAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Input
            name="fieldOfStudy"
            placeholder="cth., 'Sistem Informasi', 'Manajemen Keuangan'"
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
                <Lightbulb className="w-6 h-6 mr-2 text-primary" />
                Ide Judul Skripsi Untukmu
            </h4>
            <div className="grid gap-4">
                {state.result.titles.map((item, index) => (
                    <Card key={index} className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                            <CardDescription className="text-foreground/80 pt-1">{item.description}</CardDescription>
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
        <Wand2 className="mr-2 h-5 w-5" />
      )}
      {pending ? "Mencari Inspirasi..." : "Buatkan Judul"}
    </Button>
  );
}

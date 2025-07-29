"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { generateStory, StoryGeneratorOutput } from "@/ai/flows/story-generator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Wand } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StoryGeneratorState = {
  result: StoryGeneratorOutput | null;
  error: string | null;
};

export default function StoryGenerator() {
  const [state, setState] = useState<StoryGeneratorState>({
    result: null,
    error: null,
  });
  const { toast } = useToast();

  async function handleAction(formData: FormData) {
    const prompt = formData.get("prompt") as string;
    if (!prompt) {
      setState({ result: null, error: "Silakan masukkan ide cerita." });
      return;
    }

    setState({ result: null, error: null });

    try {
      const result = await generateStory({ prompt });
      if (result.story) {
        setState({ result, error: null });
      } else {
        setState({ result: null, error: "Tidak dapat menghasilkan cerita. Silakan coba lagi." });
        toast({
          variant: "destructive",
          title: "Gagal Menghasilkan Cerita",
          description: "Terjadi masalah saat mencoba membuat cerita. Silakan coba lagi nanti.",
        });
      }
    } catch (e) {
      console.error(e);
      setState({ result: null, error: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi." });
       toast({
          variant: "destructive",
          title: "Terjadi Kesalahan",
          description: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi.",
        });
    }
  }

  return (
    <div className="space-y-6">
      <form action={handleAction} className="space-y-4">
        <div>
          <Textarea
            name="prompt"
            placeholder="cth., 'Seorang astronot terdampar di planet yang seluruhnya terbuat dari kristal...'"
            rows={4}
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
                <BookOpen className="w-6 h-6 mr-2 text-primary" />
                Cerita Untukmu
            </h4>
            <Card className="bg-secondary/50">
                <CardContent className="p-6">
                    <p className="text-foreground/90 whitespace-pre-wrap">{state.result.story}</p>
                </CardContent>
            </Card>
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
        <Wand className="mr-2 h-5 w-5" />
      )}
      {pending ? "Menulis Cerita..." : "Buatkan Cerita"}
    </Button>
  );
}

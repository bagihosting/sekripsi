
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { requestUpgrade } from '@/lib/actions';
import { useTransition } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useParams, useRouter } from 'next/navigation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  proof: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Bukti transfer harus diunggah.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran file maksimal 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
    ),
});

export default function UpgradeForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const toolId = params.toolId as string | undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("proof");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ title: 'Error', description: 'Anda harus login untuk melakukan ini.', variant: 'destructive' });
        return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('proof', values.proof[0]);
      if (toolId) {
        formData.append('toolId', toolId);
      }
      
      const result = await requestUpgrade(formData);

      if (result?.error) {
        toast({
          title: 'Upload Gagal',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Upload Berhasil!',
          description: 'Bukti transfer Anda telah dikirim. Mohon tunggu konfirmasi dari tim kami.',
        });
        router.push('/dashboard');
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="proof"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Bukti Transfer</FormLabel>
              <FormControl>
                <Input type="file" {...fileRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Kirim Bukti Pembayaran
        </Button>
      </form>
    </Form>
  );
}

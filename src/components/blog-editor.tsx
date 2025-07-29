
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { saveBlogPost } from '@/lib/actions';
import { useTransition } from 'react';
import { Loader2, Save } from 'lucide-react';
import { BlogPost } from '@/lib/firestore';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Judul minimal 5 karakter.' }),
  content: z.string().min(50, { message: 'Konten minimal 50 karakter.' }),
  category: z.string().min(1, { message: 'Kategori harus diisi.' }),
  status: z.enum(['draft', 'published']),
  image: z.custom<FileList>().optional(),
});

interface BlogEditorProps {
  post: BlogPost | null;
  onSave: () => void;
}

export default function BlogEditor({ post, onSave }: BlogEditorProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      category: post?.category || '',
      status: post?.status || 'draft',
      image: undefined,
    },
  });

  const imageRef = form.register("image");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('category', values.category);
        formData.append('status', values.status);
        if (values.image && values.image.length > 0) {
            formData.append('image', values.image[0]);
        }
        if (post?.id) {
            formData.append('postId', post.id);
        }
        if (post?.imageUrl) {
            formData.append('currentImageUrl', post.imageUrl);
        }

        const result = await saveBlogPost(formData);

        if (result?.error) {
            toast({ title: 'Gagal Menyimpan', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Berhasil!', description: 'Artikel telah berhasil disimpan.' });
            onSave();
        }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Judul Artikel</FormLabel>
            <FormControl><Input placeholder="Judul yang menarik perhatian..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem>
                <FormLabel>Konten</FormLabel>
                <FormControl><Textarea placeholder="Tulis artikel Anda di sini..." rows={15} {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <FormControl><Input placeholder="e.g., Tips & Trik" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            
            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
        </div>

        <FormField control={form.control} name="image" render={({ field }) => (
            <FormItem>
                <FormLabel>Gambar Unggulan</FormLabel>
                {post?.imageUrl && (
                    <div className="my-2">
                        <Image src={post.imageUrl} alt="Gambar saat ini" width={200} height={120} className="rounded-md object-cover" />
                    </div>
                )}
                <FormControl><Input type="file" {...imageRef} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />

        <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isPending ? 'Menyimpan...' : 'Simpan Artikel'}
            </Button>
        </div>
      </form>
    </Form>
  );
}

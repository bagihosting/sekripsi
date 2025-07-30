
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/actions';
import { useTransition } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  displayName: z.string().min(1, { message: 'Nama lengkap tidak boleh kosong.' }),
  password: z.string().optional(),
  photo: z
    .custom<FileList>()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran file maksimal 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
    )
    .optional(),
});

interface ProfileFormProps {
  userProfile: UserProfile;
}

export default function ProfileForm({ userProfile }: ProfileFormProps) {
  const { toast } = useToast();
  const { reloadProfile } = useAuth();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: userProfile.displayName || '',
      password: '',
      photo: undefined,
    },
  });

  const fileRef = form.register("photo");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('displayName', values.displayName);
      if (values.password) {
        formData.append('password', values.password);
      }
      if (values.photo && values.photo.length > 0) {
        formData.append('photo', values.photo[0]);
      }
      
      const result = await updateUserProfile(formData);

      if (result?.error) {
        toast({
          title: 'Update Gagal',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Update Berhasil!',
          description: 'Profil Anda telah berhasil diperbarui.',
        });
        reloadProfile(); // Reload profile data from server
        form.reset({ ...form.getValues(), password: '' });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Foto Profil</FormLabel>
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={userProfile.photoURL} alt={userProfile.displayName || 'User Avatar'} />
                        <AvatarFallback>{(userProfile.displayName || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <FormControl>
                        <Input type="file" {...fileRef} />
                    </FormControl>
                </div>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap Anda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
                <Input type="email" value={userProfile.email || ''} readOnly disabled />
            </FormControl>
            <FormDescription>Email tidak dapat diubah.</FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>Kosongkan jika tidak ingin mengubah password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Simpan Perubahan
        </Button>
      </form>
    </Form>
  );
}

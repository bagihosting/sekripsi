
"use client";

import { useEffect, useState, useTransition } from 'react';
import { adminDb } from '@/lib/firebase-admin-client';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { PlusCircle, Pencil, Trash2, Loader2, BookOpen, Draft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import BlogEditor from './blog-editor';
import { deleteBlogPost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

function convertToClientBlogPost(doc: any): BlogPost {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        category: data.category,
        author: data.author,
        imageUrl: data.imageUrl,
        aiHint: data.aiHint,
        status: data.status,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
    } as BlogPost;
}


export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!adminDb) {
      setLoading(false);
      return;
    }
    const q = query(collection(adminDb, 'blogPosts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allPosts = querySnapshot.docs.map(convertToClientBlogPost);
      setPosts(allPosts);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching blog posts:", error);
        toast({title: "Gagal Memuat Artikel", description: "Tidak dapat mengambil data. Pastikan Anda memiliki izin yang benar.", variant: "destructive"});
        setLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPost(null);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
        setSelectedPost(null);
    }
    setIsDialogOpen(open);
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }
  
   if (!adminDb) {
     return (
        <Card>
        <CardHeader>
          <CardTitle>Konfigurasi Admin Diperlukan</CardTitle>
          <CardDescription>Manajemen blog memerlukan konfigurasi Firebase Admin SDK di server.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">Silakan atur variabel lingkungan FIREBASE_SERVICE_ACCOUNT_KEY untuk mengaktifkan fitur ini.</p>
        </CardContent>
      </Card>
     )
   }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manajemen Konten Blog</CardTitle>
                    <CardDescription>Buat, edit, dan kelola semua artikel blog Anda dari sini.</CardDescription>
                </div>
                <DialogTrigger asChild>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tulis Artikel Baru
                    </Button>
                </DialogTrigger>
            </CardHeader>
            <CardContent className="space-y-4">
                {posts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada artikel. Mulai tulis artikel pertamamu!</p>
                ) : (
                posts.map((post) => (
                    <PostListItem key={post.id} post={post} onEdit={handleEdit} />
                ))
                )}
            </CardContent>
        </Card>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>{selectedPost ? 'Edit Artikel' : 'Tulis Artikel Baru'}</DialogTitle>
                <DialogDescription>
                    {selectedPost ? 'Perbarui detail artikel ini.' : 'Isi form di bawah untuk membuat artikel baru.'}
                </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-auto pr-6 -mr-6">
              <BlogEditor post={selectedPost} onSave={() => setIsDialogOpen(false)} />
            </div>
        </DialogContent>
    </Dialog>
  );
}


function PostListItem({ post, onEdit }: { post: BlogPost, onEdit: (post: BlogPost) => void }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            if (!post.id) return;
            const result = await deleteBlogPost(post.id);
            if (result?.error) {
                toast({ title: "Gagal Menghapus", description: result.error, variant: 'destructive' });
            } else {
                toast({ title: "Berhasil!", description: "Artikel telah dihapus." });
            }
        });
    }

    return (
        <div className="flex flex-col sm:flex-row items-start gap-4 rounded-lg border p-4">
            <div className="flex-1 space-y-1">
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-muted-foreground">
                Kategori: {post.category} | Dibuat pada: {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status === 'published' ? <BookOpen className="h-3 w-3 mr-1.5" /> : <Draft className="h-3 w-3 mr-1.5" />}
                    {post.status}
                </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
                    <Pencil className="mr-2 h-3 w-3" /> Edit
                </Button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isPending}>
                           {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus artikel secara permanen.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Ya, Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

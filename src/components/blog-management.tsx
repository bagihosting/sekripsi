
"use client";

import { useEffect, useState, useTransition } from 'react';
import { getBlogPosts, deleteBlogPost } from '@/lib/actions';
import { BlogPost } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { PlusCircle, Pencil, Trash2, Loader2, BookOpen, FilePenLine } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import BlogEditor from './blog-editor';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    const fetchedPosts = await getBlogPosts();
    if (fetchedPosts) {
      setPosts(fetchedPosts);
    } else {
      toast({title: "Gagal Memuat Artikel", description: "Tidak dapat mengambil data. Pastikan Anda memiliki izin yang benar.", variant: "destructive"});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
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

  const handleSave = () => {
    setIsDialogOpen(false);
    fetchPosts(); // Refetch posts after saving
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
                    <PostListItem key={post.id} post={post} onEdit={handleEdit} onDeleteSuccess={fetchPosts} />
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
              <BlogEditor post={selectedPost} onSave={handleSave} />
            </div>
        </DialogContent>
    </Dialog>
  );
}


function PostListItem({ post, onEdit, onDeleteSuccess }: { post: BlogPost, onEdit: (post: BlogPost) => void, onDeleteSuccess: () => void }) {
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
                onDeleteSuccess();
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
                    {post.status === 'published' ? <BookOpen className="h-3 w-3 mr-1.5" /> : <FilePenLine className="h-3 w-3 mr-1.5" />}
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

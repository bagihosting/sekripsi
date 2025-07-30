
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import { adminDb } from "@/lib/firebase-admin";
import type { BlogPost } from "@/lib/types";
import { Timestamp } from "firebase-admin/firestore";

function processBlogPost(doc: FirebaseFirestore.DocumentSnapshot): BlogPost {
    const data = doc.data()!;
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
    const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date();

    return {
        ...data,
        id: doc.id,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
    } as BlogPost;
}


async function getBlogPosts(): Promise<BlogPost[]> {
    if (!adminDb) return [];
    const postsCollection = adminDb.collection('blogPosts');
    const q = postsCollection.where('status', '==', 'published').orderBy('createdAt', 'desc');
    const querySnapshot = await q.get();

    return querySnapshot.docs.map(processBlogPost);
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  
  if (blogPosts.length === 0) {
    return (
        <div className="container max-w-screen-xl py-12 lg:py-16 text-center">
            <h1 className="font-headline text-3xl font-bold">Blog Kami</h1>
            <p className="mt-4 text-muted-foreground">Belum ada artikel yang dipublikasikan. Silakan cek kembali nanti!</p>
        </div>
    )
  }

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);
  const editorPicks = otherPosts.slice(0, 2);
  const latestPosts = otherPosts.slice(2);

  return (
    <>
      <FeaturedPost post={featuredPost} />
      <div className="container max-w-screen-xl py-12 lg:py-16">
        {editorPicks.length > 0 && (
          <>
            <h2 className="font-headline text-3xl font-bold md:text-4xl mb-8">Pilihan Editor</h2>
            <div className="grid gap-8 md:grid-cols-2">
                {editorPicks.map(post => <HorizontalArticleCard key={post.id} post={post} />)}
            </div>
          </>
        )}

        {latestPosts.length > 0 && (
             <div className="mt-16">
                <h2 className="font-headline text-3xl font-bold md:text-4xl mb-8">Artikel Terbaru</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {latestPosts.map((post) => (
                        <ArticleCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </>
  );
}

type PostProps = {
    post: BlogPost;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

function FeaturedPost({ post }: PostProps) {
    return (
        <section className="relative flex h-[70vh] min-h-[450px] w-full items-end bg-background text-white md:h-[60vh]">
            <div className="absolute inset-0">
                <Image
                    src={post.imageUrl || "https://placehold.co/1200x600.png"}
                    alt={post.title}
                    fill
                    data-ai-hint={post.aiHint}
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            </div>
            <div className="container relative z-10 max-w-screen-xl pb-12">
                <Badge variant="secondary" className="mb-4">{post.category}</Badge>
                <h1 className="font-headline text-3xl font-bold sm:text-4xl md:text-5xl max-w-4xl">{post.title}</h1>
                <p className="mt-4 max-w-2xl text-lg text-white/80">{post.description}</p>
                 <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-white/90">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                </div>
                <Button size="lg" className="mt-6" asChild>
                    <Link href={`/blog/${post.slug}`}>
                        Baca Selengkapnya <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </section>
    )
}

function ArticleCard({ post }: PostProps) {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="aspect-video relative overflow-hidden">
            <Image
            src={post.imageUrl || "https://placehold.co/600x400.png"}
            alt={post.title}
            fill
            data-ai-hint={post.aiHint}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex-1">
            <Badge variant="secondary" className="mb-2">{post.category}</Badge>
            <h3 className="font-headline text-xl font-semibold leading-snug">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
                <User className="h-3 w-3" />
                <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.createdAt)}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HorizontalArticleCard({ post }: PostProps) {
    return (
        <Card className="group flex flex-col sm:flex-row overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
            <Link href={`/blog/${post.slug}`} className="sm:w-2/5 block flex-shrink-0">
                <div className="aspect-video sm:aspect-square relative h-full">
                    <Image
                        src={post.imageUrl || "https://placehold.co/600x400.png"}
                        alt={post.title}
                        fill
                        data-ai-hint={post.aiHint}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            </Link>
            <CardContent className="flex flex-1 flex-col p-4 justify-between sm:w-3/5">
                <div>
                    <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                    <h3 className="font-headline text-xl font-semibold leading-snug">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">{post.description}</p>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

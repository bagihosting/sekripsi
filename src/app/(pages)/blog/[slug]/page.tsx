
import { adminDb } from "@/lib/firebase-admin";
import { BlogPost } from "@/lib/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Timestamp } from "firebase-admin/firestore";

type Props = {
    params: { slug: string };
};

export async function generateStaticParams() {
    if (!adminDb) return [];
    const postsCollection = adminDb.collection('blogPosts');
    const q = postsCollection.where('status', '==', 'published');
    const postsSnapshot = await q.get();

    return postsSnapshot.docs.map(doc => ({
        slug: doc.data().slug,
    }));
}

function processBlogPost(doc: FirebaseFirestore.DocumentSnapshot): BlogPost | null {
    if (!doc.exists) return null;
    const data = doc.data()!;
    return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
    } as BlogPost;
}


async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!adminDb) return null;
    const postsCollection = adminDb.collection('blogPosts');
    const q = postsCollection.where('slug', '==', slug).limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    return processBlogPost(doc);
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        return {
            title: "Artikel Tidak Ditemukan"
        }
    }
    
    return {
        title: `${post.title} | sekripsi.com`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.createdAt,
            authors: [post.author],
            images: [
                {
                    url: post.imageUrl || "https://placehold.co/1200x600.png",
                    width: 1200,
                    height: 600,
                    alt: post.title,
                }
            ]
        }
    }
}


export default async function BlogPostPage({ params }: Props) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }
    
    const publishedDate = new Date(post.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="container max-w-screen-md py-12 lg:py-16">
            <Breadcrumbs post={post} />
            <article className="mt-8">
                <header className="mb-8">
                    <Badge variant="secondary" className="mb-4">{post.category}</Badge>
                    <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">{post.title}</h1>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{publishedDate}</span>
                        </div>
                    </div>
                </header>

                {post.imageUrl && (
                     <div className="relative aspect-video w-full mb-8">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            data-ai-hint={post.aiHint}
                            className="object-cover rounded-lg shadow-lg"
                            priority
                        />
                    </div>
                )}
                
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                </div>
            </article>
        </div>
    );
}

function Breadcrumbs({ post }: { post: BlogPost }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                Home
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <Link href="/blog" className="hover:text-primary transition-colors">
                Blog
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="font-medium text-foreground truncate">{post.title}</span>
        </nav>
    )
}

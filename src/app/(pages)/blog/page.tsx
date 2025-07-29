
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    title: "5 Kesalahan Fatal Mahasiswa Saat Mengerjakan Skripsi (Hindari No. 3!)",
    description: "Pelajari kesalahan umum yang sering menghambat kelulusan dan bagaimana cara menghindarinya agar skripsi Anda lancar jaya.",
    category: "Tips & Trik",
    author: "Tim sekripsi.com",
    date: "12 Juli 2024",
    imageUrl: "https://placehold.co/1200x600.png",
    aiHint: "student stress thesis",
    href: "#"
  },
  {
    id: 2,
    title: "Cara Memilih Judul Skripsi yang Pasti di-ACC Dosen Pembimbing",
    description: "Dapatkan strategi jitu memilih judul yang tidak hanya menarik tapi juga disukai oleh dosen, mempercepat proses bimbingan Anda.",
    category: "Panduan",
    author: "Tim sekripsi.com",
    date: "10 Juli 2024",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "student professor meeting",
    href: "#"
  },
  {
    id: 3,
    title: "Template Koding vs. Bikin dari Nol: Mana yang Lebih Cepat untuk Lulus?",
    description: "Analisis mendalam tentang untung rugi menggunakan template siap pakai dibandingkan membangun aplikasi dari awal untuk tugas akhir.",
    category: "Studi Kasus",
    author: "Tim sekripsi.com",
    date: "8 Juli 2024",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "code template vs custom",
    href: "#"
  },
  {
    id: 4,
    title: "Teknik Parafrase Anti Plagiarisme yang Wajib Kamu Kuasai",
    description: "Belajar cara mengutip dan menulis ulang sumber dengan benar agar skripsimu lolos uji plagiarisme dengan mudah.",
    category: "Akademik",
    author: "Tim sekripsi.com",
    date: "5 Juli 2024",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "writing research paper",
    href: "#"
  },
  {
    id: 5,
    title: "Rahasia Presentasi Sidang yang Memukau Penguji",
    description: "Dari desain slide hingga cara menjawab pertanyaan, kuasai semua aspek untuk tampil percaya diri saat sidang skripsi.",
    category: "Presentasi",
    author: "Tim sekripsi.com",
    date: "2 Juli 2024",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "public speaking presentation",
    href: "#"
  }
];

const featuredPost = blogPosts[0];
const otherPosts = blogPosts.slice(1);
const editorPicks = otherPosts.slice(0, 2);
const latestPosts = otherPosts.slice(2);

export default function BlogPage() {
  return (
    <>
      <FeaturedPost post={featuredPost} />
      <div className="container max-w-screen-xl py-12 lg:py-16">
        <h2 className="font-headline text-3xl font-bold md:text-4xl mb-8">Pilihan Editor</h2>
        <div className="grid gap-8 md:grid-cols-2">
            {editorPicks.map(post => <HorizontalArticleCard key={post.id} post={post} />)}
        </div>

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

function FeaturedPost({ post }: { post: typeof featuredPost }) {
    return (
        <section className="relative flex h-[70vh] min-h-[450px] w-full items-end bg-background text-white md:h-[60vh]">
            <div className="absolute inset-0">
                <Image
                    src={post.imageUrl}
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
                        <span>{post.date}</span>
                    </div>
                </div>
                <Button size="lg" className="mt-6" asChild>
                    <Link href={post.href}>
                        Baca Selengkapnya <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </section>
    )
}

function ArticleCard({ post }: { post: typeof blogPosts[number] }) {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <Link href={post.href} className="block">
        <div className="aspect-video relative overflow-hidden">
            <Image
            src={post.imageUrl}
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
                <Link href={post.href} className="hover:text-primary transition-colors">{post.title}</Link>
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
                <span>{post.date}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HorizontalArticleCard({ post }: { post: typeof blogPosts[number] }) {
    return (
        <Card className="group flex flex-col sm:flex-row overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
            <Link href={post.href} className="sm:w-2/5 block flex-shrink-0">
                <div className="aspect-video sm:aspect-square relative h-full">
                    <Image
                        src={post.imageUrl}
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
                        <Link href={post.href} className="hover:text-primary transition-colors">{post.title}</Link>
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
                        <span>{post.date}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

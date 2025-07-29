
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';

// Contoh data artikel blog
const blogPosts = [
  {
    title: "5 Kesalahan Fatal Mahasiswa Saat Mengerjakan Skripsi (Hindari No. 3!)",
    description: "Pelajari kesalahan umum yang sering menghambat kelulusan dan bagaimana cara menghindarinya agar skripsi Anda lancar jaya.",
    date: "12 Juli 2024",
    href: "#"
  },
  {
    title: "Cara Memilih Judul Skripsi yang Pasti di-ACC Dosen Pembimbing",
    description: "Dapatkan strategi jitu memilih judul yang tidak hanya menarik tapi juga disukai oleh dosen, mempercepat proses bimbingan Anda.",
    date: "10 Juli 2024",
    href: "#"
  },
  {
    title: "Template Koding vs. Bikin dari Nol: Mana yang Lebih Cepat untuk Lulus?",
    description: "Analisis mendalam tentang untung rugi menggunakan template siap pakai dibandingkan membangun aplikasi dari awal untuk tugas akhir.",
    date: "8 Juli 2024",
    href: "#"
  }
];

export default function BlogPage() {
  return (
    <section id="blog" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Wawasan Kilat untuk Pejuang Skripsi</h1>
          <p className="mt-4 text-lg text-foreground/70">
            Dapatkan tips, trik, dan strategi terbaru untuk menaklukkan tugas akhir Anda. Kami di sini untuk membantu Anda lulus lebih cepat.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Card key={index} className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="font-headline text-xl lg:text-2xl">{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground pt-2">{post.date}</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <CardDescription className="flex-grow">{post.description}</CardDescription>
                <Link href={post.href} className="group mt-4 inline-flex items-center font-semibold text-primary">
                  Baca Selengkapnya
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

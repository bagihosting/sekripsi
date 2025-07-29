
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquareHeart } from 'lucide-react';

export default function DukunganPage() {
    return (
        <section id="support" className="py-16 lg:py-24">
            <div className="container max-w-screen-xl px-4 md:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <MessageSquareHeart className="h-16 w-16 mx-auto text-accent mb-4" />
                    <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Kami di Sini untuk Membantumu</h1>
                    <p className="mt-4 text-lg text-foreground/70">
                        Punya pertanyaan, kritik, atau saran? Tim kami siap mendengarkan. Kami bukan hanya tim teknis; kami adalah teman seperjuanganmu dalam menyelesaikan skripsi. Hubungi kami!
                    </p>
                </div>
                <form className="mx-auto mt-8 max-w-2xl space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input placeholder="Nama Kamu" aria-label="Your Name" />
                        <Input type="email" placeholder="Email Kamu" aria-label="Your Email" />
                    </div>
                    <Textarea placeholder="Tulis pesan, pertanyaan, atau saranmu di sini..." rows={6} aria-label="Your Message" />
                    <div className="text-center sm:text-left">
                        <Button type="submit" size="lg">
                            <Mail className="mr-2 h-5 w-5" /> Kirim Pesan
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';

export default function DukunganPage() {
    return (
        <section id="support" className="py-16 lg:py-24">
            <div className="container max-w-screen-xl">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Tim Support Kami Siap Kawal Sampai Sidang!</h1>
                    <p className="mt-4 text-lg text-foreground/70">
                        Ada error saat instalasi? Butuh bantuan customisasi? Tim kami bukan sekadar teknisi, tapi mentor dadakan Anda. Hubungi kami, jangan biarkan error menghalangi kelulusan!
                    </p>
                </div>
                <form className="mx-auto mt-8 max-w-2xl space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input placeholder="Nama Anda" aria-label="Nama Anda" />
                        <Input type="email" placeholder="Email Anda" aria-label="Email Anda" />
                    </div>
                    <Textarea placeholder="Pertanyaan seputar skrip..." rows={6} aria-label="Pesan Anda" />
                    <div className="text-left">
                        <Button type="submit" size="lg">
                            <Mail className="mr-2 h-5 w-5" /> Kirim Pertanyaan
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

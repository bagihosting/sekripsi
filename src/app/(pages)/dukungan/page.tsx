
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';

export default function DukunganPage() {
    return (
        <section id="support" className="py-16 lg:py-24">
            <div className="container max-w-screen-xl">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Our Support Team is Ready to Help You Bloom</h1>
                    <p className="mt-4 text-lg text-foreground/70">
                        Have an error during installation? Need help with customization? Our team is more than just tech support; we're your partners in creation. Contact us and let's get you growing!
                    </p>
                </div>
                <form className="mx-auto mt-8 max-w-2xl space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input placeholder="Your Name" aria-label="Your Name" />
                        <Input type="email" placeholder="Your Email" aria-label="Your Email" />
                    </div>
                    <Textarea placeholder="Questions about our templates..." rows={6} aria-label="Your Message" />
                    <div className="text-left">
                        <Button type="submit" size="lg">
                            <Mail className="mr-2 h-5 w-5" /> Send Question
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

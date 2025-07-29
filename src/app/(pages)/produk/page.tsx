
import { getTemplates, Template } from '@/lib/data';
import TemplateGrid from '@/components/template-grid';

export default function ProdukPage() {
  const allTemplates = getTemplates();
  return (
    <section id="templates" className="w-full bg-background py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Your Digital Masterpiece Awaits</h1>
          <p className="mt-4 text-lg text-foreground/70">
            Whatever your project, we have a design for it. Explore our comprehensive collection of templates and find the perfect fit to impress your audience.
          </p>
        </div>
        <TemplateGrid templates={allTemplates} />
      </div>
    </section>
  );
}

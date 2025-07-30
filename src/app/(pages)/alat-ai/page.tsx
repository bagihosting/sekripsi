
import { getAllTools, getSession } from '@/lib/actions';
import { groupTools } from '@/lib/plugins';
import type { AiTool, UserProfile } from '@/lib/types';
import AiToolsGrid from '@/components/ai-tools-grid';
import Link from 'next/link';

export default async function AiToolsPage() {
  const allTools: AiTool[] = await getAllTools();
  const session = await getSession();
  const userProfile = session?.userProfile;
  
  let visibleTools: AiTool[];

  if (!userProfile) {
    // Show only free tools for logged-out users
    visibleTools = allTools.filter(tool => tool.price === 0);
  } else {
    // Show tools that the user has activated (free + purchased)
    visibleTools = allTools.filter(tool => userProfile.activatedTools?.includes(tool.id));
  }
  
  const toolGroups = groupTools(visibleTools);

  const pageTitle = userProfile ? "Pusat Senjata AI-mu" : "Pusat Senjata AI sekripsi.com";
  const pageDescription = userProfile 
    ? <>Butuh lebih banyak? <Link href="/produk" className="text-primary font-bold hover:underline">Kunjungi Toko Alat AI</Link> untuk menambah koleksimu.</>
    : <>Silakan <Link href="/login" className="text-primary font-bold hover:underline">login</Link> atau <Link href="/register" className="text-primary font-bold hover:underline">daftar</Link> untuk melihat semua alat yang tersedia.</>;


  return (
    <div className="container max-w-screen-xl py-12 lg:py-16">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">{pageTitle}</h1>
        <p className="mt-4 text-lg text-foreground/70">
          {pageDescription}
        </p>
      </div>
      <AiToolsGrid toolGroups={toolGroups} />
    </div>
  );
}


"use client";

import { useEffect, useState, useTransition } from 'react';
import { getAllTools } from '@/lib/actions';
import type { AiTool } from '@/lib/types';
import { iconMap } from '@/lib/plugins';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateAiTool } from '@/lib/actions';
import { Loader2, Wand } from 'lucide-react';
import { Textarea } from './ui/textarea';

export default function ProductManagement() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTools() {
      const fetchedTools = await getAllTools();
      if(fetchedTools) {
        setTools(fetchedTools);
      } else {
        toast({ title: "Gagal Memuat Alat AI", variant: "destructive" });
      }
      setLoading(false);
    }
    fetchTools();
  }, [toast]);
  
  const handleToolChange = (toolId: string, field: keyof AiTool, value: any) => {
    setTools(prevTools => 
      prevTools.map(tool => 
        tool.id === toolId ? { ...tool, [field]: value } : tool
      )
    );
  };
  
  if (loading) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Manajemen Produk AI</CardTitle>
          <CardDescription>Atur detail dan harga untuk setiap alat AI yang tersedia di toko.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
     <Card>
        <CardHeader>
          <CardTitle>Manajemen Produk AI</CardTitle>
          <CardDescription>Atur detail dan harga untuk setiap alat AI yang tersedia di toko.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map(tool => (
            <ToolEditCard 
              key={tool.id} 
              tool={tool}
              onToolChange={handleToolChange}
            />
          ))}
        </CardContent>
    </Card>
  );
}

interface ToolEditCardProps {
    tool: AiTool;
    onToolChange: (toolId: string, field: keyof AiTool, value: any) => void;
}

function ToolEditCard({ tool, onToolChange }: ToolEditCardProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    
    const IconComponent = typeof tool.icon === 'string' ? iconMap[tool.icon] || Wand : Wand;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        startTransition(async () => {
            const formData = new FormData(event.currentTarget);
            formData.append('id', tool.id);
            
            const result = await updateAiTool(formData);
            if (result.error) {
                toast({ title: "Gagal Menyimpan", description: result.error, variant: 'destructive' });
            } else {
                toast({ title: "Sukses!", description: `Alat ${tool.title} berhasil diperbarui.` });
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                    <div className="space-y-2">
                        <Label htmlFor={`title-${tool.id}`}>Judul Alat</Label>
                        <Input id={`title-${tool.id}`} name="title" value={tool.title} onChange={e => onToolChange(tool.id, 'title', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`description-${tool.id}`}>Deskripsi</Label>
                        <Textarea id={`description-${tool.id}`} name="description" value={tool.description} onChange={e => onToolChange(tool.id, 'description', e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`price-${tool.id}`}>Harga (Rp)</Label>
                        <Input id={`price-${tool.id}`} name="price" type="number" value={tool.price} onChange={e => onToolChange(tool.id, 'price', Number(e.target.value))} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simpan Perubahan
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}


"use client";

import { useEffect, useState } from 'react';
import { getPricingPlans } from '@/lib/actions';
import type { PricingPlan } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useToast } from '@/hooks/use-toast';
import { updatePricingPlan } from '@/lib/actions';
import { useTransition } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

export default function PricingManagement() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPlans() {
      const fetchedPlans = await getPricingPlans();
      if(fetchedPlans) {
        setPlans(fetchedPlans);
      } else {
        toast({ title: "Gagal Memuat Paket Harga", variant: "destructive" });
      }
      setLoading(false);
    }
    fetchPlans();
  }, [toast]);
  
  const handlePlanChange = (planId: string, field: keyof PricingPlan, value: any) => {
    setPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
  };
  
  const handleFeatureChange = (planId: string, featureIndex: number, value: string) => {
    setPlans(prevPlans => 
      prevPlans.map(plan => {
        if (plan.id === planId) {
          const newFeatures = [...plan.features];
          newFeatures[featureIndex] = value;
          return { ...plan, features: newFeatures };
        }
        return plan;
      })
    );
  };

  const removeFeature = (planId: string, featureIndex: number) => {
     setPlans(prevPlans => 
      prevPlans.map(plan => {
        if (plan.id === planId) {
          const newFeatures = plan.features.filter((_, i) => i !== featureIndex);
          return { ...plan, features: newFeatures };
        }
        return plan;
      })
    );
  }

  const addFeature = (planId: string) => {
     setPlans(prevPlans => 
      prevPlans.map(plan => {
        if (plan.id === planId) {
          return { ...plan, features: [...plan.features, ''] };
        }
        return plan;
      })
    );
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map(plan => (
        <PlanEditCard 
          key={plan.id} 
          plan={plan}
          onPlanChange={handlePlanChange}
          onFeatureChange={handleFeatureChange}
          onAddFeature={addFeature}
          onRemoveFeature={removeFeature}
        />
      ))}
    </div>
  );
}

interface PlanEditCardProps {
    plan: PricingPlan;
    onPlanChange: (planId: string, field: keyof PricingPlan, value: any) => void;
    onFeatureChange: (planId: string, featureIndex: number, value: string) => void;
    onAddFeature: (planId: string) => void;
    onRemoveFeature: (planId: string, featureIndex: number) => void;
}

function PlanEditCard({ plan, onPlanChange, onFeatureChange, onAddFeature, onRemoveFeature }: PlanEditCardProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        startTransition(async () => {
            const formData = new FormData(event.currentTarget);
            formData.append('id', plan.id);
            // Manually append features as getAll doesn't work the same in client components
            plan.features.forEach(feature => {
                if(feature) formData.append('features', feature);
            });
            
            const result = await updatePricingPlan(formData);
            if (result.error) {
                toast({ title: "Gagal Menyimpan", description: result.error, variant: 'destructive' });
            } else {
                toast({ title: "Sukses!", description: `Paket ${plan.name} berhasil diperbarui.` });
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Paket: {plan.name}</CardTitle>
                    <CardDescription>Ubah detail untuk paket ini.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`name-${plan.id}`}>Nama Paket</Label>
                        <Input id={`name-${plan.id}`} name="name" value={plan.name} onChange={e => onPlanChange(plan.id, 'name', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`price-${plan.id}`}>Harga</Label>
                        <Input id={`price-${plan.id}`} name="price" value={plan.price} onChange={e => onPlanChange(plan.id, 'price', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`desc-${plan.id}`}>Deskripsi Harga</Label>
                        <Input id={`desc-${plan.id}`} name="priceDescription" value={plan.priceDescription} onChange={e => onPlanChange(plan.id, 'priceDescription', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Fitur-fitur</Label>
                        {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input value={feature} onChange={e => onFeatureChange(plan.id, index, e.target.value)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveFeature(plan.id, index)}><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => onAddFeature(plan.id)}>Tambah Fitur</Button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id={`recommended-${plan.id}`} name="isRecommended" checked={plan.isRecommended} onCheckedChange={checked => onPlanChange(plan.id, 'isRecommended', checked)} />
                        <Label htmlFor={`recommended-${plan.id}`}>Rekomendasikan paket ini</Label>
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

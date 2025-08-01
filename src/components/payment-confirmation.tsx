
"use client";

import { useEffect, useState, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import { confirmPayment, getPendingPayments } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, ShoppingCart } from 'lucide-react';
import { Payment } from '@/lib/types';

export default function PaymentConfirmation() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    const fetchedPayments = await getPendingPayments();
    if (fetchedPayments) {
        setPayments(fetchedPayments);
    } else {
        toast({ title: "Gagal Memuat Pembayaran", description: "Tidak dapat mengambil data pembayaran. Anda mungkin tidak memiliki izin.", variant: 'destructive' });
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 30000); // Poll for new payments every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = (paymentId: string, userId: string, toolId?: string) => {
    setConfirmingId(paymentId);
    startTransition(async () => {
      const result = await confirmPayment({ paymentId, userId, toolId });
      if (result.error) {
        toast({
          title: 'Konfirmasi Gagal',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Konfirmasi Berhasil!',
          description: 'Akses pengguna telah berhasil diperbarui.',
        });
        fetchPayments(); // Refetch after confirming
      }
      setConfirmingId(null);
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Menunggu Konfirmasi Pembayaran</CardTitle>
          <CardDescription>Memuat data pembayaran yang tertunda...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Konfirmasi Pembayaran Tertunda</CardTitle>
        <CardDescription>Tinjau dan konfirmasi pembayaran dari pengguna untuk mengaktifkan akses mereka.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada pembayaran yang menunggu konfirmasi saat ini.</p>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="flex flex-col sm:flex-row items-start gap-4 rounded-lg border p-4">
              <div className="flex-1 space-y-2">
                <p className="font-medium">{payment.userEmail}</p>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {payment.type === 'tool_purchase' ? <Package className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                  <span>
                    {payment.type === 'tool_purchase' 
                      ? `Pembelian Alat: ${payment.toolName || 'N/A'}` 
                      : 'Langganan Pro'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tanggal Pengajuan: {new Date(payment.createdAt).toLocaleString('id-ID')}
                </p>
                 <Badge variant="secondary">{payment.status}</Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                 <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer">
                    <Image src={payment.proofUrl} alt="Bukti Pembayaran" width={100} height={100} className="rounded-md object-cover aspect-square"/>
                 </a>
                <Button 
                  onClick={() => handleConfirm(payment.id, payment.userId, payment.toolId)}
                  disabled={isPending && confirmingId === payment.id}
                >
                   {isPending && confirmingId === payment.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Konfirmasi Pembayaran
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

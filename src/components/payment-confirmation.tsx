"use client";

import { useEffect, useState, useTransition } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import { confirmPayment } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  status: 'pending' | 'confirmed' | 'rejected';
  proofUrl: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function PaymentConfirmation() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'payments'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pendingPayments: Payment[] = [];
      querySnapshot.forEach((doc) => {
        pendingPayments.push({ id: doc.id, ...doc.data() } as Payment);
      });
      setPayments(pendingPayments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleConfirm = (paymentId: string, userId: string) => {
    setConfirmingId(paymentId);
    startTransition(async () => {
      const result = await confirmPayment({ paymentId, userId });
      if (result.error) {
        toast({
          title: 'Konfirmasi Gagal',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Konfirmasi Berhasil!',
          description: 'Pengguna telah berhasil diupgrade ke Pro.',
        });
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
        <CardDescription>Tinjau dan konfirmasi pembayaran dari pengguna untuk mengaktifkan paket Pro mereka.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada pembayaran yang menunggu konfirmasi saat ini.</p>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="flex flex-col sm:flex-row items-start gap-4 rounded-lg border p-4">
              <div className="flex-1 space-y-1">
                <p className="font-medium">{payment.userEmail}</p>
                <p className="text-sm text-muted-foreground">
                  Tanggal Pengajuan: {new Date(payment.createdAt.seconds * 1000).toLocaleString()}
                </p>
                 <Badge variant="secondary">{payment.status}</Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                 <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer">
                    <Image src={payment.proofUrl} alt="Bukti Pembayaran" width={100} height={100} className="rounded-md object-cover aspect-square"/>
                 </a>
                <Button 
                  onClick={() => handleConfirm(payment.id, payment.userId)}
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

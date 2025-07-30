
"use client";

import { useEffect, useState } from 'react';
import { Toast, ToastDescription, ToastTitle } from '@/components/ui/toast';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AnimatePresence, motion } from "framer-motion";
import { getRecentUpgrades } from '@/lib/actions';
import { UserProfile } from '@/lib/firestore';

export type RecentUpgrade = Pick<UserProfile, 'displayName' | 'photoURL'> & {
    upgradedAt: string; // ISO string
};

export default function RecentUpgradeToast() {
  const [upgrades, setUpgrades] = useState<RecentUpgrade[]>([]);
  const [currentUpgradeIndex, setCurrentUpgradeIndex] = useState(0);

  useEffect(() => {
    const fetchUpgrades = async () => {
      const fetchedUpgrades = await getRecentUpgrades();
      setUpgrades(fetchedUpgrades);
    };

    fetchUpgrades(); // Initial fetch
    const fetchInterval = setInterval(fetchUpgrades, 30000); // Refetch every 30 seconds

    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    if (upgrades.length > 1) {
      const interval = setInterval(() => {
        setCurrentUpgradeIndex((prevIndex) => (prevIndex + 1) % upgrades.length);
      }, 5000); // Change notification every 5 seconds

      return () => clearInterval(interval);
    }
  }, [upgrades]);

  const currentUpgrade = upgrades[currentUpgradeIndex];
  
  if (!currentUpgrade) {
    return null;
  }
  
  const timeAgo = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    return "baru saja";
  };


  return (
     <div className="fixed bottom-4 left-4 z-50">
        <AnimatePresence>
            {currentUpgrade && (
                 <motion.div
                    key={currentUpgradeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <Toast variant="socialProof">
                        <div className="grid gap-1">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-accent">
                                    <AvatarImage src={currentUpgrade.photoURL} alt={currentUpgrade.displayName || 'User'} />
                                    <AvatarFallback>{(currentUpgrade.displayName || 'U').charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <ToastTitle className="flex items-center gap-1.5 text-base">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5, 5, 0] }}
                                            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3 }}
                                        >
                                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        </motion.div>
                                        Upgrade Berhasil!
                                    </ToastTitle>
                                    <ToastDescription>
                                        <span className="font-semibold">{currentUpgrade.displayName}</span> baru saja menjadi Pejuang Skripsi Pro.
                                    </ToastDescription>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {timeAgo(currentUpgrade.upgradedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Toast>
                 </motion.div>
            )}
        </AnimatePresence>
     </div>
  );
}

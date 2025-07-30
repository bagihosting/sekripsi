
import { getPricingPlans } from '@/lib/actions';
import PricingClientPage from '@/app/(pages)/harga-client-page';
import type { PricingPlan } from '@/lib/types';

export default async function HargaPage() {
  const plans = await getPricingPlans() || [];

  return <PricingClientPage plans={plans} />;
}

    
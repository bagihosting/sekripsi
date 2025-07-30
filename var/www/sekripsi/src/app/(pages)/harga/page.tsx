
import { getPricingPlans } from '@/lib/actions';
import PricingClientPage from '../harga-client-page';
import { PricingPlan } from '@/lib/types';

export default async function HargaPage() {
  const plans = await getPricingPlans() || [];

  return <PricingClientPage plans={plans} />;
}

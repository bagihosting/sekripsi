
import { getPricingPlans } from '@/lib/plans';
import PricingClientPage from './harga-client-page';

export default async function HargaPage() {
  const plans = await getPricingPlans();

  return <PricingClientPage plans={plans} />;
}

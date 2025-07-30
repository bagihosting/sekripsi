
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro';
  paymentStatus: 'none' | 'pending' | 'pro';
  createdAt: string; // ISO string on client
  upgradedAt?: string; // ISO string on client
  activatedTools: string[];
  purchasedTools: string[];
}

export interface Payment {
  id: string; // Document ID
  userId: string;
  userEmail: string;
  proofUrl: string;
  status: 'pending' | 'confirmed' | 'rejected';
  type: 'subscription' | 'tool_purchase';
  toolId?: string;
  toolName?: string;
  amount?: number;
  createdAt: string; // ISO string on client
  processedAt?: string; // ISO string on client
}

export interface PricingPlan {
    id: string; // e.g., 'free', 'pro', 'team'
    name: string;
    price: string;
    priceDescription: string;
    features: string[];
    isRecommended: boolean;
    buttonText?: string;
    actionType: 'link' | 'auth_action' | 'current';
    actionLink?: string;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: string;
  imageUrl: string;
  aiHint: string;
  status: 'published' | 'draft';
  createdAt: Date; // Date object on client
  updatedAt: Date; // Date object on client
}

export interface AiTool {
  id: string;
  icon: string; 
  title: string;
  description: string;
  href: string;
  category: string;
  badge?: string;
  price: number; // 0 for free tools
}

export interface AiToolGroup {
    title: string;
    description: string;
    tools: AiTool[];
}

export type RecentUpgrade = Pick<UserProfile, 'displayName' | 'photoURL'> & {
    upgradedAt: string; // ISO string
};

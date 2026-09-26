// 1. Supported Currencies
export type Currency = 'USD' | 'NGN';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  label: string;
  flag: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'USD', flag: '🇺🇸' },
  NGN: { code: 'NGN', symbol: '₦', label: 'NGN', flag: '🇳🇬' },
};

// 2. Project Types (Step 1 of Estimator)
export interface ProjectType {
  id: string;
  name: string;
  description: string;
  iconName: string;
  basePrice: Record<Currency, { min: number; max: number }>;
  baseWeeks: { min: number; max: number };
}

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'ai-automation',
    name: 'AI Solution & Workflow Automation',
    description: 'Custom AI bots, automated document workflows, or business process automation.',
    iconName: 'Bot',
    basePrice: {
      USD: { min: 800, max: 1600 },
      NGN: { min: 800000, max: 1600000 },
    },
    baseWeeks: { min: 2, max: 4 },
  },
  {
    id: 'business-website',
    name: 'Modern Business Website',
    description: 'Ultra-fast, high-converting responsive site tailored to turn visitors into leads.',
    iconName: 'Globe',
    basePrice: {
      USD: { min: 600, max: 1200 },
      NGN: { min: 600000, max: 1200000 },
    },
    baseWeeks: { min: 1, max: 3 },
  },
  {
    id: 'web-application',
    name: 'Full-Stack Web App / SaaS',
    description: 'Interactive dashboard, client portal, or custom software tailored to your workflow.',
    iconName: 'LayoutGrid',
    basePrice: {
      USD: { min: 1500, max: 3500 },
      NGN: { min: 1500000, max: 3500000 },
    },
    baseWeeks: { min: 4, max: 8 },
  },
  {
    id: 'mobile-app',
    name: 'Mobile App (iOS & Android)',
    description: 'Cross-platform mobile application ready for release on Apple App Store & Google Play.',
    iconName: 'Smartphone',
    basePrice: {
      USD: { min: 2000, max: 4500 },
      NGN: { min: 2000000, max: 4500000 },
    },
    baseWeeks: { min: 5, max: 10 },
  },
];

// 3. Project Stage / Complexity (Step 2 of Estimator)
export interface ProjectStage {
  id: string;
  name: string;
  description: string;
  multiplier: number; // Modifies pricing & timeline based on scale
}

export const PROJECT_STAGES: ProjectStage[] = [
  {
    id: 'mvp',
    name: 'MVP / Prototype',
    description: 'A focused, working product built rapidly to validate your idea or launch quickly.',
    multiplier: 1.0,
  },
  {
    id: 'production',
    name: 'Full-Scale Production Build',
    description: 'Complete architecture with advanced security, scaling, and deep polish.',
    multiplier: 1.5,
  },
];

// 4. Power Add-on Features (Step 3 of Estimator)
export interface FeatureAddon {
  id: string;
  name: string;
  description: string;
  price: Record<Currency, number>;
  extraWeeks: number;
}

export const FEATURE_ADDONS: FeatureAddon[] = [
  {
    id: 'ai-brain',
    name: 'AI Agent / LLM Integration',
    description: 'Smart automated reasoning, intelligent chat, or LLM-driven actions.',
    price: {
      USD: 350,
      NGN: 350000,
    },
    extraWeeks: 1,
  },
  {
    id: 'payments',
    name: 'Payment Processing & Checkout',
    description: 'Paystack, Flutterwave, or Stripe payment integration for online transactions.',
    price: {
      USD: 250,
      NGN: 250000,
    },
    extraWeeks: 1,
  },
  {
    id: 'auth-dashboard',
    name: 'User Accounts & Client Portal',
    description: 'Secure sign-in, user profiles, and private role-based dashboard access.',
    price: {
      USD: 300,
      NGN: 300000,
    },
    extraWeeks: 1,
  },
  {
    id: 'api-sync',
    name: 'Third-Party API & CRM Sync',
    description: 'Syncing data with WhatsApp alerts, Google Sheets, Airtable, or your CRM.',
    price: {
      USD: 200,
      NGN: 200000,
    },
    extraWeeks: 1,
  },
];
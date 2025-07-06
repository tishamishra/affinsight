export interface AffiliateNetwork {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  rating: number;
  reviewCount: number;
  payout: string;
  categories: string[];
  countries: string[];
  minPayout: string;
  paymentMethods: string[];
  features: string[];
  website: string;
  founded: string;
  employees: string;
}

export const networks: AffiliateNetwork[] = [
  {
    id: "1",
    name: "ClickBank",
    slug: "clickbank",
    logo: "/logos/clickbank.png",
    description: "One of the largest digital marketplaces for affiliate marketing, specializing in digital products and information products.",
    rating: 4.5,
    reviewCount: 1247,
    payout: "$50 - $200 per sale",
    categories: ["Digital Products", "Information Products", "Health", "Self-Help"],
    countries: ["USA", "UK", "Canada", "Australia"],
    minPayout: "$50",
    paymentMethods: ["Direct Deposit", "Check", "PayPal"],
    features: ["High Commission Rates", "Digital Products", "Global Reach", "Real-time Analytics"],
    website: "https://clickbank.com",
    founded: "1998",
    employees: "500+"
  },
  {
    id: "2",
    name: "AdCombo",
    slug: "adcombo",
    logo: "/logos/adcombo.png",
    description: "Performance marketing network specializing in high-converting offers across multiple verticals.",
    rating: 4.3,
    reviewCount: 892,
    payout: "$100 - $500 per lead",
    categories: ["Finance", "Insurance", "Education", "Utilities"],
    countries: ["USA", "UK", "Germany", "France"],
    minPayout: "$100",
    paymentMethods: ["Wire Transfer", "PayPal", "Skrill"],
    features: ["High Payouts", "Multiple Verticals", "Advanced Tracking", "Dedicated Support"],
    website: "https://adcombo.com",
    founded: "2012",
    employees: "200+"
  },
  {
    id: "3",
    name: "Mobidea",
    slug: "mobidea",
    logo: "/logos/mobidea.png",
    description: "Mobile performance marketing network with global reach and innovative tracking solutions.",
    rating: 4.2,
    reviewCount: 567,
    payout: "$30 - $150 per conversion",
    categories: ["Mobile", "Gaming", "Dating", "Entertainment"],
    countries: ["Worldwide"],
    minPayout: "$50",
    paymentMethods: ["Wire Transfer", "PayPal", "Payoneer"],
    features: ["Mobile-First", "Global Reach", "Real-time Optimization", "Creative Tools"],
    website: "https://mobidea.com",
    founded: "2010",
    employees: "150+"
  },
  {
    id: "4",
    name: "MaxBounty",
    slug: "maxbounty",
    logo: "/logos/maxbounty.png",
    description: "Performance-based affiliate network with exclusive offers and high commission rates.",
    rating: 4.4,
    reviewCount: 734,
    payout: "$80 - $300 per lead",
    categories: ["Finance", "Insurance", "Education", "Home Services"],
    countries: ["USA", "Canada"],
    minPayout: "$100",
    paymentMethods: ["Direct Deposit", "Check", "PayPal"],
    features: ["Exclusive Offers", "High Commissions", "Weekly Payments", "Dedicated Managers"],
    website: "https://maxbounty.com",
    founded: "2004",
    employees: "300+"
  },
  {
    id: "5",
    name: "Commission Junction",
    slug: "commission-junction",
    logo: "/logos/cj.png",
    description: "Established affiliate network with thousands of advertisers and comprehensive tracking tools.",
    rating: 4.1,
    reviewCount: 1567,
    payout: "$20 - $100 per sale",
    categories: ["Ecommerce", "Travel", "Finance", "Health"],
    countries: ["USA", "UK", "Canada", "Australia"],
    minPayout: "$50",
    paymentMethods: ["Direct Deposit", "Check", "PayPal"],
    features: ["Large Advertiser Base", "Advanced Analytics", "Multiple Verticals", "Reliable Tracking"],
    website: "https://cj.com",
    founded: "1998",
    employees: "1000+"
  },
  {
    id: "6",
    name: "ShareASale",
    slug: "shareasale",
    logo: "/logos/shareasale.png",
    description: "Merchant-focused affiliate network with excellent support and user-friendly platform.",
    rating: 4.6,
    reviewCount: 892,
    payout: "$15 - $75 per sale",
    categories: ["Ecommerce", "Fashion", "Home & Garden", "Beauty"],
    countries: ["USA", "Canada"],
    minPayout: "$50",
    paymentMethods: ["Direct Deposit", "Check", "PayPal"],
    features: ["Merchant-Friendly", "Excellent Support", "User-Friendly Platform", "Reliable Payments"],
    website: "https://shareasale.com",
    founded: "2000",
    employees: "400+"
  }
]; 
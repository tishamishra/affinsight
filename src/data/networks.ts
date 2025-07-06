export interface Network {
  id: string;
  name: string;
  website: string;
  category: string;
  rating: number;
  countries: string[];
  logo_url?: string;
  description?: string;
  commission_rate?: string;
  payment_methods?: string[];
  minimum_payout?: string;
  tracking_software?: string;
  payment_frequency?: string;
  offers_count?: number;
}

export const networks: Network[] = [
  {
    id: "1",
    name: "Amazon Associates",
    website: "https://affiliate-program.amazon.com",
    category: "E-commerce",
    rating: 4.5,
    countries: ["US", "UK", "CA", "DE", "FR", "IT", "ES", "JP"],
    logo_url: undefined,
    description: "Amazon's affiliate program offering commissions on millions of products",
    commission_rate: "1-10%",
    payment_methods: ["Direct Deposit", "Check"],
    minimum_payout: "$10",
    tracking_software: "Amazon Associates",
    payment_frequency: "Monthly",
    offers_count: 1000000
  },
  {
    id: "2",
    name: "CJ Affiliate",
    website: "https://www.cj.com",
    category: "General",
    rating: 4.2,
    countries: ["US", "UK", "CA", "AU"],
    logo_url: undefined,
    description: "One of the largest affiliate networks with diverse merchant partners",
    commission_rate: "5-25%",
    payment_methods: ["Direct Deposit", "Check", "PayPal"],
    minimum_payout: "$50",
    tracking_software: "CJ Tracking",
    payment_frequency: "Monthly",
    offers_count: 50000
  },
  {
    id: "3",
    name: "ShareASale",
    website: "https://www.shareasale.com",
    category: "General",
    rating: 4.0,
    countries: ["US", "UK", "CA"],
    logo_url: undefined,
    description: "Popular affiliate network with thousands of merchants",
    commission_rate: "5-20%",
    payment_methods: ["Direct Deposit", "Check"],
    minimum_payout: "$50",
    tracking_software: "ShareASale Platform",
    payment_frequency: "Monthly",
    offers_count: 25000
  },
  {
    id: "4",
    name: "Commission Junction",
    website: "https://www.cj.com",
    category: "General",
    rating: 4.1,
    countries: ["US", "UK", "CA"],
    logo_url: undefined,
    description: "Established affiliate network with reliable tracking",
    commission_rate: "5-30%",
    payment_methods: ["Direct Deposit", "Check"],
    minimum_payout: "$50",
    tracking_software: "CJ Tracking",
    payment_frequency: "Monthly",
    offers_count: 45000
  },
  {
    id: "5",
    name: "Awin",
    website: "https://www.awin.com",
    category: "General",
    rating: 4.3,
    countries: ["US", "UK", "DE", "FR", "IT", "ES", "NL"],
    logo_url: undefined,
    description: "Global affiliate network with strong European presence",
    commission_rate: "5-25%",
    payment_methods: ["Direct Deposit", "Check", "PayPal"],
    minimum_payout: "$20",
    tracking_software: "Awin Platform",
    payment_frequency: "Monthly",
    offers_count: 35000
  },
  {
    id: "6",
    name: "FlexOffers",
    website: "https://www.flexoffers.com",
    category: "General",
    rating: 3.9,
    countries: ["US", "UK", "CA"],
    logo_url: undefined,
    description: "Affiliate network with diverse merchant categories",
    commission_rate: "5-20%",
    payment_methods: ["Direct Deposit", "Check"],
    minimum_payout: "$50",
    tracking_software: "FlexOffers Platform",
    payment_frequency: "Monthly",
    offers_count: 15000
  }
];

export const getNetworks = () => networks;
export const getNetworkById = (id: string) => networks.find(n => n.id === id);
export const getNetworksByCategory = (category: string) => networks.filter(n => n.category === category); 
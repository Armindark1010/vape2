export const BRAND = {
  name: "NOCTURNE",
  tagline: "Objects for the quiet hours.",
  domain: "https://nocturne.example.com",
};

export const FREE_SHIPPING_THRESHOLD = 300_00; // $300
export const SHIPPING_FLAT = 15_00; // $15
export const LOW_STOCK_THRESHOLD = 10;

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "About", href: "/about" },
] as const;

export const POPULAR_SEARCHES = [
  "headphones",
  "watch",
  "speaker",
  "keyboard",
  "candle",
  "weekender",
  "lamp",
];

export const MARQUEE_ITEMS = [
  "Free shipping over $300",
  "2-year warranty on everything",
  "60-day quiet trial",
  "Carbon-neutral delivery",
  "Designed in Copenhagen",
  "Assembled in small batches",
];

export const VALUES = [
  {
    title: "Quiet by design",
    body: "No logos shouting. No unnecessary light. Every surface is chosen to disappear into a room, so the object can do its one thing, well.",
  },
  {
    title: "Materials that age",
    body: "Anodised aluminium, full-grain leather, walnut and borosilicate glass. We use things you can feel a difference in, and repair for a decade.",
  },
  {
    title: "Built for the long night",
    body: "Batteries that last weeks, firmware updated for years, and a repair programme that beats replace-and-repeat. Buy once, keep it.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Maya Lindqvist",
    role: "Product designer, Malmö",
    quote:
      "The Atlas headphones are the first pair I've stopped thinking about. They just sit in the room with me — and that's exactly the point.",
    rating: 5,
  },
  {
    name: "Daniel Osei",
    role: "Architect, London",
    quote:
      "I've bought the Meridian for two people now. The packaging alone convinced me the rest would be right. It was.",
    rating: 5,
  },
  {
    name: "Sofia Renner",
    role: "Photo editor, Berlin",
    quote:
      "Customer service replaced a strap on my weekender in a week, no questions. The bag is better for the repair. Rare.",
    rating: 5,
  },
  {
    name: "Jonas Weber",
    role: "Engineer, Zürich",
    quote:
      "The Tactile 75 is the best thing I've put on my desk in years. Understated, fast, and it disappears when you're typing.",
    rating: 4,
  },
];

export const PRODUCT_FAQS = [
  {
    q: "What is your warranty like?",
    a: "Every product carries a 2-year international warranty covering materials and workmanship. Audio products additionally carry a 2-year driver warranty. Register your order in your account and the warranty is transferable if you ever resell.",
  },
  {
    q: "How does the 60-day quiet trial work?",
    a: "Live with the product for 60 days. If it hasn't earned its place, return it in any condition for a full refund — we'll email you a prepaid label. No return forms, no restocking fee.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We ship to 40+ countries from our Copenhagen and Rotterdam warehouses. Orders over $300 ship free everywhere; otherwise a flat $15 covers delivery. Duties are pre-paid on all international orders.",
  },
  {
    q: "Can I repair my product instead of replacing it?",
    a: "That's the point. Every NOCTURNE product is serviceable — batteries, straps, drivers, keycaps, zippers. Repair pricing is published, parts are kept for at least 7 years, and most repairs are done in under 10 days.",
  },
];

export const GENERAL_FAQS = [
  {
    q: "Where do you ship?",
    a: "We currently ship to the United States, Canada, the United Kingdom, the European Union and Australia. Orders over $300 ship free; otherwise a flat $15 shipping fee applies. Delivery typically takes 2–4 business days.",
  },
  {
    q: "What is your return policy?",
    a: "You have a 60-day quiet trial on every order. If a product hasn't earned its place, send it back in any condition for a full refund. We'll issue a prepaid label within one business day of your request.",
  },
  {
    q: "How do discounts and coupons work?",
    a: "One coupon per order. Percentage coupons are applied to the merchandise subtotal before shipping; fixed coupons are deducted from the order total. Discounted products are already at their best price — no stacking, no games.",
  },
  {
    q: "How do I track my order?",
    a: "As soon as your order ships you'll receive an email with a live tracking link. You can also see the status of every order in your account under Order History at any time.",
  },
  {
    q: "Is payment secure?",
    a: "All payments are processed by our PCI-DSS Level 1 certified payment partner. We never store full card numbers — not on our servers, not in our logs, not anywhere we can read them.",
  },
  {
    q: "Do you have a repair programme?",
    a: "Yes. Every product is designed to be serviceable. Batteries, straps, drivers, keycaps and zippers are replaceable, parts are guaranteed for 7 years, and most repairs are completed in under 10 days.",
  },
];

export const FOOTER_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "New arrivals", href: "/shop?sort=newest" },
      { label: "Best sellers", href: "/shop?sort=popular" },
      { label: "Categories", href: "/categories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Admin", href: "/admin" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Order history", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" },
      { label: "Your account", href: "/account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & conditions", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export const GALLERY_IMAGES = [
  {
    src: "https://images.pexels.com/photos/27507165/pexels-photo-27507165.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Headphones on a stand",
  },
  {
    src: "https://images.pexels.com/photos/6530797/pexels-photo-6530797.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Studio speaker detail",
  },
  {
    src: "https://images.pexels.com/photos/13922272/pexels-photo-13922272.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Meridian watch under blue light",
  },
  {
    src: "https://images.pexels.com/photos/7671141/pexels-photo-7671141.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Candles on marble",
  },
  {
    src: "https://images.pexels.com/photos/20213723/pexels-photo-20213723.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Quiet workspace at night",
  },
  {
    src: "https://images.pexels.com/photos/1058959/pexels-photo-1058959.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Voyager weekender",
  },
];

export const HERO_IMAGE =
  "https://images.pexels.com/photos/10883732/pexels-photo-10883732.jpeg?auto=compress&cs=tinysrgb&w=1920";
export const HERO_FEATURE =
  "https://images.pexels.com/photos/10292805/pexels-photo-10292805.jpeg?auto=compress&cs=tinysrgb&w=900";
export const PROMO_IMAGE =
  "https://images.pexels.com/photos/2453658/pexels-photo-2453658.jpeg?auto=compress&cs=tinysrgb&w=1600";
export const ABOUT_IMAGES = [
  "https://images.pexels.com/photos/39076659/pexels-photo-39076659.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/19572930/pexels-photo-19572930.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/28786770/pexels-photo-28786770.jpeg?auto=compress&cs=tinysrgb&w=900",
];

export const DEMO_USER = {
  name: "Alex Rivera",
  email: "demo@nocturne.com",
  phone: "+1 (555) 014-2231",
  joined: "March 2024",
};

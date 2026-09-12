/* ==========================================================================
   📌 مدل سفارشات و وضعیت‌ها (Order Model - order.model.ts)
   ========================================================================== */

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'refunded';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  flavor?: string;
  nicotine?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface BestSellerItem {
  id: number;
  name: string;
  brand: string;
  category: string;
  image: string;
  unitsSold: number;
  revenue: number;
  stock: number;
  trend: number; // درصد رشد تقاضا
}

export interface DeadStockItem {
  id: number;
  name: string;
  brand: string;
  category: string;
  image: string;
  stock: number;
  unitPrice: number;
  tiedUpCapital: number; // سرمایه قفل شده (تومان)
  daysWithoutSale: number; // تعداد روز راکد بودن
  discountSuggestion: number; // درصد تخفیف پیشنهادی برای آزادسازی انبار
}

export interface CategoryBreakdown {
  key: string;
  label: string;
  icon: string;
  count: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface UrgentRestockItem {
  id: number;
  name: string;
  brand: string;
  stock: number;
  minThreshold: number;
  supplierLeadDays: number;
}

export interface ChartDataPoint {
  date: string;
  label: string;
  revenue: number; // فروش به تومان
  views: number; // بازدید کل صفحه
  abandoned: number; // بازدیدهایی که نخریدند (رها شده)
  orders: number; // سفارشات نهایی
  conversionRate: number; // نرخ تبدیل به درصد
}

export interface FunnelAnalytics {
  totalImpressions: number;
  productViews: number;
  addedToCart: number;
  completedOrders: number;
  dropOffRate: number; // نرخ ریزش سبد
}

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  todayRevenue: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  ordersGrowth: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingOrdersCount: number;
  bestSellers: BestSellerItem[];
  deadStock: DeadStockItem[];
  categoryBreakdown: CategoryBreakdown[];
  urgentRestock: UrgentRestockItem[];
  chartData7Days: ChartDataPoint[];
  chartData30Days: ChartDataPoint[];
  funnel: FunnelAnalytics;
}

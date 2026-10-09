export type CategoryId = 'ALL' | 'KEYS' | 'ASSINATURAS' | 'DESTAQUES' | 'ACAO_AVENTURA' | 'VIRAIS';

export interface Category {
  id: CategoryId;
  name: string;
  badge?: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  isSoldOut: boolean;
  deliveryType: string; // e.g. "Entrega Automática"
  description: string;
  features: string[];
  activationGuide: string;
  stockCount: number;
  badge?: string;
  gameGenre?: string;
  rating: number;
  reviewsCount: number;
  slug: string;
  accentColor?: string;
  iconName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  userId?: string;
  productId?: string;
  authorName: string;
  authorInitial: string;
  authorPhoto?: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
  verifiedPurchase: boolean;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  deliveredKeys: string[];
}

export interface Order {
  isDemo?: boolean;
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerDiscord?: string;
  paymentMethod: 'PIX' | 'CREDIT_CARD';
  total: number;
  status: 'PENDING' | 'PAID';
  createdAt: string;
  pixCode?: string;
  pixQrCodeUrl?: string;
  items: OrderItem[];
}

export interface UserAccount {
  uid?: string;
  name: string;
  email: string;
  discord?: string;
  avatar?: string;
  photoURL?: string;
  isLoggedIn: boolean;
}

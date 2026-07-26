export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductColor {
  id: string;
  colorName: string;
  hexCode: string;
}

export interface ProductSize {
  id: string;
  sizeName: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  details?: string | null;
  price: number;
  salePrice?: number | null;
  gender: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  colors: ProductColor[];
  sizes: ProductSize[];
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size?: string;
  color?: string;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "PENDING" | "AUTHORIZED" | "SUCCESS" | "FAILED" | "REFUNDED";
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  createdAt: string;
  items: OrderItem[];
}

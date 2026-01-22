// TypeScript types for the application

export type CartItem = {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  images: string[];
  category: string | null;
  inStock: boolean;
  stockQty: number;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductVariant = {
  id: string;
  productId: string;
  name: string;
  value: string;
  stockQty: number;
  createdAt: Date;
};

export type Order = {
  id: string;
  stripeSessionId: string | null;
  email: string;
  total: number;
  status: OrderStatus;
  shippingAddress: Record<string, any> | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  price: number;
  createdAt: Date;
};

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

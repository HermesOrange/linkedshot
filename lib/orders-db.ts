import { Redis } from '@upstash/redis';

export interface Order {
  id: string;
  email: string;
  package: 'basic' | 'pro';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'refunded';
  createdAt: string;
  photoCount: number;
  photos?: string[];
  resultPhotos?: string[];
  addons?: { linkedinBanner: boolean; rushDelivery: boolean };
  stripePaymentId?: string;
  notes?: string;
}

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.STORAGE_URL!,
  token: process.env.STORAGE_TOKEN!,
});

const ORDERS_KEY = 'orders:all';

// Read all orders
export async function getAllOrders(): Promise<Order[]> {
  try {
    const orders = await redis.get<Order[]>(ORDERS_KEY);
    return orders || [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
}

// Get single order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orders = await getAllOrders();
    return orders.find(o => o.id === orderId) || null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
}

// Alias for getOrderById
export const getOrder = getOrderById;

// Create new order
export async function createOrder(data: Partial<Order>): Promise<Order> {
  try {
    const orders = await getAllOrders();
    const order: Order = {
      id: data.id ?? generateOrderId(),
      email: data.email ?? '',
      package: data.package ?? 'basic',
      amount: data.amount ?? 0,
      status: data.status ?? 'pending',
      createdAt: data.createdAt ?? new Date().toISOString(),
      photoCount: data.photoCount ?? 0,
      photos: data.photos ?? [],
      resultPhotos: data.resultPhotos ?? [],
      addons: data.addons ?? { linkedinBanner: false, rushDelivery: false },
      stripePaymentId: data.stripePaymentId,
      notes: data.notes,
    };
    orders.push(order);
    await redis.set(ORDERS_KEY, orders);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Update order
export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  try {
    const orders = await getAllOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    orders[index] = { ...orders[index], ...updates };
    await redis.set(ORDERS_KEY, orders);
    return orders[index];
  } catch (error) {
    console.error('Error updating order:', error);
    return null;
  }
}

// Delete order
export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const orders = await getAllOrders();
    const filtered = orders.filter(o => o.id !== orderId);
    if (filtered.length === orders.length) return false;
    await redis.set(ORDERS_KEY, filtered);
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LS-${timestamp}-${random}`;
}

export async function getTodayStats(): Promise<{
  ordersToday: number;
  revenueToday: number;
  pending: number;
  completed: number;
}> {
  const orders = await getAllOrders();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(o => new Date(o.createdAt) >= todayStart);

  return {
    ordersToday: todayOrders.length,
    revenueToday: todayOrders
      .filter(o => o.status !== 'refunded')
      .reduce((sum, o) => sum + o.amount, 0),
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };
}

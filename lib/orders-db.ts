import fs from 'fs';
import path from 'path';
import { Order } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readOrders(): Order[] {
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(content) as Order[];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export function getAllOrders(): Order[] {
  return readOrders();
}

export function getOrderById(id: string): Order | null {
  const orders = readOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export function createOrder(data: Partial<Order>): Order {
  const orders = readOrders();
  const order: Order = {
    id: data.id ?? generateOrderId(),
    email: data.email ?? '',
    package: data.package ?? 'basic',
    addons: data.addons ?? { linkedinBanner: false, rushDelivery: false },
    total: data.total ?? 0,
    status: data.status ?? 'pending',
    createdAt: data.createdAt ?? new Date().toISOString(),
    photoCount: data.photoCount ?? 0,
    photos: data.photos ?? [],
    resultPhotos: data.resultPhotos ?? [],
    stripePaymentId: data.stripePaymentId,
    notes: data.notes,
  };
  orders.push(order);
  writeOrders(orders);
  return order;
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...updates };
  writeOrders(orders);
  return orders[index];
}

export function deleteOrder(id: string): boolean {
  const orders = readOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  writeOrders(filtered);
  return true;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LS-${timestamp}-${random}`;
}

export function getTodayStats(): {
  ordersToday: number;
  revenueToday: number;
  pending: number;
  completed: number;
} {
  const orders = readOrders();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt) >= todayStart
  );

  return {
    ordersToday: todayOrders.length,
    revenueToday: todayOrders
      .filter((o) => o.status !== 'refunded')
      .reduce((sum, o) => sum + o.total, 0),
    pending: orders.filter((o) => o.status === 'pending').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };
}

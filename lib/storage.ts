import fs from 'fs';
import path from 'path';
import { Order } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDataDir() {
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

export function createOrder(order: Order): Order {
  const orders = readOrders();
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

import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder, generateOrderId, getTodayStats } from '@/lib/orders-db';
import { Order } from '@/lib/types';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';

export async function GET(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (!adminPassword || adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized. Provide x-admin-password header.' },
        { status: 401 }
      );
    }

    const orders = await getAllOrders();  // ✅ ADDED await
    // Sort by createdAt descending
    orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const stats = await getTodayStats();  // ✅ ADDED await

    return NextResponse.json({ orders, stats });
  } catch (error) {
    console.error('GET orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      package: pkg,
      addons,
      total,
      photoCount,
      photos,
      stripePaymentId,
      paymentId,
    } = body;

    // Validation
    if (!email || !pkg || total === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: email, package, total' },
        { status: 400 }
      );
    }

    if (!['basic', 'pro'].includes(pkg)) {
      return NextResponse.json(
        { error: 'Invalid package. Must be "basic" or "pro"' },
        { status: 400 }
      );
    }

    if (typeof total !== 'number' || total < 0) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    const photoPaths: string[] = Array.isArray(photos) ? photos : [];

    const order = await createOrder({  // ✅ ADDED await
      id: generateOrderId(),
      email,
      package: pkg as 'basic' | 'pro',
      addons: {
        linkedinBanner: addons?.linkedinBanner ?? false,
        rushDelivery: addons?.rushDelivery ?? false,
      },
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      photoCount: photoCount ?? photoPaths.length,
      photos: photoPaths,
      resultPhotos: [],
      stripePaymentId: stripePaymentId ?? paymentId,
    });

    return NextResponse.json(
      { success: true, orderId: order.id, order },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
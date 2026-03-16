import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder, generateOrderId } from '@/lib/storage';
import { Order } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const orders = getAllOrders();

    // Sort by createdAt descending
    orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(orders);
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

    const newOrder: Order = {
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
      photoCount: photoCount ?? 0,
      photos: photos ?? [],
      resultPhotos: [],
      stripePaymentId,
    };

    const created = createOrder(newOrder);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('POST order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

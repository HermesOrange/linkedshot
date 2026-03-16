import { NextRequest, NextResponse } from 'next/server';
import { createOrder, generateOrderId } from '@/lib/orders-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      email,
      package: pkg,
      photos,
      addons,
      total,
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

    const order = createOrder({
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
      photoCount: photoPaths.length,
      photos: photoPaths,
      resultPhotos: [],
      stripePaymentId: paymentId,
    });

    return NextResponse.json(
      { success: true, orderId: order.id, order },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders/create error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

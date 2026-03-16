import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { getOrderById, updateOrder } from '@/lib/orders-db';

const RESULTS_BASE_DIR = path.join(process.cwd(), 'public', 'results');

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const existingOrder = getOrderById(orderId);
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No result photos uploaded' }, { status: 400 });
    }

    // Create results directory for this order
    const orderResultsDir = path.join(RESULTS_BASE_DIR, orderId);
    if (!existsSync(orderResultsDir)) {
      await mkdir(orderResultsDir, { recursive: true });
    }

    const resultPaths: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `File ${file.name} is not an image` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split('.').pop() ?? 'jpg';
      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2, 8);
      const filename = `${timestamp}-${random}.${ext}`;
      const filepath = path.join(orderResultsDir, filename);

      await writeFile(filepath, buffer);
      resultPaths.push(`/results/${orderId}/${filename}`);
    }

    // Update order: set resultPhotos and mark as completed
    const updated = updateOrder(orderId, {
      resultPhotos: resultPaths,
      status: 'completed',
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('POST upload-results error:', error);
    return NextResponse.json(
      { error: 'Failed to upload results' },
      { status: 500 }
    );
  }
}

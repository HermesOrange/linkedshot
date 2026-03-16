import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const BASE_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No photos uploaded' },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed' },
        { status: 400 }
      );
    }

    // Create a unique subdirectory for this upload batch
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const uploadDir = path.join(BASE_UPLOAD_DIR, `${timestamp}-${random}`);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedPaths: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `File ${file.name} is not an image` },
          { status: 400 }
        );
      }

      // Validate file size (20MB)
      if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 20MB limit` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split('.').pop() ?? 'jpg';
      const fileTimestamp = Date.now();
      const fileRandom = Math.random().toString(36).slice(2, 8);
      const filename = `${fileTimestamp}-${fileRandom}.${ext}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      uploadedPaths.push(`/uploads/${timestamp}-${random}/${filename}`);
    }

    return NextResponse.json({
      success: true,
      paths: uploadedPaths,
      uploadDir: `/uploads/${timestamp}-${random}`,
    });
  } catch (error) {
    console.error('Upload photos error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}

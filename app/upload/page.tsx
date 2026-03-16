'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, ChevronRight, Info } from 'lucide-react';
import Dropzone from '@/components/upload/Dropzone';
import PhotoPreview from '@/components/upload/PhotoPreview';

const uploadTips = [
  { good: true, text: 'Good lighting — face clearly visible' },
  { good: true, text: 'Looking at camera, natural expression' },
  { good: true, text: 'Multiple angles (front, slight side, 3/4 view)' },
  { good: true, text: 'Recent photos (within last 2 years)' },
  { good: false, text: 'No sunglasses or hats covering face' },
  { good: false, text: 'No group photos' },
  { good: false, text: 'No heavy filters or strong edits' },
];

const MIN_PHOTOS = 5;
const MAX_PHOTOS = 10;

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 < current
                ? 'bg-[#057642] text-white'
                : i + 1 === current
                ? 'bg-[#0A66C2] text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-0.5 w-12 transition-colors ${
                i + 1 < current ? 'bg-[#057642]' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback(
    async (files: File[]) => {
      setError(null);
      const newPhotos: string[] = [];

      for (const file of files) {
        if (photos.length + newPhotos.length >= MAX_PHOTOS) break;
        const base64 = await fileToBase64(file);
        newPhotos.push(base64);
      }

      setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
    },
    [photos.length]
  );

  const handleRemove = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleContinue = () => {
    if (photos.length < MIN_PHOTOS) {
      setError(`Please upload at least ${MIN_PHOTOS} photos to continue.`);
      return;
    }
    setIsLoading(true);

    try {
      sessionStorage.setItem('linkedshot_photos', JSON.stringify(photos));
      router.push('/select-package');
    } catch {
      setError('Failed to save photos. Please try again.');
      setIsLoading(false);
    }
  };

  const canContinue = photos.length >= MIN_PHOTOS;

  return (
    <div className="min-h-screen bg-[#F3F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-gray-900">
            Linked<span className="text-[#0A66C2]">Shot</span>
          </a>
          <StepIndicator current={1} total={3} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-[#0A66C2] font-semibold mb-2">
            <span>Step 1 of 3</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Upload Your Photos
          </h1>
          <p className="text-gray-600">
            Upload 5–10 photos of yourself. More variety = better results!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main upload area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dropzone */}
            <Dropzone
              onDrop={handleDrop}
              currentCount={photos.length}
              maxFiles={MAX_PHOTOS}
            />

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Photo counter */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                <strong className={photos.length >= MIN_PHOTOS ? 'text-[#057642]' : 'text-gray-900'}>
                  {photos.length}
                </strong>
                /{MAX_PHOTOS} photos uploaded
                {photos.length < MIN_PHOTOS && (
                  <span className="text-gray-400 ml-1">
                    (need {MIN_PHOTOS - photos.length} more)
                  </span>
                )}
              </span>
              <div className="h-2 bg-gray-200 rounded-full w-32 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    photos.length >= MIN_PHOTOS ? 'bg-[#057642]' : 'bg-[#0A66C2]'
                  }`}
                  style={{ width: `${(photos.length / MAX_PHOTOS) * 100}%` }}
                />
              </div>
            </div>

            {/* Photo previews */}
            {photos.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Your uploaded photos</h3>
                <PhotoPreview photos={photos} onRemove={handleRemove} />
              </div>
            )}

            {/* Continue button */}
            <button
              onClick={handleContinue}
              disabled={!canContinue || isLoading}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                canContinue
                  ? 'bg-[#0A66C2] text-white hover:bg-[#0855A0] shadow-md hover:shadow-lg active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Continue to Package Selection
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            {!canContinue && (
              <p className="text-center text-sm text-gray-400">
                Upload at least {MIN_PHOTOS} photos to continue
              </p>
            )}
          </div>

          {/* Tips sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-[#0A66C2]" />
                <h3 className="font-bold text-gray-900">Photo Tips</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                For best results, follow these guidelines:
              </p>
              <ul className="space-y-2.5">
                {uploadTips.map((tip) => (
                  <li key={tip.text} className="flex items-start gap-2.5 text-sm">
                    {tip.good ? (
                      <CheckCircle className="w-4 h-4 text-[#057642] flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-500 text-xs font-bold">✗</span>
                      </div>
                    )}
                    <span className={tip.good ? 'text-gray-700' : 'text-gray-500'}>
                      {tip.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#EBF3FC] rounded-2xl border border-[#D1E6F8] p-5">
              <p className="text-sm text-[#0A66C2] font-semibold mb-1">🔒 Your photos are private</p>
              <p className="text-xs text-[#0A66C2]/80">
                Encrypted end-to-end. Auto-deleted after 30 days. Never shared or used for AI training.
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
              <p className="text-sm text-[#057642] font-semibold mb-1">✓ 7-day money-back guarantee</p>
              <p className="text-xs text-green-700">
                Not happy? Get a full refund, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

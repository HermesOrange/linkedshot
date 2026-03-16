'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import Image from 'next/image';

interface PhotoPreviewProps {
  photos: string[]; // base64 data URLs
  onRemove: (index: number) => void;
}

export default function PhotoPreview({ photos, onRemove }: PhotoPreviewProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {photos.map((photo, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100 hover:border-[#0A66C2] transition-colors"
          >
            <img
              src={photo}
              alt={`Uploaded photo ${idx + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />

            {/* Action buttons */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setPreviewIndex(idx)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                title="Preview"
              >
                <ZoomIn className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(idx);
              }}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
              title="Remove"
            >
              <X className="w-3 h-3 text-white" />
            </button>

            {/* Index badge */}
            <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {idx + 1}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {previewIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setPreviewIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-lg w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[previewIndex]}
                alt={`Preview ${previewIndex + 1}`}
                className="w-full h-full object-contain rounded-2xl max-h-[70vh]"
              />
              <button
                onClick={() => setPreviewIndex(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                Photo {previewIndex + 1} of {photos.length}
              </div>

              {/* Navigation */}
              {previewIndex > 0 && (
                <button
                  onClick={() => setPreviewIndex(previewIndex - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                >
                  ←
                </button>
              )}
              {previewIndex < photos.length - 1 && (
                <button
                  onClick={() => setPreviewIndex(previewIndex + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                >
                  →
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, ImagePlus, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  currentCount: number;
  maxFiles?: number;
}

export default function Dropzone({ onDrop, currentCount, maxFiles = 10 }: DropzoneProps) {
  const remaining = maxFiles - currentCount;

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const allowed = acceptedFiles.slice(0, remaining);
      onDrop(allowed);
    },
    [onDrop, remaining]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    maxFiles: remaining,
    maxSize: 20 * 1024 * 1024,
    disabled: remaining <= 0,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200
        ${isDragActive && !isDragReject ? 'border-[#0A66C2] bg-[#EBF3FC]' : ''}
        ${isDragReject ? 'border-red-400 bg-red-50' : ''}
        ${!isDragActive && remaining > 0 ? 'border-gray-300 bg-gray-50 hover:border-[#0A66C2] hover:bg-[#EBF3FC]' : ''}
        ${remaining <= 0 ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {isDragReject ? (
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-red-600 font-semibold">Only image files are allowed</p>
        </div>
      ) : isDragActive ? (
        <div className="flex flex-col items-center gap-3">
          <div className="animate-pulse">
            <ImagePlus className="w-12 h-12 text-[#0A66C2]" />
          </div>
          <p className="text-[#0A66C2] font-semibold text-lg">Drop your photos here!</p>
        </div>
      ) : remaining <= 0 ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <p className="text-gray-600 font-semibold">Maximum photos reached ({maxFiles}/{maxFiles})</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#EBF3FC] rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-[#0A66C2]" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 mb-1">
              Drop your photos here
            </p>
            <p className="text-gray-500 text-sm">
              or <span className="text-[#0A66C2] font-semibold underline">click to browse</span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span className="bg-white border border-gray-200 rounded px-2 py-0.5">JPG</span>
            <span className="bg-white border border-gray-200 rounded px-2 py-0.5">PNG</span>
            <span className="bg-white border border-gray-200 rounded px-2 py-0.5">WEBP</span>
            <span className="bg-white border border-gray-200 rounded px-2 py-0.5">HEIC</span>
            <span className="bg-gray-50 text-gray-400 px-2 py-0.5">Max 20MB each</span>
          </div>
          <p className="text-sm text-gray-500">
            Upload up to <strong className="text-gray-700">{remaining} more photo{remaining !== 1 ? 's' : ''}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, Heart, Share2, Clock, Star, CheckCircle } from 'lucide-react';
import { Order } from '@/lib/types';

const PHOTO_STYLES = ['All', 'Office', 'Outdoor', 'Studio', 'Solid'] as const;
type StyleFilter = (typeof PHOTO_STYLES)[number];

const styleMap: Record<number, StyleFilter> = {
  0: 'Office', 1: 'Office', 2: 'Office', 3: 'Office', 4: 'Office',
  5: 'Office', 6: 'Office', 7: 'Office', 8: 'Office', 9: 'Office',
  10: 'Outdoor', 11: 'Outdoor', 12: 'Outdoor', 13: 'Outdoor', 14: 'Outdoor',
  15: 'Outdoor', 16: 'Outdoor', 17: 'Outdoor', 18: 'Outdoor', 19: 'Outdoor',
  20: 'Studio', 21: 'Studio', 22: 'Studio', 23: 'Studio', 24: 'Studio',
  25: 'Studio', 26: 'Studio', 27: 'Studio', 28: 'Studio', 29: 'Studio',
  30: 'Solid', 31: 'Solid', 32: 'Solid', 33: 'Solid', 34: 'Solid',
  35: 'Solid', 36: 'Solid', 37: 'Solid', 38: 'Solid', 39: 'Solid',
};

const bgColors = [
  'from-slate-600 to-slate-800',
  'from-blue-700 to-blue-900',
  'from-indigo-600 to-indigo-800',
  'from-gray-700 to-gray-900',
  'from-zinc-600 to-zinc-800',
  'from-emerald-700 to-emerald-900',
  'from-teal-600 to-teal-800',
  'from-cyan-700 to-cyan-900',
  'from-sky-600 to-sky-800',
  'from-violet-700 to-violet-900',
];

const emojis = ['👔', '💼', '🎯', '✨', '🏆', '💡', '🌟', '💫', '🎓', '📊'];

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const masked = local.charAt(0) + '***';
  return `${masked}@${domain}`;
}

export default function DownloadPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeFilter, setActiveFilter] = useState<StyleFilter>('All');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [satisfactionGiven, setSatisfactionGiven] = useState(false);
  const [satisfactionRating, setSatisfactionRating] = useState(0);
  const [downloadToast, setDownloadToast] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch order');
        const data: Order = await res.json();
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [orderId]);

  const handleDownloadAll = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const daysLeft = 29;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F6F8] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-10 h-10 text-[#0A66C2] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500 font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[#F3F6F8] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">
            We couldn&apos;t find order <strong className="font-mono">{orderId}</strong>. It may have expired or the link is incorrect.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-[#0A66C2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0855A0] transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const isCompleted = order.status === 'completed';
  const hasRealPhotos = isCompleted && order.resultPhotos && order.resultPhotos.length > 0;
  const totalPhotos = hasRealPhotos ? order.resultPhotos.length : (order.package === 'pro' ? 100 : 50);

  // For real photos: build photo list from resultPhotos
  // For placeholder: build placeholder grid
  const realPhotos = hasRealPhotos ? order.resultPhotos : [];

  const placeholderPhotos = Array.from({ length: totalPhotos }, (_, i) => ({
    id: i,
    style: styleMap[i] ?? 'Solid',
    bg: bgColors[i % bgColors.length],
    emoji: emojis[i % emojis.length],
  }));

  const filteredPlaceholders =
    activeFilter === 'All'
      ? placeholderPhotos
      : placeholderPhotos.filter((p) => p.style === activeFilter);

  return (
    <div className="min-h-screen bg-[#F3F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-gray-900">
            Linked<span className="text-[#0A66C2]">Shot</span>
          </a>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span>Download link valid for <strong className="text-gray-700">{daysLeft} days</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className={`flex items-center gap-2 font-semibold mb-2 ${isCompleted ? 'text-[#057642]' : 'text-yellow-600'}`}>
                <CheckCircle className="w-5 h-5" />
                <span>{isCompleted ? 'Order Complete' : `Order ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {isCompleted ? 'Your Headshots Are Ready! 🎉' : 'Your Order is Being Processed'}
              </h1>
              <p className="text-gray-600">
                Order <strong className="font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded">{order.id}</strong>
                {' · '}
                <strong>{totalPhotos} photos</strong>
                {' · '}
                <span className="text-sm">{maskEmail(order.email)}</span>
                {' · '}
                <span className="text-sm capitalize">{order.package} package</span>
              </p>
            </div>
            {isCompleted && hasRealPhotos && (
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 bg-[#0A66C2] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0855A0] transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Download className="w-4 h-4" />
                Download All (ZIP)
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Photos', value: totalPhotos.toString(), color: 'text-[#0A66C2]' },
            { label: 'Favorites', value: favorites.size.toString(), color: 'text-rose-500' },
            { label: 'Package', value: order.package === 'pro' ? 'Pro' : 'Basic', color: 'text-purple-600' },
            { label: 'Status', value: order.status.charAt(0).toUpperCase() + order.status.slice(1), color: isCompleted ? 'text-[#057642]' : 'text-yellow-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pending / Processing message */}
        {!isCompleted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8 text-center">
            <div className="text-3xl mb-3">⏳</div>
            <h3 className="font-bold text-yellow-800 text-lg mb-1">Your headshots are being generated...</h3>
            <p className="text-yellow-700 text-sm">
              Our AI is working on your photos. You&apos;ll receive an email when they&apos;re ready.
              This usually takes just a few minutes.
            </p>
          </div>
        )}

        {/* Filter tabs — only show for completed orders */}
        {isCompleted && !hasRealPhotos && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {PHOTO_STYLES.map((style) => {
              const count =
                style === 'All'
                  ? totalPhotos
                  : placeholderPhotos.filter((p) => p.style === style).length;
              return (
                <button
                  key={style}
                  onClick={() => setActiveFilter(style)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeFilter === style
                      ? 'bg-[#0A66C2] text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {style}
                  <span className={`ml-1.5 text-xs ${activeFilter === style ? 'opacity-80' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
            {favorites.size > 0 && (
              <button
                onClick={() => setActiveFilter('All')}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                Favorites ({favorites.size})
              </button>
            )}
          </div>
        )}

        {/* Real photo grid — completed with actual result photos */}
        {hasRealPhotos && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-10">
            {realPhotos.map((photoPath, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPath}
                  alt={`Headshot ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />

                {/* Download action */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={photoPath}
                    download
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-700" />
                  </a>
                </div>

                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(idx);
                  }}
                  className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${
                    favorites.has(idx)
                      ? 'bg-rose-500 opacity-100'
                      : 'bg-white/80 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      favorites.has(idx) ? 'text-white fill-white' : 'text-gray-600'
                    }`}
                  />
                </button>

                {/* Photo number */}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  #{idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Placeholder photo grid — completed but no real photos yet, or still processing */}
        {isCompleted && !hasRealPhotos && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-10">
            {filteredPlaceholders.map((photo, idx) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                className="group relative aspect-square rounded-xl overflow-hidden"
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${photo.bg} flex flex-col items-center justify-center gap-2`}
                >
                  <span className="text-3xl">{photo.emoji}</span>
                  <span className="text-white/70 text-xs font-medium">
                    {photo.style} #{photo.id + 1}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleDownloadAll}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(photo.id);
                  }}
                  className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${
                    favorites.has(photo.id)
                      ? 'bg-rose-500 opacity-100'
                      : 'bg-white/80 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      favorites.has(photo.id) ? 'text-white fill-white' : 'text-gray-600'
                    }`}
                  />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  #{photo.id + 1}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Satisfaction check */}
        {isCompleted && !satisfactionGiven && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-center"
          >
            <h3 className="font-bold text-gray-900 mb-2">How are your headshots? 😊</h3>
            <p className="text-sm text-gray-600 mb-4">Your feedback helps us improve</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSatisfactionRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= satisfactionRating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {satisfactionRating > 0 && (
              <button
                onClick={() => setSatisfactionGiven(true)}
                className="bg-[#0A66C2] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#0855A0] transition-colors text-sm"
              >
                Submit Rating
              </button>
            )}
          </motion.div>
        )}

        {satisfactionGiven && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-center">
            <CheckCircle className="w-6 h-6 text-[#057642] mx-auto mb-2" />
            <p className="text-[#057642] font-semibold">Thank you for your feedback!</p>
          </div>
        )}

        {/* Link expiry notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3 text-sm">
          <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <strong className="text-yellow-800">Download available for {daysLeft} more days.</strong>
            <span className="text-yellow-700 ml-1">
              After that, photos will be deleted for privacy. Download your favorites before then!
            </span>
          </div>
        </div>

        {/* Share section */}
        <div className="mt-6 bg-[#EBF3FC] rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="font-bold text-gray-900 mb-0.5">Love your headshots?</h4>
            <p className="text-sm text-gray-600">Share LinkedShot with a friend and both save 20%</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-[#0A66C2] font-semibold px-5 py-2.5 rounded-xl border-2 border-[#0A66C2] hover:bg-[#EBF3FC] transition-colors text-sm">
            <Share2 className="w-4 h-4" />
            Share & Save
          </button>
        </div>
      </div>

      {/* Toast */}
      {downloadToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-[#057642] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 z-50"
        >
          <Download className="w-4 h-4" />
          Preparing your ZIP download...
        </motion.div>
      )}
    </div>
  );
}

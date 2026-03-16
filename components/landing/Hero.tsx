'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Clock, Users, Zap, ChevronRight } from 'lucide-react';

const trustBadges = [
  { icon: Users, text: '500+ Malaysians', sub: 'trust LinkedShot' },
  { icon: Clock, text: '5 Minutes', sub: 'average turnaround' },
  { icon: Zap, text: '50+ Photos', sub: 'per order' },
  { icon: Shield, text: 'Money-Back', sub: 'guarantee' },
];

export default function Hero() {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#F3F6F8] via-white to-[#EBF3FC] pt-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0A66C2]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#057642]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Social proof badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-yellow-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Trusted by <strong>500+</strong> Malaysian Professionals
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              LinkedIn-Ready{' '}
              <span className="text-[#0A66C2]">Professional Headshots</span>{' '}
              in 5 Minutes
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Upload your selfies, our AI does the rest. Get{' '}
              <strong className="text-gray-900">50+ studio-quality headshots</strong> for
              your LinkedIn profile, resume, and business cards. Only{' '}
              <strong className="text-[#0A66C2]">RM79</strong> — less than a coffee photoshoot.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0855A0] transition-all duration-200 text-lg shadow-lg hover:shadow-xl active:scale-95"
              >
                Get Started – RM79
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#examples"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all duration-200 text-lg"
              >
                See Examples
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Trust badges row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trustBadges.map(({ icon: Icon, text, sub }) => (
                <div
                  key={text}
                  className="flex flex-col items-center text-center bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
                >
                  <Icon className="w-5 h-5 text-[#0A66C2] mb-1" />
                  <span className="font-bold text-sm text-gray-900">{text}</span>
                  <span className="text-xs text-gray-500">{sub}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] max-w-sm mx-auto lg:max-w-none before-after-slider select-none">
              {/* Before layer (casual) */}
              <div className="absolute inset-0">
                <div className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 mx-auto flex items-center justify-center shadow-lg">
                      <span className="text-5xl">🤳</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-amber-200 rounded w-32 mx-auto" />
                      <div className="h-3 bg-amber-100 rounded w-24 mx-auto" />
                    </div>
                    <div className="bg-amber-200/60 rounded-lg px-4 py-2 mx-4">
                      <span className="text-amber-800 font-medium text-sm">Before — Casual Selfie</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* After layer (professional) — clipped by slider */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderValue}%` }}
              >
                <div className="absolute inset-0 w-full" style={{ width: `${100 / (sliderValue / 100)}%` }}>
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 mx-auto flex items-center justify-center shadow-lg ring-4 ring-white/20">
                        <span className="text-5xl">👔</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-blue-300/40 rounded w-32 mx-auto" />
                        <div className="h-3 bg-blue-300/30 rounded w-24 mx-auto" />
                      </div>
                      <div className="bg-[#0A66C2]/80 rounded-lg px-4 py-2 mx-4">
                        <span className="text-white font-medium text-sm">After — AI Headshot</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider handle */}
              <div
                className="absolute top-0 bottom-0 z-10 pointer-events-none"
                style={{ left: `${sliderValue}%` }}
              >
                <div className="absolute inset-y-0 -left-[1.5px] w-[3px] bg-white shadow-lg" />
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-0.5 h-1 bg-gray-400 rounded-full" />
                      <div className="w-0.5 h-1.5 bg-gray-600 rounded-full" />
                      <div className="w-0.5 h-1 bg-gray-400 rounded-full" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="w-0.5 h-1 bg-gray-400 rounded-full" />
                      <div className="w-0.5 h-1.5 bg-gray-600 rounded-full" />
                      <div className="w-0.5 h-1 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Invisible range input */}
              <input
                type="range"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
              />

              {/* Labels */}
              <div className="absolute bottom-4 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-md pointer-events-none z-10">
                BEFORE
              </div>
              <div className="absolute bottom-4 right-3 bg-[#0A66C2] text-white text-xs font-semibold px-2 py-1 rounded-md pointer-events-none z-10">
                AFTER
              </div>

              {/* Drag hint */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full pointer-events-none z-10 backdrop-blur-sm">
                ← Drag to compare →
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -left-6 top-1/3 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100 hidden lg:block"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">50+ Photos</div>
                  <div className="text-xs text-gray-500">Generated</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              className="absolute -right-6 bottom-1/4 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100 hidden lg:block"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#EBF3FC] rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#0A66C2]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">5 Minutes</div>
                  <div className="text-xs text-gray-500">Turnaround</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-12 border-t border-gray-200"
        >
          <p className="text-center text-sm text-gray-500 mb-6 font-medium tracking-wide uppercase">
            Trusted by professionals from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-50">
            {['Maybank', 'Petronas', 'CIMB', 'Grab Malaysia', 'TM', 'AirAsia'].map((company) => (
              <span key={company} className="font-bold text-lg text-gray-600">
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

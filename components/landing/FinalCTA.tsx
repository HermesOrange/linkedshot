'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Clock, Star } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0A66C2] via-[#0855A0] to-[#06437E] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Stars */}
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            Your Best LinkedIn Photo is{' '}
            <span className="text-yellow-300">5 Minutes Away</span>
          </h2>

          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 500+ Malaysian professionals who upgraded their LinkedIn presence with AI-powered headshots. Starting at just RM79.
          </p>

          {/* CTA Button */}
          <Link
            href="/upload"
            className="inline-flex items-center gap-3 bg-white text-[#0A66C2] font-black px-10 py-5 rounded-2xl text-xl hover:bg-blue-50 transition-all duration-200 shadow-2xl hover:shadow-white/20 active:scale-95 group"
          >
            Get Your Headshots – RM79
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Trust text */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <Shield className="w-4 h-4 text-green-400" />
              7-day money-back guarantee
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <Clock className="w-4 h-4 text-yellow-400" />
              Results in 5 minutes
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <span className="text-green-400">🔒</span>
              Secure payment
            </div>
          </div>

          {/* Secondary text */}
          <p className="mt-6 text-blue-200 text-sm">
            No subscription required · One-time payment · Download immediately
          </p>
        </motion.div>
      </div>
    </section>
  );
}

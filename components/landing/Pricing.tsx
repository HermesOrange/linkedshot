'use client';

import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
import Link from 'next/link';

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 79,
    photos: 50,
    turnaround: '5–10 minutes',
    popular: true,
    badge: 'Most Popular',
    features: [
      '50 AI-generated headshots',
      '5 background styles',
      'Full HD resolution',
      'LinkedIn-optimized crops',
      'Commercial usage rights',
      'Email delivery',
      '7-day money-back guarantee',
    ],
    notIncluded: ['LinkedIn banner image', 'Rush delivery (< 5 min)'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 149,
    photos: 100,
    turnaround: '3–5 minutes',
    popular: false,
    badge: 'Best Value',
    features: [
      '100 AI-generated headshots',
      '10+ background styles',
      'Full HD + 4K resolution',
      'LinkedIn-optimized crops',
      'Commercial usage rights',
      'Priority email delivery',
      '7-day money-back guarantee',
      'LinkedIn banner image (+RM30 value)',
      'Rush delivery included',
      'Priority support',
    ],
    notIncluded: [],
  },
];

const paymentMethods = ['Visa', 'Mastercard', 'FPX', 'GrabPay', 'TNG eWallet', 'Maybank2u'];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No subscriptions. No hidden fees. One-time payment, own your photos forever.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className={`relative rounded-2xl border-2 overflow-hidden ${
                pkg.popular
                  ? 'border-[#0A66C2] shadow-xl shadow-[#0A66C2]/10'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {/* Badge */}
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-[#0A66C2] text-white text-center text-sm font-bold py-2 flex items-center justify-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                  {pkg.badge}
                  <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                </div>
              )}
              {!pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center text-sm font-bold py-2 flex items-center justify-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                  {pkg.badge}
                </div>
              )}

              <div className={`p-8 ${pkg.popular ? 'pt-14' : 'pt-14'}`}>
                {/* Price */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900">RM{pkg.price}</span>
                    <span className="text-gray-500 text-sm">/ one-time</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="font-semibold text-[#0A66C2]">{pkg.photos} photos</span>
                    <span>•</span>
                    <span>{pkg.turnaround}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/upload?package=${pkg.id}`}
                  className={`flex items-center justify-center w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 mb-6 active:scale-95 ${
                    pkg.popular
                      ? 'bg-[#0A66C2] text-white hover:bg-[#0855A0] shadow-md'
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
                  }`}
                >
                  Get Started – RM{pkg.price}
                </Link>

                {/* Features */}
                <ul className="space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#057642]" strokeWidth={3} />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {pkg.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm opacity-40">
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-gray-400 text-xs">−</span>
                      </div>
                      <span className="text-gray-500 line-through">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment methods */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-gray-500 mb-3">Secure payment via:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            🔒 256-bit SSL encryption · All payments processed securely
          </p>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const rows = [
  { feature: 'Price', linkedshot: 'RM79 one-time', traditional: 'RM500–RM2,000+' },
  { feature: 'Turnaround time', linkedshot: '5–10 minutes', traditional: '1–2 weeks' },
  { feature: 'Number of photos', linkedshot: '50+ styles', traditional: '10–20 edits' },
  { feature: 'Reschedule hassle', linkedshot: true, traditional: false },
  { feature: 'Travel required', linkedshot: true, traditional: false },
  { feature: 'Multiple backgrounds', linkedshot: true, traditional: false },
  { feature: 'Available 24/7', linkedshot: true, traditional: false },
  { feature: 'Money-back guarantee', linkedshot: true, traditional: false },
  { feature: 'HD download', linkedshot: true, traditional: true },
];

export default function ComparisonTable() {
  return (
    <section className="py-20 bg-[#F3F6F8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            LinkedShot vs Traditional Photographer
          </h2>
          <p className="text-lg text-gray-600">
            Why pay thousands and wait weeks when AI can do it better?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
            <div className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Feature
            </div>
            <div className="px-6 py-4 text-center bg-[#0A66C2] text-white">
              <span className="text-sm font-bold uppercase tracking-wide">LinkedShot AI</span>
              <div className="text-xs opacity-80 mt-0.5">RM79</div>
            </div>
            <div className="px-6 py-4 text-center">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Traditional
              </span>
              <div className="text-xs text-gray-400 mt-0.5">RM500+</div>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, idx) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 border-b border-gray-50 last:border-0 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <div className="px-6 py-4 text-sm font-medium text-gray-700 flex items-center">
                {row.feature}
              </div>
              <div className="px-6 py-4 flex items-center justify-center bg-[#EBF3FC]/30">
                {typeof row.linkedshot === 'boolean' ? (
                  row.linkedshot ? (
                    <div className="w-6 h-6 bg-[#057642] rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-red-500" strokeWidth={3} />
                    </div>
                  )
                ) : (
                  <span className="text-sm font-semibold text-[#0A66C2]">
                    {row.linkedshot}
                  </span>
                )}
              </div>
              <div className="px-6 py-4 flex items-center justify-center">
                {typeof row.traditional === 'boolean' ? (
                  row.traditional ? (
                    <div className="w-6 h-6 bg-[#057642] rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-red-500" strokeWidth={3} />
                    </div>
                  )
                ) : (
                  <span className="text-sm text-gray-500">{row.traditional}</span>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="/upload"
            className="inline-flex items-center gap-2 bg-[#0A66C2] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0855A0] transition-all duration-200 text-base shadow-lg active:scale-95"
          >
            Choose LinkedShot – Save RM421+
          </a>
        </motion.div>
      </div>
    </section>
  );
}

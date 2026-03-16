'use client';

import { motion } from 'framer-motion';

const galleryItems = [
  {
    title: 'Ahmad Faiz',
    role: 'Software Engineer',
    beforeGradient: 'from-amber-200 to-orange-300',
    afterGradient: 'from-slate-600 to-slate-800',
    beforeEmoji: '🤳',
    afterEmoji: '👔',
  },
  {
    title: 'Priya Nair',
    role: 'Marketing Director',
    beforeGradient: 'from-rose-100 to-pink-200',
    afterGradient: 'from-indigo-700 to-blue-900',
    beforeEmoji: '📸',
    afterEmoji: '💼',
  },
  {
    title: 'Wei Liang',
    role: 'Financial Analyst',
    beforeGradient: 'from-emerald-100 to-teal-200',
    afterGradient: 'from-gray-700 to-gray-900',
    beforeEmoji: '🙂',
    afterEmoji: '🎯',
  },
  {
    title: 'Siti Rahimah',
    role: 'HR Manager',
    beforeGradient: 'from-violet-100 to-purple-200',
    afterGradient: 'from-blue-700 to-indigo-900',
    beforeEmoji: '😊',
    afterEmoji: '✨',
  },
  {
    title: 'Raj Kumar',
    role: 'Project Manager',
    beforeGradient: 'from-yellow-100 to-amber-200',
    afterGradient: 'from-slate-700 to-blue-900',
    beforeEmoji: '📱',
    afterEmoji: '🏆',
  },
  {
    title: 'Melissa Ong',
    role: 'Sales Executive',
    beforeGradient: 'from-cyan-100 to-sky-200',
    afterGradient: 'from-indigo-600 to-slate-800',
    beforeEmoji: '🤩',
    afterEmoji: '💫',
  },
];

export default function BeforeAfterGallery() {
  return (
    <section id="examples" className="py-20 bg-[#F3F6F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real Transformations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how LinkedShot transforms casual photos into stunning professional headshots. Hover to reveal the after.
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 aspect-[4/5] cursor-pointer"
            >
              {/* Before (visible by default) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.beforeGradient} flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0`}
              >
                <div className="text-center">
                  <div className="text-7xl mb-4">{item.beforeEmoji}</div>
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-white/90 font-semibold text-sm">BEFORE</span>
                  </div>
                </div>
              </div>

              {/* After (revealed on hover) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.afterGradient} flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              >
                <div className="text-center">
                  <div className="text-7xl mb-4">{item.afterEmoji}</div>
                  <div className="bg-[#0A66C2] rounded-lg px-4 py-2">
                    <span className="text-white font-semibold text-sm">AFTER</span>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="font-bold text-white">{item.title}</div>
                <div className="text-white/80 text-sm">{item.role}</div>
              </div>

              {/* Hover badge */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-2 py-1 rounded-full opacity-100 group-hover:opacity-0 transition-opacity">
                Hover to reveal ✨
              </div>
              <div className="absolute top-3 right-3 bg-[#0A66C2] text-xs font-semibold text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                AI Headshot 🎉
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="/upload"
            className="inline-flex items-center gap-2 bg-[#0A66C2] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0855A0] transition-all duration-200 text-base shadow-lg hover:shadow-xl active:scale-95"
          >
            Get My Professional Headshots →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

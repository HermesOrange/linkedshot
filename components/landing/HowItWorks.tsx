'use client';

import { motion } from 'framer-motion';
import { Upload, Sparkles, Download, Clock } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Photos',
    description:
      'Upload 5–10 casual photos of yourself — selfies, casual shots, anything works. Our AI learns your face.',
    color: 'bg-blue-50',
    iconColor: 'text-[#0A66C2]',
    iconBg: 'bg-[#EBF3FC]',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Works Its Magic',
    description:
      'Our advanced AI analyzes your photos and generates 50+ professional headshots in various backgrounds and lighting.',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  {
    number: '03',
    icon: Download,
    title: 'Download & Shine',
    description:
      'Choose your favorites from 50+ photos. Download in full HD. Update your LinkedIn and get 3× more profile views.',
    color: 'bg-green-50',
    iconColor: 'text-[#057642]',
    iconBg: 'bg-green-100',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#EBF3FC] text-[#0A66C2] rounded-full px-4 py-1.5 mb-4 text-sm font-semibold">
            <Clock className="w-4 h-4" />
            Ready in 5–10 Minutes
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How LinkedShot Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to transform your casual photos into stunning professional headshots.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {/* Connector lines (desktop) */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#0A66C2] to-purple-500 z-0" />
          <div className="hidden md:block absolute top-16 left-2/3 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-[#057642] z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative z-10"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                {/* Step number */}
                <div className="text-6xl font-black text-gray-100 leading-none mb-4 select-none">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 ${step.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>

                {/* Step connector (mobile) */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-6">
                    <div className="w-0.5 h-8 bg-gray-200" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/upload"
            className="inline-flex items-center gap-2 bg-[#0A66C2] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0855A0] transition-all duration-200 text-lg shadow-lg hover:shadow-xl active:scale-95"
          >
            Start Now – RM79
            <Sparkles className="w-5 h-5" />
          </a>
          <p className="mt-3 text-sm text-gray-500">No subscription. One-time payment.</p>
        </motion.div>
      </div>
    </section>
  );
}

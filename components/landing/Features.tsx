'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Layers,
  Download,
  Palette,
  RefreshCw,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Get your AI-generated headshots in as little as 5 minutes. No waiting days for a photographer\'s edits.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  {
    icon: Layers,
    title: '50+ Unique Styles',
    description:
      'Office backgrounds, outdoor settings, solid colors, and more. Every shot with professional lighting.',
    color: 'text-[#0A66C2]',
    bg: 'bg-[#EBF3FC]',
  },
  {
    icon: Shield,
    title: 'Privacy Protected',
    description:
      'Your photos are encrypted and automatically deleted after 30 days. We never share your data.',
    color: 'text-[#057642]',
    bg: 'bg-green-50',
  },
  {
    icon: Palette,
    title: 'Multiple Backgrounds',
    description:
      'Corporate offices, blurred backgrounds, solid colors, and outdoor settings — all included.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Download,
    title: 'Full HD Downloads',
    description:
      'Every photo delivered in high resolution (4K). Print-ready for business cards, brochures, and more.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
  {
    icon: RefreshCw,
    title: 'Money-Back Guarantee',
    description:
      'Not happy with the results? Get a full refund within 7 days. No questions asked, no hassle.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for a{' '}
            <span className="text-[#0A66C2]">Perfect Profile</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            LinkedShot combines cutting-edge AI with professional photography standards to deliver headshots that open doors.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

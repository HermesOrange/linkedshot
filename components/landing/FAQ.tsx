'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How does LinkedShot work?',
    answer:
      'You upload 5–10 casual photos of yourself. Our AI analyzes your face, lighting, and features, then generates 50+ professional headshots in various backgrounds and styles. The whole process takes just 5–10 minutes.',
  },
  {
    question: 'What kind of photos should I upload?',
    answer:
      'Upload recent photos with good lighting where your face is clearly visible. Selfies, casual shots, and phone photos all work great. Avoid group photos, sunglasses, or heavily filtered images. The more variety in angles, the better your results.',
  },
  {
    question: 'How long does it take to get my headshots?',
    answer:
      'The Basic package delivers in 5–10 minutes. The Pro package with Rush Delivery is even faster at 3–5 minutes. Once complete, you receive an email with a download link.',
  },
  {
    question: 'Will the photos look natural or "AI-generated"?',
    answer:
      'Our AI is trained specifically on professional photography standards and produces highly realistic results. Most people can\'t tell the difference from studio photos. We use advanced diffusion models that preserve your natural likeness.',
  },
  {
    question: 'Can I use these photos commercially?',
    answer:
      'Yes! All LinkedShot headshots come with full commercial usage rights. Use them on LinkedIn, your company website, business cards, brochures, presentations, and any other professional material.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit/debit cards (Visa, Mastercard), FPX (direct bank transfer), GrabPay, Touch \'n Go eWallet, and Maybank2u. All payments are secured with 256-bit SSL encryption.',
  },
  {
    question: 'Is my data safe and private?',
    answer:
      'Absolutely. Your photos are encrypted end-to-end during upload and processing. We never share, sell, or use your photos for training. All source photos are automatically deleted 30 days after your order, and you can request deletion at any time.',
  },
  {
    question: 'What if I\'m not happy with the results?',
    answer:
      'We offer a 7-day, no-questions-asked money-back guarantee. If you\'re not satisfied with your headshots for any reason, contact us at support@linkedshot.com.my and we\'ll issue a full refund within 1–2 business days.',
  },
  {
    question: 'Can I get a LinkedIn banner to match my headshots?',
    answer:
      'Yes! Add the LinkedIn Banner addon for just RM30. We\'ll create a professional LinkedIn banner that matches your headshot style, including your name, job title, and a clean branded background. It\'s included free in the Pro package.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-20 bg-[#F3F6F8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold text-gray-600">
            <HelpCircle className="w-4 h-4 text-[#0A66C2]" />
            Got Questions?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about LinkedShot.
          </p>
        </motion.div>

        {/* FAQ list */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center bg-white rounded-2xl p-6 border border-gray-100"
        >
          <p className="text-gray-600 mb-2">Still have questions?</p>
          <a
            href="mailto:support@linkedshot.com.my"
            className="text-[#0A66C2] font-semibold hover:underline"
          >
            support@linkedshot.com.my
          </a>
          <p className="text-sm text-gray-400 mt-1">We reply within 2 hours on business days</p>
        </motion.div>
      </div>
    </section>
  );
}

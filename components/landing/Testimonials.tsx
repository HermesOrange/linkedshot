'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmad Faizal Bin Razak',
    title: 'Senior Software Engineer at Grab',
    initials: 'AF',
    avatarColor: 'from-blue-400 to-blue-600',
    rating: 5,
    quote:
      'I was skeptical at first, but the results blew my mind. My LinkedIn profile views increased by 340% in the first week after changing my photo. The headshots look like they were taken by a professional photographer in KL. Absolutely worth every ringgit!',
    location: 'Kuala Lumpur',
  },
  {
    name: 'Priya Subramaniam',
    title: 'Marketing Director at Petronas Digital',
    initials: 'PS',
    avatarColor: 'from-rose-400 to-pink-600',
    rating: 5,
    quote:
      'Game changer! I used to spend RM800 on professional photoshoots every year. Now for RM79 I get 50+ amazing photos that I can use for different occasions. The AI even got the professional Malaysian corporate look perfectly right. Highly recommend!',
    location: 'Petaling Jaya',
  },
  {
    name: 'Tan Wei Liang',
    title: 'Finance Manager at CIMB',
    initials: 'TW',
    avatarColor: 'from-emerald-400 to-teal-600',
    rating: 5,
    quote:
      'Got my results in under 10 minutes. The photos look incredibly natural — not the "obviously AI" look you see from other services. My recruiter called me the same week I updated my profile photo. LinkedShot genuinely made a difference in my career.',
    location: 'Georgetown, Penang',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            500+ Happy Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real reviews from Malaysian professionals who transformed their LinkedIn presence.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-[#F3F6F8] rounded-2xl p-6 relative hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-[#0A66C2]/20 mb-4" />

              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white font-bold text-sm">{testimonial.initials}</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.title}</div>
                  <div className="text-xs text-[#0A66C2] mt-0.5">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '500+', label: 'Happy customers' },
            { value: '4.9/5', label: 'Average rating' },
            { value: '50,000+', label: 'Headshots generated' },
            { value: '98%', label: 'Satisfaction rate' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-[#0A66C2]">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

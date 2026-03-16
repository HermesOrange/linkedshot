'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Shield, Lock, ChevronLeft, CreditCard, Zap } from 'lucide-react';

interface CheckoutForm {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  terms: boolean;
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 < current
                ? 'bg-[#057642] text-white'
                : i + 1 === current
                ? 'bg-[#0A66C2] text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 w-12 transition-colors ${i + 1 < current ? 'bg-[#057642]' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function formatCardNumber(value: string) {
  return value
    .replace(/\s/g, '')
    .replace(/[^0-9]/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function formatExpiry(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 4)
    .replace(/^(\d{2})(\d)/, '$1/$2');
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    package: 'basic' as 'basic' | 'pro',
    addons: { linkedinBanner: false, rushDelivery: false },
    total: 79,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>();

  useEffect(() => {
    const photos = sessionStorage.getItem('linkedshot_photos');
    if (!photos) {
      router.replace('/upload');
      return;
    }

    const selection = sessionStorage.getItem('linkedshot_selection');
    if (selection) {
      try {
        const parsed = JSON.parse(selection);
        setOrderSummary(parsed);
      } catch {
        // use defaults
      }
    }
  }, [router]);

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);

    try {
      // Save email to session
      sessionStorage.setItem('linkedshot_email', data.email);

      const photosRaw = sessionStorage.getItem('linkedshot_photos');
      const photos = photosRaw ? JSON.parse(photosRaw) : [];
      const selection = JSON.parse(
        sessionStorage.getItem('linkedshot_selection') ?? '{}'
      );

      // Create order via API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          package: selection.package || 'basic',
          addons: selection.addons || { linkedinBanner: false, rushDelivery: false },
          total: selection.total || 79,
          photoCount: photos.length,
          photos: photos.slice(0, 3), // Save first 3 as preview
        }),
      });

      if (res.ok) {
        const order = await res.json();
        sessionStorage.setItem('linkedshot_orderId', order.id);
      }

      router.push('/processing');
    } catch {
      // Proceed anyway for demo
      router.push('/processing');
    }
  };

  const packageNames = { basic: 'Basic', pro: 'Pro' };
  const packagePhotos = { basic: 50, pro: 100 };

  return (
    <div className="min-h-screen bg-[#F3F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-gray-900">
            Linked<span className="text-[#0A66C2]">Shot</span>
          </a>
          <StepIndicator current={3} total={3} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-sm text-[#0A66C2] font-semibold mb-2">Step 3 of 3</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600">Complete your order and get your headshots in minutes.</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Email */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Delivery Details</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email',
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/20'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-400">
                    Your headshot download link will be sent here.
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Payment Details</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    256-bit SSL
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Card name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="Ahmad Faiz"
                      {...register('cardName', { required: 'Cardholder name is required' })}
                      className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.cardName
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/20'
                      }`}
                    />
                    {errors.cardName && (
                      <p className="mt-1.5 text-sm text-red-500">{errors.cardName.message}</p>
                    )}
                  </div>

                  {/* Card number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        inputMode="numeric"
                        {...register('cardNumber', {
                          required: 'Card number is required',
                          minLength: { value: 19, message: 'Enter a valid 16-digit card number' },
                          onChange: (e) => {
                            e.target.value = formatCardNumber(e.target.value);
                            setValue('cardNumber', e.target.value);
                          },
                        })}
                        maxLength={19}
                        className={`w-full px-4 py-3 pl-11 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all font-mono ${
                          errors.cardNumber
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/20'
                        }`}
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.cardNumber && (
                      <p className="mt-1.5 text-sm text-red-500">{errors.cardNumber.message}</p>
                    )}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        inputMode="numeric"
                        maxLength={5}
                        {...register('expiryDate', {
                          required: 'Expiry date is required',
                          pattern: { value: /^\d{2}\/\d{2}$/, message: 'Format: MM/YY' },
                          onChange: (e) => {
                            e.target.value = formatExpiry(e.target.value);
                            setValue('expiryDate', e.target.value);
                          },
                        })}
                        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all font-mono ${
                          errors.expiryDate
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/20'
                        }`}
                      />
                      {errors.expiryDate && (
                        <p className="mt-1.5 text-sm text-red-500">{errors.expiryDate.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        inputMode="numeric"
                        maxLength={4}
                        {...register('cvv', {
                          required: 'CVV is required',
                          minLength: { value: 3, message: 'Enter 3–4 digits' },
                          pattern: { value: /^\d{3,4}$/, message: 'Invalid CVV' },
                        })}
                        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all font-mono ${
                          errors.cvv
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/20'
                        }`}
                      />
                      {errors.cvv && (
                        <p className="mt-1.5 text-sm text-red-500">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      {...register('terms', { required: 'You must accept the terms' })}
                      className="w-4 h-4 border-gray-300 rounded accent-[#0A66C2] mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="/terms" className="text-[#0A66C2] underline">
                        Terms of Service
                      </a>
                      ,{' '}
                      <a href="/privacy" className="text-[#0A66C2] underline">
                        Privacy Policy
                      </a>
                      , and{' '}
                      <a href="/refund" className="text-[#0A66C2] underline">
                        Refund Policy
                      </a>
                      .
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-500">{errors.terms.message}</p>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-gray-600 font-semibold px-5 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-bold py-3 rounded-xl hover:bg-[#0855A0] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Complete Order – RM{orderSummary.total}
                    </>
                  )}
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  Secure payment
                </span>
                <span className="flex items-center gap-1.5">
                  <span>🔒</span>
                  SSL encrypted
                </span>
                <span className="flex items-center gap-1.5">
                  <span>↩</span>
                  7-day refund
                </span>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {packageNames[orderSummary.package]} Package (
                      {packagePhotos[orderSummary.package]} photos)
                    </span>
                    <span className="font-semibold">
                      RM{orderSummary.package === 'basic' ? 79 : 149}
                    </span>
                  </div>
                  {orderSummary.addons.linkedinBanner && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">LinkedIn Banner</span>
                      <span className="font-semibold">RM30</span>
                    </div>
                  )}
                  {orderSummary.addons.rushDelivery && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rush Delivery</span>
                      <span className="font-semibold">RM20</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-3 mb-5">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-black text-xl text-[#0A66C2]">
                      RM{orderSummary.total}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-gray-500 bg-[#F3F6F8] rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Results ready in minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📧</span>
                    <span>Download link sent by email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>7-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏆</span>
                    <span>50,000+ headshots generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

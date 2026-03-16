'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Star, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const packages = [
  {
    id: 'basic' as const,
    name: 'Basic',
    price: 79,
    photos: 50,
    turnaround: '5–10 min',
    popular: true,
    features: [
      '50 AI-generated headshots',
      '5 background styles',
      'Full HD resolution',
      'LinkedIn-optimized crops',
      'Commercial usage rights',
      'Email delivery',
      '7-day money-back guarantee',
    ],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 149,
    photos: 100,
    turnaround: '3–5 min',
    popular: false,
    features: [
      '100 AI-generated headshots',
      '10+ background styles',
      'Full HD + 4K resolution',
      'LinkedIn-optimized crops',
      'Commercial usage rights',
      'Priority email delivery',
      '7-day money-back guarantee',
      'Priority support',
    ],
  },
];

const addons = [
  {
    id: 'linkedinBanner' as const,
    name: 'LinkedIn Banner',
    description: 'Matching professional banner for your LinkedIn profile',
    price: 30,
    icon: '🖼️',
  },
  {
    id: 'rushDelivery' as const,
    name: 'Rush Delivery',
    description: 'Skip the queue — get results in under 5 minutes',
    price: 20,
    icon: '⚡',
  },
];

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

export default function SelectPackagePage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'pro'>('basic');
  const [selectedAddons, setSelectedAddons] = useState({
    linkedinBanner: false,
    rushDelivery: false,
  });

  useEffect(() => {
    const saved = sessionStorage.getItem('linkedshot_photos');
    if (!saved) {
      router.replace('/upload');
    }
  }, [router]);

  const toggleAddon = (id: 'linkedinBanner' | 'rushDelivery') => {
    setSelectedAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedPkg = packages.find((p) => p.id === selectedPackage)!;
  const addonTotal = addons
    .filter((a) => selectedAddons[a.id])
    .reduce((sum, a) => sum + a.price, 0);
  const total = selectedPkg.price + addonTotal;

  const handleContinue = () => {
    sessionStorage.setItem(
      'linkedshot_selection',
      JSON.stringify({ package: selectedPackage, addons: selectedAddons, total })
    );
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#F3F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-gray-900">
            Linked<span className="text-[#0A66C2]">Shot</span>
          </a>
          <StepIndicator current={2} total={3} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-sm text-[#0A66C2] font-semibold mb-2">Step 2 of 3</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Choose Your Package
          </h1>
          <p className="text-gray-600">Select the plan that works best for you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Package selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedPackage === pkg.id
                      ? 'border-[#0A66C2] shadow-md shadow-[#0A66C2]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#0A66C2] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Radio indicator */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{pkg.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-black text-gray-900">RM{pkg.price}</span>
                        <span className="text-gray-400 text-sm">/ once</span>
                      </div>
                      <div className="text-sm text-[#0A66C2] font-medium mt-1">
                        {pkg.photos} photos · {pkg.turnaround}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                        selectedPackage === pkg.id
                          ? 'border-[#0A66C2]'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedPackage === pkg.id && (
                        <div className="w-2.5 h-2.5 bg-[#0A66C2] rounded-full" />
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 text-[#057642] flex-shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Add-ons */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-1">Enhance Your Package</h3>
              <p className="text-sm text-gray-500 mb-4">Optional add-ons to supercharge your results</p>
              <div className="space-y-3">
                {addons.map((addon) => (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedAddons[addon.id]
                        ? 'border-[#0A66C2] bg-[#EBF3FC]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{addon.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{addon.name}</div>
                      <div className="text-sm text-gray-500">{addon.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">+RM{addon.price}</div>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ml-auto ${
                          selectedAddons[addon.id]
                            ? 'border-[#0A66C2] bg-[#0A66C2]'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedAddons[addon.id] && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 font-semibold px-5 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-bold py-3 rounded-xl hover:bg-[#0855A0] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                Continue to Checkout
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {selectedPkg.name} Package ({selectedPkg.photos} photos)
                  </span>
                  <span className="font-semibold">RM{selectedPkg.price}</span>
                </div>
                {addons
                  .filter((a) => selectedAddons[a.id])
                  .map((a) => (
                    <div key={a.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{a.name}</span>
                      <span className="font-semibold">RM{a.price}</span>
                    </div>
                  ))}
              </div>

              <div className="border-t border-gray-100 pt-3 mb-5">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-xl text-[#0A66C2]">RM{total}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">One-time payment · No subscription</div>
              </div>

              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>7-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🔒</span>
                  <span>Secure 256-bit SSL payment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span>Results in {selectedPkg.turnaround}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

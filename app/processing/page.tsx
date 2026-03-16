'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, CheckCircle } from 'lucide-react';

const stages = [
  { label: 'Uploading photos...', percentage: 0, endAt: 10 },
  { label: 'Analyzing your features...', percentage: 15, endAt: 25 },
  { label: 'Training your AI model...', percentage: 30, endAt: 55 },
  { label: 'Generating headshots...', percentage: 60, endAt: 80 },
  { label: 'Applying professional styles...', percentage: 82, endAt: 90 },
  { label: 'Finalizing your photos...', percentage: 93, endAt: 99 },
];

const funFacts = [
  'LinkedIn profiles with professional headshots receive 21x more views.',
  'Recruiters spend an average of 19% of their time looking at your profile photo.',
  'Professionals with quality headshots are 36x more likely to receive a message.',
  'Your profile photo is the first thing people notice on LinkedIn.',
  'A professional headshot can increase connection acceptance rates by up to 300%.',
  'Top performers update their LinkedIn photo every 1–2 years.',
  '92% of hiring managers review LinkedIn profiles before interviews.',
  'Profiles with photos get 21x more views than those without.',
];

export default function ProcessingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStageLabel, setCurrentStageLabel] = useState(stages[0].label);
  const [factIndex, setFactIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Rotate fun facts
    const factInterval = setInterval(() => {
      setFactIndex((i) => (i + 1) % funFacts.length);
    }, 4000);
    return () => clearInterval(factInterval);
  }, []);

  useEffect(() => {
    // Simulate progress
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.8;

        // Update stage label
        const currentStage = [...stages].reverse().find((s) => next >= s.percentage);
        if (currentStage) {
          setCurrentStageLabel(currentStage.label);
        }

        if (next >= 100) {
          clearInterval(intervalRef.current!);
          setProgress(100);
          setCurrentStageLabel('Done! Your headshots are ready. 🎉');
          setIsComplete(true);
          return 100;
        }
        return next;
      });
    }, 400);

    return () => clearInterval(intervalRef.current!);
  }, []);

  // Countdown and redirect after completion
  useEffect(() => {
    if (!isComplete) return;

    const cdInterval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(cdInterval);
          const orderId = sessionStorage.getItem('linkedshot_orderId') ?? 'demo-order';
          router.push(`/download/${orderId}`);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(cdInterval);
  }, [isComplete, router]);

  const email = typeof window !== 'undefined'
    ? sessionStorage.getItem('linkedshot_email') ?? 'your@email.com'
    : 'your@email.com';

  const progressRounded = Math.round(progress);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F6F8] via-white to-[#EBF3FC] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <a href="/" className="font-bold text-xl text-gray-900">
            Linked<span className="text-[#0A66C2]">Shot</span>
          </a>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center">
          {/* Circular progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative inline-flex items-center justify-center mb-8"
          >
            <svg width="140" height="140" viewBox="0 0 140 140">
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke={isComplete ? '#057642' : '#0A66C2'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                >
                  <CheckCircle className="w-12 h-12 text-[#057642]" />
                </motion.div>
              ) : (
                <>
                  <span className="text-3xl font-black text-gray-900">{progressRounded}%</span>
                  <span className="text-xs text-gray-500 mt-0.5">complete</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Status */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentStageLabel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className={`text-2xl font-bold mb-2 ${
                isComplete ? 'text-[#057642]' : 'text-gray-900'
              }`}
            >
              {isComplete ? '🎉 Your Headshots Are Ready!' : currentStageLabel}
            </motion.h1>
          </AnimatePresence>

          {/* Progress bar */}
          {!isComplete && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="h-full bg-[#0A66C2] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {isComplete ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-gray-600">
                Redirecting to your downloads in{' '}
                <span className="font-bold text-[#0A66C2]">{countdown}s</span>...
              </p>
              <button
                onClick={() => {
                  const orderId = sessionStorage.getItem('linkedshot_orderId') ?? 'demo-order';
                  router.push(`/download/${orderId}`);
                }}
                className="inline-flex items-center gap-2 bg-[#057642] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#046034] transition-all duration-200 shadow-lg active:scale-95 text-lg"
              >
                View My Headshots →
              </button>
            </motion.div>
          ) : (
            <>
              {/* Email notice */}
              <div className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6 shadow-sm">
                <Mail className="w-4 h-4 text-[#0A66C2] flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Confirmation sent to{' '}
                  <strong className="text-gray-900">{email}</strong>
                </span>
              </div>

              {/* Fun fact */}
              <div className="bg-[#EBF3FC] rounded-2xl p-5 border border-[#D1E6F8]">
                <p className="text-xs text-[#0A66C2] font-semibold uppercase tracking-wide mb-2">
                  💡 Did You Know?
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={factIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-gray-700 leading-relaxed"
                  >
                    {funFacts[factIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Processing steps */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {stages.slice(0, 3).map((stage, idx) => (
                  <div
                    key={idx}
                    className={`text-center p-3 rounded-xl text-xs font-medium transition-colors ${
                      progress >= stage.percentage
                        ? 'bg-[#EBF3FC] text-[#0A66C2]'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <div className="text-lg mb-1">
                      {idx === 0 ? '📤' : idx === 1 ? '🔍' : '🤖'}
                    </div>
                    {progress >= stage.percentage ? '✓' : '○'}{' '}
                    {idx === 0 ? 'Upload' : idx === 1 ? 'Analyze' : 'Generate'}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Security note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span>Your photos are processed securely and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

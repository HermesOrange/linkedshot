import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import BeforeAfterGallery from '@/components/landing/BeforeAfterGallery';
import Features from '@/components/landing/Features';
import ComparisonTable from '@/components/landing/ComparisonTable';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <BeforeAfterGallery />
        <Features />
        <ComparisonTable />
        <Pricing />

        {/* Use Cases section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Perfect for Every Professional
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Whether you are climbing the corporate ladder or building your personal brand, LinkedShot works for you.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { emoji: '💼', label: 'Job Seekers' },
                { emoji: '🚀', label: 'Entrepreneurs' },
                { emoji: '👨‍💻', label: 'Tech Professionals' },
                { emoji: '🏦', label: 'Finance & Banking' },
                { emoji: '⚕️', label: 'Healthcare Workers' },
                { emoji: '🎓', label: 'Fresh Graduates' },
                { emoji: '📊', label: 'Consultants' },
                { emoji: '⚖️', label: 'Legal Professionals' },
                { emoji: '🏗️', label: 'Engineers' },
                { emoji: '📢', label: 'Marketers' },
                { emoji: '🎨', label: 'Creatives' },
                { emoji: '📚', label: 'Academics' },
              ].map((useCase) => (
                <div
                  key={useCase.label}
                  className="bg-[#F3F6F8] rounded-xl p-4 text-center hover:bg-[#EBF3FC] hover:border-[#0A66C2] border-2 border-transparent transition-all duration-200 cursor-pointer"
                >
                  <div className="text-3xl mb-2">{useCase.emoji}</div>
                  <div className="text-xs font-semibold text-gray-700">{useCase.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

import Image from "next/image";
import HeroTicker from "@/components/HeroTicker";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-300/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo with enhanced styling */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-light to-primary-dark opacity-20 blur-xl"></div>
              <Image
                src="logo-clean.svg"
                alt="Connected Systems"
                width={140}
                height={140}
                priority
                className="relative drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Main headline with ticker animation */}
          <HeroTicker />

          <p className="mt-8 text-xl leading-8 text-blue-50 max-w-2xl mx-auto drop-shadow-md">
            Delivering bespoke Microsoft 365, SharePoint, Azure, and enterprise integration solutions
            that transform how Australian businesses operate.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center rounded-full bg-white hover:bg-blue-50 px-8 py-4 text-base font-semibold text-primary-dark shadow-2xl transition-all hover:scale-105 hover:shadow-white/50 w-full sm:w-auto"
            >
              <span className="relative z-10">Start Your Project</span>
              <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#services"
              className="group inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md px-8 py-4 text-base font-semibold text-white shadow-lg ring-1 ring-white/30 transition-all hover:bg-white/30 hover:scale-105 w-full sm:w-auto"
            >
              <span>Explore Services</span>
              <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Microsoft Partners</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Enterprise Grade</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Australian Owned</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

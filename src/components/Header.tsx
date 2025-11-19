'use client';

import Link from "next/link";
import { useState } from "react";
import { getAssetPath } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-slate-950/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          {/* Logo and Brand */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 group">
              <img
                src={getAssetPath("/logo-clean.svg")}
                alt="Connected Systems"
                className="h-8 w-8 transition-transform group-hover:scale-110"
              />
              <span className="text-xl font-semibold text-foreground">
                Connected
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 dark:text-slate-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">
                {mobileMenuOpen ? 'Close menu' : 'Open menu'}
              </span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            <Link 
              href="/#services" 
              className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300 hover:text-primary-light transition-colors"
            >
              Services
            </Link>
            <Link 
              href="/#about" 
              className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300 hover:text-primary-light transition-colors"
            >
              About
            </Link>
            <Link 
              href="/#contact" 
              className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300 hover:text-primary-light transition-colors"
            >
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay and sidebar - rendered outside header */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white dark:bg-slate-950 shadow-xl lg:hidden overflow-y-auto">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <img
                    src={getAssetPath("/logo-clean.svg")}
                    alt="Connected Systems"
                    className="h-8 w-8"
                  />
                  <span className="text-xl font-semibold text-foreground">
                    Connected
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-6">
                <div className="space-y-1">
                  <Link
                    href="/#services"
                    className="block rounded-lg px-4 py-3 text-base font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link
                    href="/#about"
                    className="block rounded-lg px-4 py-3 text-base font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/#contact"
                    className="block rounded-lg px-4 py-3 text-base font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}


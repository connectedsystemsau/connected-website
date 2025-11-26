/**
 * Contact Form Component
 * Client-side form with hCaptcha integration
 */

'use client';

import { useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useContactForm } from '@/hooks/useContactForm';

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'; // Test key for development

export default function ContactForm() {
  const hcaptchaRef = useRef<HCaptcha>(null);
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    successMessage,
    updateField,
    handleSubmit,
    resetForm,
  } = useContactForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Execute hCaptcha
      const response = await hcaptchaRef.current?.execute({ async: true });
      
      if (response?.response) {
        await handleSubmit(response.response);
        // Reset hCaptcha after submission
        hcaptchaRef.current?.resetCaptcha();
      }
    } catch (error) {
      console.error('hCaptcha error:', error);
    }
  };

  const handleNewSubmission = () => {
    resetForm();
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl shadow-2xl border border-slate-800 bg-background text-foreground dark:bg-slate-900 p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Message Sent!
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {successMessage}
          </p>
          <button
            onClick={handleNewSubmission}
            className="mt-6 rounded-full bg-gradient-to-r from-primary-light to-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl shadow-2xl border border-slate-800 bg-background text-foreground dark:bg-slate-900 p-8">
      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            disabled={isSubmitting}
            className={`mt-2 block w-full rounded-lg border px-4 py-2.5 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 focus:border-primary-light focus:ring-primary-light/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="Your name *"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            disabled={isSubmitting}
            className={`mt-2 block w-full rounded-lg border px-4 py-2.5 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 focus:border-primary-light focus:ring-primary-light/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="Your email *"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Company Field (Optional) */}
        <div>
          <label htmlFor="company" className="sr-only">
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            value={formData.company}
            onChange={(e) => updateField('company', e.target.value)}
            disabled={isSubmitting}
            className="mt-2 block w-full rounded-lg border px-4 py-2.5 border-slate-300 bg-white placeholder-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:placeholder-slate-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            placeholder="Company name"
          />
        </div>

        {/* Phone Field (Optional) */}
        <div>
          <label htmlFor="phone" className="sr-only">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            disabled={isSubmitting}
            className={`mt-2 block w-full rounded-lg border px-4 py-2.5 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.phone
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 focus:border-primary-light focus:ring-primary-light/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="Phone number"
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            disabled={isSubmitting}
            className={`mt-2 block w-full rounded-lg border px-4 py-2.5 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.message
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 focus:border-primary-light focus:ring-primary-light/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="Tell us about your project... *"
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.message}
            </p>
          )}
        </div>

        {/* hCaptcha */}
        <div className="flex justify-center">
          <HCaptcha
            ref={hcaptchaRef}
            sitekey={HCAPTCHA_SITE_KEY}
            size="invisible"
            onError={(err) => console.error('hCaptcha error:', err)}
          />
        </div>

        {/* Error Messages */}
        {(errors.hcaptcha || errors.submit) && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {errors.hcaptcha || errors.submit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-gradient-to-r from-primary-light to-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </button>

        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
          * Required fields. This site is protected by hCaptcha.
        </p>
      </div>
    </form>
  );
}

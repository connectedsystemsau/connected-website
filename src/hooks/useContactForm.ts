/**
 * Contact Form Hook
 * Manages form state, validation, and submission logic
 */

'use client';

import { useState, useCallback } from 'react';
import type { ContactFormData } from '@/lib/contactFormService';
import { getCsrfToken, submitContactForm, isValidEmail, isValidPhone } from '@/lib/contactFormService';

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  hcaptcha?: string;
  submit?: string;
}

export interface UseContactFormReturn {
  formData: ContactFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  successMessage: string;
  updateField: (field: keyof ContactFormData, value: string) => void;
  validateForm: () => boolean;
  handleSubmit: (hCaptchaToken: string) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
};

export function useContactForm(): UseContactFormReturn {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (hCaptchaToken: string) => {
    // Reset previous states
    setErrors({});
    setIsSuccess(false);
    setSuccessMessage('');

    // Validate hCaptcha
    if (!hCaptchaToken) {
      setErrors({ hcaptcha: 'Please complete the CAPTCHA verification' });
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get CSRF token
      const csrf = await getCsrfToken();

      // Submit form
      const response = await submitContactForm(formData, hCaptchaToken, csrf);

      if (response.success) {
        setIsSuccess(true);
        setSuccessMessage(response.message);
        // Reset form after successful submission
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsSuccess(false);
    setSuccessMessage('');
    setIsSubmitting(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    successMessage,
    updateField,
    validateForm,
    handleSubmit,
    resetForm,
  };
}

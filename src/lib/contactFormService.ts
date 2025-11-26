/**
 * Contact Form API Service
 * Handles communication with the Azure Function App backend
 */

export interface CsrfToken {
  token: string;
  timestamp: string;
  signature: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

export interface ContactFormSubmission extends ContactFormData {
  hCaptchaToken: string;
  csrfToken: string;
  csrfTimestamp: string;
  csrfSignature: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

export interface ContactFormError {
  error: string;
  details?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://connected-web-prod-func.azurewebsites.net';

/**
 * Fetch a CSRF token from the API
 */
export async function getCsrfToken(): Promise<CsrfToken> {
  const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch CSRF token' }));
    throw new Error(error.error || 'Failed to fetch CSRF token');
  }

  return response.json();
}

/**
 * Submit the contact form
 */
export async function submitContactForm(
  formData: ContactFormData,
  hCaptchaToken: string,
  csrf: CsrfToken
): Promise<ContactFormResponse> {
  const submission: ContactFormSubmission = {
    ...formData,
    hCaptchaToken,
    csrfToken: csrf.token,
    csrfTimestamp: csrf.timestamp,
    csrfSignature: csrf.signature,
  };

  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit form');
  }

  return data;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (optional, allows various formats)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
  return phoneRegex.test(phone);
}

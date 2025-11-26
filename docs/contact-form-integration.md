# Contact Form Frontend Integration

This document explains how the contact form frontend integrates with the Azure Function App backend.

## Architecture

The contact form uses a layered architecture:

1. **ContactForm Component** (`src/components/ContactForm.tsx`)
   - React component with form UI and validation display
   - Integrates hCaptcha for bot protection
   - Handles form submission flow

2. **useContactForm Hook** (`src/hooks/useContactForm.ts`)
   - Custom React hook for form state management
   - Client-side validation logic
   - Form submission orchestration

3. **Contact Form Service** (`src/lib/contactFormService.ts`)
   - API communication layer
   - Type definitions for requests/responses
   - Validation utilities

## Security Flow

### 1. CSRF Protection

```
User loads page
    ↓
User fills form and clicks Submit
    ↓
Frontend calls GET /api/csrf-token
    ↓
Backend generates token + timestamp + HMAC signature
    ↓
Frontend receives {token, timestamp, signature}
    ↓
Frontend includes all three in POST /api/contact
    ↓
Backend validates signature and token age
```

### 2. hCaptcha Verification

```
User clicks Submit button
    ↓
Frontend triggers hCaptcha (invisible mode)
    ↓
hCaptcha performs bot detection
    ↓
hCaptcha returns response token
    ↓
Frontend includes token in POST /api/contact
    ↓
Backend validates with hCaptcha API
```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://connected-web-prod-func.azurewebsites.net

# hCaptcha Site Key
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-hcaptcha-site-key
```

### Development vs Production

**Development** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:7071
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
```

**Production** (GitHub Secrets or hosting platform):
```env
NEXT_PUBLIC_API_URL=https://connected-web-prod-func.azurewebsites.net
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=<your-production-site-key>
```

## Form Validation

### Client-Side Validation

The form validates:
- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Phone**: Optional, valid phone format
- **Message**: Required, minimum 10 characters
- **hCaptcha**: Must be completed

### Server-Side Validation

The backend additionally validates:
- CSRF token signature and age (max 30 minutes)
- hCaptcha response with remote IP
- Origin header matches allowed CORS origins
- All required fields present
- Email format

## User Experience

### Form States

1. **Initial State**
   - Empty form with placeholder text
   - All fields enabled

2. **Validation Errors**
   - Red border on invalid fields
   - Error message below each field
   - Form remains editable

3. **Submitting**
   - Loading spinner on submit button
   - All fields disabled
   - Button text changes to "Sending..."

4. **Success**
   - Green checkmark icon
   - Success message displayed
   - "Send Another Message" button to reset

5. **Error**
   - Red error banner at bottom of form
   - Specific error message
   - Form remains editable
   - hCaptcha resets for retry

## API Integration

### CSRF Token Request

```typescript
const response = await fetch(`${API_URL}/api/csrf-token`);
const csrf = await response.json();
// Returns: { token: string, timestamp: string, signature: string }
```

### Form Submission

```typescript
const response = await fetch(`${API_URL}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    phone: '+61 400 000 000',
    message: 'I need help with...',
    hCaptchaToken: '<token-from-hcaptcha>',
    csrfToken: csrf.token,
    csrfTimestamp: csrf.timestamp,
    csrfSignature: csrf.signature,
  }),
});
```

### Error Handling

The service throws errors with descriptive messages:
- Network errors: "Failed to fetch..."
- Validation errors: Specific field errors from backend
- Server errors: Error message from API response

## Testing

### Local Development

1. Start the Azure Function App locally:
   ```bash
   cd api
   func start
   ```

2. Start the Next.js development server:
   ```bash
   npm run dev
   ```

3. Navigate to `http://localhost:3000/#contact`

4. Test with hCaptcha test keys (automatically pass)

### Production Testing

1. Deploy the Function App to Azure
2. Deploy the Next.js site to GitHub Pages
3. Update `.env.local` with production API URL and hCaptcha site key
4. Test with real hCaptcha verification

## Troubleshooting

### CORS Errors

**Problem**: "Access to fetch blocked by CORS policy"

**Solution**:
1. Verify `CORS_ORIGIN` in Function App settings includes your domain
2. Ensure protocol (http/https) matches exactly
3. Check for trailing slashes in URL configuration

### hCaptcha Not Loading

**Problem**: hCaptcha widget doesn't appear

**Solution**:
1. Verify `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` is set
2. Check browser console for hCaptcha errors
3. Ensure hCaptcha scripts can load (check ad blockers)

### Form Submission Fails

**Problem**: Form shows error after submission

**Solution**:
1. Check browser console for detailed error
2. Verify API URL is correct (`NEXT_PUBLIC_API_URL`)
3. Test CSRF token endpoint directly
4. Check Application Insights logs in Azure
5. Verify backend Function App is running

### CSRF Token Expired

**Problem**: "CSRF token has expired" error

**Solution**:
- CSRF tokens expire after 30 minutes
- User must submit form within 30 minutes of loading page
- Page refresh generates new token
- Consider increasing expiry time in backend if needed

## Component Usage

### In a Page

```tsx
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <ContactForm />
    </div>
  );
}
```

### With Custom Styling

The component uses Tailwind CSS and respects dark mode. Customize by wrapping in a container:

```tsx
<div className="max-w-2xl mx-auto">
  <ContactForm />
</div>
```

## Accessibility

The form includes:
- Semantic HTML with proper labels
- ARIA attributes for error states
- Keyboard navigation support
- Screen reader announcements
- Focus management
- High contrast error indicators

## Performance

- **hCaptcha**: Loaded asynchronously, doesn't block rendering
- **Form Validation**: Runs client-side before API call
- **CSRF Token**: Fetched only when needed (on submit)
- **Optimistic UI**: Immediate feedback on user actions

## Security Best Practices

1. ✅ Never expose API secrets in frontend code
2. ✅ Always validate on both client and server
3. ✅ Use HTTPS in production
4. ✅ Implement rate limiting on backend
5. ✅ Log security events (failed validations, etc.)
6. ✅ Keep dependencies updated

## Future Enhancements

Potential improvements:
- File attachment support
- Email confirmation to submitter
- Form analytics (completion rate, abandonment)
- A/B testing different form layouts
- Multi-step form for complex inquiries
- Real-time field validation as user types
- Progressive enhancement for non-JS users

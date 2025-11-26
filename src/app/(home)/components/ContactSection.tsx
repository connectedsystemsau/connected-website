import ContactForm from '@/components/ContactForm';

export default function ContactSection() {
  return (
    <section id="contact" className="flex-1 flex items-center justify-center bg-slate-800 dark:bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get Connected
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            Let&rsquo;s discuss how we can help your organisation
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:grid-cols-1 justify-center">

          {/* Contact Form */}
          <ContactForm />

          {/* Contact Info */}
          <div className="mx-auto">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-md text-slate-300">
                    81 Edward Street<br />
                    Perth WA 6000<br />
                    Australia
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

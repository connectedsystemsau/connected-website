export default function SimpleContactSection()
{
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

          {/* Contact Info */}
          {/* <div className="mx-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <a href="tel:+61411117270" className="hover:text-primary-light transition-colors">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                </div>
                <div>
                  <p className="text-xl text-slate-300">
                    <a href="tel:+61411117270" className="hover:text-primary-light transition-colors">
                      +61 4 1111 7270
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <a href="mailto:sales@connectedsystems.com" className="hover:text-primary-light transition-colors">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
                <div>
                  <p className="text-xl text-slate-300">
                    <a href="mailto:sales@connectedsystems.com" className="hover:text-primary-light transition-colors">
                      sales@connectedsystems.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div> */}
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

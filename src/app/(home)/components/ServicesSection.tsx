export default function ServicesSection() {
  return (
    <section id="services" className="py-24 sm:py-32 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Specialisations
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Expertise across the Microsoft enterprise technology stack
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Service 1 - Microsoft 365 & SharePoint (Blue) */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-[1px] shadow-sm hover:shadow-xl transition-all hover:scale-105">
            <div className="h-full rounded-2xl bg-white dark:bg-slate-900 p-8">
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Microsoft 365 & SharePoint
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Custom solutions leveraging the full power of Microsoft 365 and SharePoint for collaboration and content management.
              </p>
            </div>
          </div>

          {/* Service 2 - Azure Integration (Sky Blue) */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 p-[1px] shadow-sm hover:shadow-xl transition-all hover:scale-105">
            <div className="h-full rounded-2xl bg-white dark:bg-slate-900 p-8">
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Azure Integration
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cloud-native solutions and hybrid integration architectures using Azure services and APIs.
              </p>
            </div>
          </div>

          {/* Service 3 - .NET Development (Purple) */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-[1px] shadow-sm hover:shadow-xl transition-all hover:scale-105">
            <div className="h-full rounded-2xl bg-white dark:bg-slate-900 p-8">
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                .NET Development
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enterprise-grade application development using the latest .NET technologies and best practices.
              </p>
            </div>
          </div>

          {/* Service 4 - Legacy Integration (Orange) */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 p-[1px] shadow-sm hover:shadow-xl transition-all hover:scale-105">
            <div className="h-full rounded-2xl bg-white dark:bg-slate-900 p-8">
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Legacy Integration
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                BizTalk and legacy system integration, modernisation, and migration strategies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

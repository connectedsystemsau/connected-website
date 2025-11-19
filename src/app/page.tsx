import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo-clean.svg"
                alt="Connected Systems"
                width={120}
                height={120}
                priority
                className="drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Enterprise Solutions for the{" "}
              <span className="bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent">
                Microsoft Stack
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Connected Systems is a Perth-based software development consultancy specializing in 
              Microsoft 365, SharePoint, Azure, and enterprise integration solutions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#contact"
                className="rounded-full bg-gradient-to-r from-primary-light to-primary-dark px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Get in touch
              </a>
              <a
                href="#services"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary-dark transition-colors"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 sm:py-32 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Specializations
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Expertise across the Microsoft enterprise technology stack
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Service 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl transition-all hover:scale-105">
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
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

            {/* Service 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl transition-all hover:scale-105">
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
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

            {/* Service 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl transition-all hover:scale-105">
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
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

            {/* Service 4 */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl transition-all hover:scale-105">
              <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Legacy Integration
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                BizTalk and legacy system integration, modernization, and migration strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-slate-50 dark:bg-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                About Connected Systems
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                Based in Perth, Western Australia, Connected Systems brings deep expertise in Microsoft 
                enterprise technologies to organizations across Australia and internationally.
              </p>
              <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-400">
                We specialize in delivering bespoke software solutions for enterprise-grade systems, 
                combining technical excellence with a practical, business-focused approach. Our team 
                understands the complexities of modern IT environments and works closely with clients 
                to deliver solutions that drive real business value.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Enterprise Focus</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Proven experience with large-scale enterprise deployments and complex integration scenarios.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-dark">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Microsoft Expertise</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Deep knowledge of the Microsoft technology stack from Office 365 to Azure and beyond.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Client Partnership</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Collaborative approach working alongside your team to deliver sustainable solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 bg-slate-800 dark:bg-slate-950 text-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get Connected
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              Let&rsquo;s discuss how Connected Systems can help your organisation
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:grid-cols-1 justify-center">

            {/* Contact Form */}
            <form className="rounded-2xl shadow-2xl border border-slate-800 bg-background text-foreground dark:bg-slate-900 p-8">
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-2 block w-full rounded-lg border px-4 py-2.5 border-slate-300 bg-white placeholder-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:placeholder-slate-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-2 block w-full rounded-lg border px-4 py-2.5 border-slate-300 bg-white placeholder-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:placeholder-slate-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/20"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="mt-2 block w-full rounded-lg border px-4 py-2.5 border-slate-300 bg-white placeholder-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:placeholder-slate-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/20"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-primary-light to-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Send Message
                </button>
                <p className="text-xs text-slate-500 text-center">
                  Form submission handling coming soon
                </p>
              </div>
            </form>

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

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-clean.svg"
                alt="Connected Systems"
                width={32}
                height={32}
              />
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} Connected Systems. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-slate-400 hover:text-primary-light transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-primary-light transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


import Link from "next/link";
import Header from "./components/Header";

export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-primary-light hover:text-primary-dark transition-colors mb-8"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-strong:text-foreground prose-ul:text-slate-600 dark:prose-ul:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400">
            {children}
          </article>
        </div>
      </div>
    </>
  );
}

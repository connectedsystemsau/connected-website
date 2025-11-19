import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="logo-clean.svg"
              alt="Connected Systems"
              width={32}
              height={32}
            />
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Connected Systems Group. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-400 hover:text-primary-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-slate-400 hover:text-primary-light transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

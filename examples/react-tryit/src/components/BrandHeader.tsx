export default function BrandHeader() {
  return (
    <header className="flex-shrink-0 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-500 shadow-sm">
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden
            >
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-none text-black sm:text-lg">AutoFill</h1>
            <p className="mt-1 text-xs leading-none text-gray-500">
              Try It · RapidAPI quick start
            </p>
          </div>
        </div>

        <nav className="flex flex-shrink-0 flex-wrap items-center gap-3 text-xs text-gray-500 sm:gap-4 sm:text-sm">
          <a
            href="https://rapidapi.com/12devs-12devs-default/api/autofill"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <rect x="5" y="4" width="14" height="16" rx="2" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M8 8.5h8" />
            </svg>
            API on Hub
          </a>
          <a
            href="https://github.com/twelvedevs/autofill-examples"
            target="_blank"
            rel="noreferrer"
            className="link-brand inline-flex items-center gap-1.5 text-xs sm:text-sm"
          >
            Examples repo
          </a>
          <a
            href="https://autofill.12devs.info/"
            target="_blank"
            rel="noreferrer"
            className="link-brand inline-flex items-center gap-1.5 text-xs sm:text-sm"
          >
            Live demo
          </a>
        </nav>
      </div>
    </header>
  );
}

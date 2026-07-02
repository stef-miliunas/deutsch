export function Card({ children, className = '', delay = 0 }) {
  return (
    <div
      className={`rise rounded-3xl border border-sand bg-white p-6 shadow-[0_1px_3px_rgb(0_0_0_/_0.04)] ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function CardLabel({ children }) {
  return (
    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-fog">
      {children}
    </h2>
  )
}

export function PillButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-clay py-3.5 font-semibold text-white shadow-[0_2px_8px_rgb(217_119_87_/_0.35)] transition-all duration-150 hover:bg-clay-deep active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

export function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ErrorNote({ children }) {
  return (
    <div className="rise rounded-3xl border border-clay/30 bg-clay-soft p-5 text-sm text-clay-deep">
      {children}
    </div>
  )
}

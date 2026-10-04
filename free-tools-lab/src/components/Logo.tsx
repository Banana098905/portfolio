export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="grid h-9 w-9 place-items-center rounded-xl bg-navy-800 text-white"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" />
          <path d="M7.5 15h9" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] font-bold tracking-tight text-navy-900">
          無料でできること研究所
        </span>
        <span className="text-[10px] tracking-[0.18em] text-navy-500">FREE TOOLS LAB</span>
      </span>
    </span>
  );
}

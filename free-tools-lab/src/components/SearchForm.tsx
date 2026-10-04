type Props = {
  id: string;
  size?: 'md' | 'lg';
  className?: string;
  placeholder?: string;
};

/**
 * JavaScript なしでも動く検索フォーム。
 * 送信すると /articles?q=キーワード に移動し、記事一覧側で絞り込みます。
 */
export function SearchForm({
  id,
  size = 'md',
  className = '',
  placeholder = '記事を検索（例：PDF、画像、AI）',
}: Props) {
  const inputSize = size === 'lg' ? 'h-14 pl-5 pr-14 text-base' : 'h-10 pl-4 pr-11 text-sm';
  const buttonSize = size === 'lg' ? 'h-10 w-10 right-2' : 'h-8 w-8 right-1';

  return (
    <form action="/articles" method="get" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        記事を検索
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full rounded-full border border-line bg-white text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-navy-400 focus:ring-2 focus:ring-navy-200 ${inputSize}`}
      />
      <button
        type="submit"
        aria-label="検索する"
        className={`absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-navy-800 text-white transition hover:bg-navy-700 ${buttonSize}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}

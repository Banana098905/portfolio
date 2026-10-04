import Link from 'next/link';
import { SearchForm } from '@/components/SearchForm';

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="text-sm font-semibold tracking-[0.2em] text-iris">404</p>
      <h1 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">ページが見つかりませんでした</h1>
      <p className="mt-4 text-slate-600">
        URLが変更されたか、記事が移動・削除された可能性があります。キーワードで探すか、記事一覧からお探しください。
      </p>
      <SearchForm id="notfound-search" size="lg" className="mx-auto mt-8 max-w-xl" />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          ホームへ戻る
        </Link>
        <Link href="/articles" className="btn-secondary">
          記事一覧を見る
        </Link>
      </div>
    </div>
  );
}

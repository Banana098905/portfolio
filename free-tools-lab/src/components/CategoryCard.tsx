import Link from 'next/link';
import type { Category } from '@/lib/categories';
import { CategoryIcon } from './CategoryIcon';

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card group flex h-full flex-col gap-3 p-5"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist text-navy-700 transition group-hover:bg-iris-soft group-hover:text-iris">
        <CategoryIcon slug={category.slug} className="h-6 w-6" />
      </span>
      <span className="font-bold text-navy-900">{category.name}</span>
      <span className="text-sm leading-relaxed text-slate-600">{category.description}</span>
      <span className="mt-auto pt-1 text-xs font-medium text-slate-500">{count}件の記事</span>
    </Link>
  );
}

import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

type Props = {
  title: string;
  lead?: string;
  breadcrumbs: Crumb[];
  children: ReactNode;
};

/** about / contact / privacy / disclaimer など、読み物系の固定ページ共通の枠 */
export function PageShell({ title, lead, breadcrumbs, children }: Props) {
  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={breadcrumbs} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">{title}</h1>
        {lead && <p className="mt-4 text-lg leading-relaxed text-slate-600">{lead}</p>}
      </header>
      <div className="prose-jp mt-10 max-w-3xl">{children}</div>
    </div>
  );
}

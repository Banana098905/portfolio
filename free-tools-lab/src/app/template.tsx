/** ページ遷移ごとに再マウントされ、軽いフェードインが走ります */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}

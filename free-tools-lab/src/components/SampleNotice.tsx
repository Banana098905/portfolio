export function SampleNotice() {
  return (
    <div
      role="note"
      className="mt-8 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-950"
    >
      <p className="font-bold">これはサンプル記事です</p>
      <p className="mt-1">
        サイトの見た目と機能を確認するために用意した記事です。サービスの仕様・料金・画面の名称・手順などには未確認の内容が含まれるため、公開前に必ず最新の公式情報で確認し、修正してください。
      </p>
    </div>
  );
}

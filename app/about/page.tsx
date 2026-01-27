import Link from 'next/link'; // これをインポート

export default function AboutPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">About ページ</h1>
      {/* aタグを Linkコンポーネントに書き換える */}
      <Link href="/" className="text-blue-500 underline">
        トップへ戻る（爆速！）
      </Link>
    </div>
  );
}
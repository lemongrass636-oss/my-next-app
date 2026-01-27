import Link from 'next/link'; // これをインポート
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '私たちについて | My Next App',
  description: 'このページはNext.jsの学習用に作成されたAboutページです。',
};


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
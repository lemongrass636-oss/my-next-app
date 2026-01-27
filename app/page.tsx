import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">トップページ</h1>
      <Link href="/about" className="text-green-500 underline">
        Aboutページへ行く
      </Link>
    </main>
  );
}
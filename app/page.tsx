import Counter from "@/components/Counter";

export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">トップページへようこそ！</h2>
      <p>ここでは、Next.jsのクライアントコンポーネントを試しています。</p>
      
      {/* 作成したカウンターを呼び出す */}
      <Counter />
    </div>
  );
}
import UserForm from "@/components/UserForm";
import Link from "next/link";

export const metadata = {
  title: '私たちについて | My Next App',
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">About ページ</h2>
      <p className="text-gray-600">
        ここではNext.jsのフォーム操作を体験できます。
      </p>

      {/* フォームコンポーネントを配置 */}
      <UserForm />

      <div className="mt-10">
        <Link href="/" className="text-blue-500 hover:underline">
          ← トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
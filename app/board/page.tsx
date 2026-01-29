import { createClient } from "@/lib/supabase-server"; // 昨日のサーバー用クライアント
import { redirect } from "next/navigation";
import PostForm from "@/components/PostForm"; // 投稿フォームのコンポーネント
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase"; // DB窓口をインポート
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react"; // アイコンを使う場合（lucide-reactはNext.jsに標準で入っています）


export default async function BoardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. 投稿一覧などのデータ取得
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">掲示板</h1>

      {/* 2. ログイン状態による条件分岐 */}
      {user ? (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 mb-2">
            ログイン中: {user.email} さんとして投稿します
          </p>
          <PostForm />
        </div>
      ) : (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
          <p className="text-gray-600 mb-4">投稿するにはログインが必要です</p>
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            ログイン画面へ
          </a>
        </div>
      )}

      {/* 3. 投稿一覧の表示（ここは全員見れる） */}
      <div className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="p-4 border rounded shadow-sm">
            {post.content}
          </div>
        ))}
      </div>
    </div>
  );
}
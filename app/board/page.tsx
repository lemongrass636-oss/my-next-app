import { createClient } from "@/lib/supabase-server";
import PostForm from "@/components/PostForm";

export default async function BoardPage() {
  const supabase = createClient();

  // 1. ログインユーザー情報を取得
  const { data: { user } } = await supabase.auth.getUser();

  // 2. 投稿一覧を取得（最新順）
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("データ取得エラー:", error.message);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6 text-black">掲示板</h1>

      {/* --- 投稿フォームエリア --- */}
      {user ? (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-black">
          <p className="text-sm text-blue-600 mb-2 font-medium">
            ログイン中: {user.email} さん
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

      {/* --- 投稿一覧エリア --- */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="p-4 border rounded shadow-sm bg-white">
              <div className="flex justify-between items-start mb-2">
                {/* 投稿者のIDを表示（最初の8文字） */}
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">
                  Author ID: {post.user_id?.substring(0, 8)}...
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleString("ja-JP")}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-10">まだ投稿がありません。</p>
        )}
      </div>
    </div>
  );
}
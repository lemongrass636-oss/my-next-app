import { createClient } from "@/lib/supabase-server";
import PostForm from "@/components/PostForm";
import { updateProfile } from "@/app/board/actions"; // 編集用のアクション
import { revalidatePath } from "next/cache";

export const revalidate = 0; // 常に最新データを取得するための設定

export default async function BoardPage() {
  const supabase = createClient();

  // 1. ログインユーザー情報を取得
  const { data: { user } } = await supabase.auth.getUser();

  // 2. 投稿一覧を取得（プロフィール情報も結合）
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles (
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("データ取得エラー:", error.message);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-black">
      <h1 className="text-3xl font-bold mb-8 text-black border-b pb-2">掲示板</h1>

      {user ? (
        <div className="space-y-6 mb-12">
          {/* --- プロフィール編集エリア (アコーディオン) --- */}
          <details className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600 transition">
              👤 プロフィール設定を変更する
            </summary>
            <form action={updateProfile} className="mt-4 flex flex-col gap-4 max-w-sm">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">表示用メールアドレス</label>
                <input 
                  name="email" 
                  defaultValue={user.email} 
                  placeholder="表示したいメールアドレス"
                  className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button 
                type="submit" 
                className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black transition w-fit"
              >
                プロフィールを更新
              </button>
            </form>
          </details>

          {/* --- 新規投稿フォーム --- */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 mb-3 font-medium">
              ✨ ログイン中: <span className="font-bold">{user.email}</span>
            </p>
            <PostForm />
          </div>
        </div>
      ) : (
        <div className="mb-12 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
          <p className="text-gray-600 mb-4 font-medium">投稿やプロフィールの編集にはログインが必要です</p>
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition font-bold"
          >
            ログインして参加する
          </a>
        </div>
      )}

      {/* --- 投稿一覧エリア --- */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black">
        💬 みんなの投稿
      </h2>
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <div key={post.id} className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-wider">
                  {post.profiles?.email || "Unknown User"}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  {new Date(post.created_at).toLocaleString("ja-JP")}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-400">まだ投稿がありません。最初の投稿をしてみませんか？</p>
          </div>
        )}
      </div>
    </div>
  );
}
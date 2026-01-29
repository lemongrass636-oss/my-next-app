import { createClient } from "@/lib/supabase-server";
import PostForm from "@/components/PostForm";
import { updateProfile } from "@/app/board/actions";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function BoardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles (
        display_name
      )
    `) // profiles から display_name を取得するように変更
    .order("created_at", { ascending: false });

  if (error) {
    console.error("データ取得エラー:", error.message);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-black">
      <h1 className="text-3xl font-bold mb-8 text-black border-b pb-2">SNS掲示板</h1>

      {user ? (
        <div className="space-y-6 mb-12">
          {/* --- プロフィール編集エリア --- */}
          <details className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600 transition">
              👤 ニックネームを設定する
            </summary>
            <form action={updateProfile} className="mt-4 flex flex-col gap-4 max-w-sm">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">あなたのニックネーム</label>
                <input 
                  name="nickname" 
                  defaultValue={""} // 最初は空か、取得した現在の名前を入れる
                  placeholder="例: たろう、エンジニア君"
                  className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition w-fit font-bold"
              >
                名前を保存
              </button>
            </form>
          </details>

          {/* --- 新規投稿フォーム --- */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <PostForm />
          </div>
        </div>
      ) : (
        <div className="mb-12 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
          <p className="text-gray-600 mb-4">参加するにはログインが必要です</p>
          <a href="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-bold">ログイン</a>
        </div>
      )}

      {/* --- 投稿一覧エリア --- */}
      <h2 className="text-xl font-bold mb-4 text-black">💬 最新の投稿</h2>
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <div key={post.id} className="p-5 border rounded-xl shadow-sm bg-white">
              <div className="flex justify-between items-center mb-3">
                {/* メールアドレスの代わりに display_name を表示 */}
                <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  @{post.profiles?.display_name || "名無しのユーザー"}
                </span>
                <span className="text-[11px] text-gray-400">
                  {new Date(post.created_at).toLocaleString("ja-JP")}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-10">まだ投稿がありません。</p>
        )}
      </div>
    </div>
  );
}
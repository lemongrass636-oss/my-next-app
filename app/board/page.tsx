import { createClient } from "@/lib/supabase-server";
import PostForm from "@/components/PostForm";
import DeleteButton from "@/components/DeleteButton"; // 追加
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
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("データ取得エラー:", error.message);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-black">
      <h1 className="text-3xl font-bold mb-8 border-b pb-2">SNS掲示板</h1>

      {user ? (
        <div className="space-y-6 mb-12">
          {/* プロフィール編集 */}
          <details className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700">
              👤 ニックネーム設定
            </summary>
            <form action={updateProfile} className="mt-4 flex flex-col gap-4 max-w-sm">
              <input 
                name="nickname" 
                placeholder="新しいニックネーム"
                className="p-2 border rounded text-sm text-black"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">保存</button>
            </form>
          </details>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <PostForm />
          </div>
        </div>
      ) : (
        <div className="mb-12 p-8 bg-gray-50 rounded-lg border text-center text-black">
          <a href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold">ログインして参加</a>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">💬 最新の投稿</h2>
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <div key={post.id} className="p-5 border rounded-xl shadow-sm bg-white">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  @{post.profiles?.display_name || "名無しのユーザー"}
                </span>
                
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-gray-400">
                    {new Date(post.created_at).toLocaleString("ja-JP")}
                  </span>
                  
                  {/* --- 切り出した削除ボタンを使用 --- */}
                  {user && post.user_id === user.id && (
                    <DeleteButton postId={post.id} />
                  )}
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-10">投稿がありません。</p>
        )}
      </div>
    </div>
  );
}
import { createClient } from "@/lib/supabase-server";
import PostForm from "@/components/PostForm";
import DeleteButton from "@/components/DeleteButton";
import { updateProfile } from "@/app/board/actions";

export const revalidate = 0;

export default async function BoardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. 投稿一覧と一緒に、ログインユーザー自身のプロフィールも取得する
  const { data: posts } = await supabase
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

  // 2. ログインユーザーの現在のニックネームを取得（警告表示用）
  let currentNickname = null;
  if (user) {
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    currentNickname = myProfile?.display_name;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-black">
      <h1 className="text-3xl font-bold mb-8 border-b pb-2">SNS掲示板</h1>

      {user ? (
        <div className="space-y-6 mb-12">
          
          {/* --- 【追加】ニックネーム未設定時の警告アラート --- */}
          {!currentNickname && (
            <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2">
                ⚠️ ニックネームが設定されていません
              </h3>
              <p className="text-sm text-red-600 mb-4">
                投稿する前に、あなたのお名前（ニックネーム）を決めてください。
              </p>
              <form action={updateProfile} className="flex gap-2">
                <input 
                  name="nickname" 
                  required
                  placeholder="例: 山田太郎"
                  className="flex-1 p-2 border-2 border-red-200 rounded text-sm text-black outline-none focus:border-red-400"
                />
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition">
                  名前を登録
                </button>
              </form>
            </div>
          )}

          {/* ニックネーム設定済みの場合のみ投稿フォームを表示する（任意） */}
          {currentNickname ? (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-600 mb-3 font-medium">
                ✨ ログイン中: <span className="font-bold">{currentNickname}</span> さん
              </p>
              <PostForm />
            </div>
          ) : (
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 opacity-50 pointer-events-none">
              <p className="text-sm text-gray-500">名前を設定すると投稿できるようになります</p>
            </div>
          )}

          {/* 既存のプロフィール編集（アコーディオン） */}
          <details className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700">
              ⚙️ 設定変更
            </summary>
            <form action={updateProfile} className="mt-4 flex flex-col gap-4 max-w-sm">
              <input name="nickname" defaultValue={currentNickname || ""} className="p-2 border rounded text-sm text-black" />
              <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-bold">更新</button>
            </form>
          </details>
        </div>
      ) : (
        <div className="mb-12 p-8 bg-gray-50 rounded-lg border text-center text-black">
          <a href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold">ログインして参加</a>
        </div>
      )}

      {/* 投稿一覧 */}
      <h2 className="text-xl font-bold mb-4">💬 最新の投稿</h2>
      <div className="space-y-4">
        {posts?.map((post: any) => (
          <div key={post.id} className="p-5 border rounded-xl shadow-sm bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                @{post.profiles?.display_name || "名無しのユーザー"}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-gray-400">{new Date(post.created_at).toLocaleString("ja-JP")}</span>
                {user && post.user_id === user.id && <DeleteButton postId={post.id} />}
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
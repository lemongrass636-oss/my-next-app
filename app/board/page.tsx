import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { addPost, deletePost, updateProfile } from "./actions";
import AvatarUpload from "@/components/AvatarUpload"; // インポート追加

export default async function BoardPage() {
  const supabase = createClient();

  // 1. ユーザー情報の取得
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. プロフィール情報の取得（avatar_urlを追加）
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  const currentNickname = currentProfile?.display_name;

  // 3. 投稿一覧の取得（profilesのavatar_urlも一緒に取得するように修正）
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("データ取得エラー:", error.message);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6">掲示板</h1>

      {/* ユーザー設定（アコーディオン） */}
      <div className="mb-8">
        <details className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700">
            ⚙️ プロフィール設定
          </summary>
          <div className="mt-4">
            {/* アイコンアップロード用コンポーネント */}
            <AvatarUpload userId={user.id} currentAvatarUrl={currentProfile?.avatar_url} />

            <form action={updateProfile} className="mt-4 flex flex-col gap-4 max-w-sm mx-auto">
              <div>
                <label className="text-xs text-gray-500 font-bold ml-1">ニックネーム</label>
                <input
                  name="nickname"
                  defaultValue={currentNickname || ""}
                  placeholder="未設定"
                  className="w-full p-2 border rounded text-sm text-black"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-bold hover:bg-black transition"
              >
                名前を更新
              </button>
            </form>
          </div>
        </details>
      </div>

      {/* 投稿フォーム */}
      <form action={addPost} className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <textarea
          name="content"
          placeholder="いまどうしてる？"
          className="w-full p-3 border rounded-md text-black focus:ring-2 focus:ring-blue-400 outline-none"
          rows={3}
          required
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            ログイン中: <span className="font-bold">{currentNickname || user.email}</span>
          </p>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition"
          >
            投稿する
          </button>
        </div>
      </form>

      {/* 投稿一覧 */}
      <div className="space-y-4">
        {posts?.map((post: any) => (
          <div key={post.id} className="p-4 bg-white border rounded-lg shadow-sm flex gap-4">
            {/* 投稿の横にアイコンを表示 */}
            <div className="flex-shrink-0">
              {post.profiles?.avatar_url ? (
                <img
                  src={post.profiles.avatar_url}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm text-blue-900">
                  {post.profiles?.display_name || "名無しさん"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(post.created_at).toLocaleString("ja-JP")}
                </span>
              </div>
              <p className="mt-1 text-sm whitespace-pre-wrap">{post.content}</p>

              {/* 自分の投稿なら削除ボタンを表示 */}
              {user.id === post.user_id && (
                <form action={deletePost} className="mt-2 text-right">
                  <input type="hidden" name="postId" value={post.id} />
                  <button className="text-xs text-red-400 hover:text-red-600 transition">
                    削除する
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
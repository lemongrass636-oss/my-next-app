import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { addPost, deletePost, updateProfile } from "./actions";
import AvatarUpload from "@/components/AvatarUpload";

export default async function BoardPage() {
  const supabase = createClient();

  // 1. ユーザー情報の取得
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. プロフィール情報の取得
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  const currentNickname = currentProfile?.display_name;

  // 3. 投稿一覧の取得
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
    <div className="max-w-2xl mx-auto p-4 text-black pb-20">
      <h1 className="text-2xl font-bold mb-6 text-center">掲示板</h1>

      {/* ユーザー設定（アコーディオン） */}
      <div className="mb-8">
        <details className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700">
            ⚙️ プロフィール設定
          </summary>
          <div className="mt-4">
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

      {/* 投稿一覧 */}
      <div className="space-y-6 mb-10">
        {posts?.map((post: any) => {
          // 自分の投稿かどうかを判定
          const isMyPost = user.id === post.user_id;

          return (
            <div 
              key={post.id} 
              className={`flex items-end gap-2 ${isMyPost ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* アイコン */}
              <div className="flex-shrink-0 mb-1">
                {post.profiles?.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-400 border">
                    No
                  </div>
                )}
              </div>

              {/* 投稿内容の塊 */}
              <div className={`flex flex-col max-w-[75%] ${isMyPost ? "items-end" : "items-start"}`}>
                {/* 名前 */}
                <span className="text-[10px] text-gray-500 mb-1 px-1">
                  {post.profiles?.display_name || "名無しさん"}
                </span>

                {/* 吹き出し */}
                <div
                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                    isMyPost
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-black border border-gray-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{post.content}</p>
                </div>

                {/* 日時と削除ボタン */}
                <div className={`flex items-center gap-2 mt-1 px-1 ${isMyPost ? "flex-row-reverse" : "flex-row"}`}>
                  <span className="text-[9px] text-gray-400">
                    {new Date(post.created_at).toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {isMyPost && (
                    <form action={deletePost}>
                      <input type="hidden" name="postId" value={post.id} />
                      <button className="text-[10px] text-red-400 hover:text-red-600 transition">
                        削除
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 画面下部に固定された投稿フォーム */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4">
        <form action={addPost} className="max-w-2xl mx-auto flex gap-2">
          <textarea
            name="content"
            placeholder="メッセージを入力..."
            className="flex-grow p-2 border rounded-xl text-sm text-black focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            rows={1}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition"
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
}
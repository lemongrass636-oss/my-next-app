import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { addPost, deletePost, updateProfile, toggleLike } from "./actions";
import AvatarUpload from "@/components/AvatarUpload";
import DeleteButton from "@/components/DeleteButton";

export default async function BoardPage() {
  const supabase = createClient();

  // 1. ユーザー情報の取得
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. プロフィール情報の取得
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  // 3. 投稿一覧と「いいね」情報の取得
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
      ),
      likes (
        user_id
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error.message);
  }

  return (
    // 全体の背景を少しグレーにして、チャットを見やすく
    <div className="min-h-screen bg-gray-100 text-black pb-24">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">みんなの掲示板</h1>

        {/* 設定用アコーディオン（アバター・名前変更） */}
        <div className="mb-8">
          <details className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-600 list-none flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform">▶</span>
              ⚙️ プロフィール設定
            </summary>
            <div className="mt-6 text-center border-t pt-4">
              <AvatarUpload userId={user.id} currentAvatarUrl={currentProfile?.avatar_url} />
              <form action={updateProfile} className="mt-4 flex flex-col gap-3 max-w-sm mx-auto">
                <div className="flex flex-col text-left">
                  <label className="text-[10px] text-gray-400 ml-1 mb-1">表示名</label>
                  <input 
                    name="nickname" 
                    defaultValue={currentProfile?.display_name || ""} 
                    className="p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white outline-blue-500"
                    placeholder="ニックネーム"
                  />
                </div>
                <button className="bg-gray-800 hover:bg-black text-white p-2 rounded-lg text-sm font-bold transition-colors">
                  設定を保存
                </button>
              </form>
            </div>
          </details>
        </div>

        {/* 投稿一覧エリア */}
        <div className="space-y-6">
          {posts?.map((post: any) => {
            const isMyPost = user.id === post.user_id;
            
            // いいね状態の計算
            const myLike = post.likes?.find((like: any) => like.user_id === user.id);
            const isLiked = !!myLike;
            const likeCount = post.likes?.length || 0;

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
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                      alt="icon" 
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-white shadow-sm">
                      No Img
                    </div>
                  )}
                </div>

                {/* 吹き出しとアクション */}
                <div className={`flex flex-col max-w-[75%] ${isMyPost ? "items-end" : "items-start"}`}>
                  {/* 表示名 */}
                  <span className="text-[10px] text-gray-500 mb-1 px-1 font-medium">
                    {post.profiles?.display_name || "名無しさん"}
                  </span>
                  
                  {/* メッセージ本文 */}
                  <div className={`p-3 rounded-2xl text-[15px] shadow-sm relative ${
                    isMyPost 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-black border border-gray-200 rounded-tl-none"
                  }`}>
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{post.content}</p>
                  </div>

                  {/* 下部：いいね・時刻・削除 */}
                  <div className={`flex items-center gap-3 mt-1.5 px-1 ${isMyPost ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* いいねボタン */}
                    <form action={toggleLike} className="flex items-center">
                      <input type="hidden" name="postId" value={post.id} />
                      <input type="hidden" name="isLiked" value={String(isLiked)} />
                      <button className={`
                        flex items-center gap-1 transition-all active:scale-150
                        ${isLiked ? "text-pink-500" : "text-gray-400 hover:text-pink-400"}
                      `}>
                        <span className="text-lg">{isLiked ? "❤️" : "♡"}</span>
                        {likeCount > 0 && (
                          <span className="text-[11px] font-bold">{likeCount}</span>
                        )}
                      </button>
                    </form>

                    {/* 時刻 */}
                    <span className="text-[10px] text-gray-400 font-light">
                      {new Date(post.created_at).toLocaleTimeString("ja-JP", { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    
                    {/* 自分の投稿なら削除ボタン表示 */}
                    {isMyPost && (
                      <DeleteButton postId={post.id} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 下部固定：メッセージ送信フォーム */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <form action={addPost} className="max-w-2xl mx-auto flex gap-2 items-end">
          <textarea 
            name="content" 
            placeholder="メッセージを入力..." 
            className="flex-grow p-3 bg-gray-100 border-none rounded-2xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all max-h-32" 
            rows={1}
            required 
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full text-sm font-bold shadow-lg transition-transform active:scale-95 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
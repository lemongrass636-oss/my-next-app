import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { addPost, updateProfile,signOut } from "./actions";
import AvatarUpload from "@/components/AvatarUpload";
import DeleteButton from "@/components/DeleteButton";
import SubmitButton from "@/components/SubmitButton";
import LikeButton from "@/components/LikeButton";

export default async function BoardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      image_url,
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

  if (error) console.error("Error fetching posts:", error.message);

  return (
    <div className="min-h-screen bg-gray-100 text-black pb-24 font-sans text-[15px]">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 tracking-tight">
          みんなの掲示板
        </h1>

        {/* 設定用アコーディオン */}
        <div className="mb-8">
          <details className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-600 list-none flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform duration-200">▶</span>
              ⚙️ プロフィール設定
            </summary>
            <div className="mt-6 text-center border-t pt-4">
              <AvatarUpload userId={user.id} currentAvatarUrl={currentProfile?.avatar_url} />
              <form action={updateProfile} className="mt-4 flex flex-col gap-3 max-w-sm mx-auto text-left">
                <input 
                  name="nickname" 
                  defaultValue={currentProfile?.display_name || ""} 
                  className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  placeholder="ニックネームを入力"
                  maxLength={20}
                />
                <button className="bg-gray-800 hover:bg-black text-white p-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                  設定を保存
                </button>
              </form>
              {/* ログアウトボタンを追加 */}
              <form action={signOut} className="mt-2">
                <button className="text-[10px] text-gray-400 hover:text-red-500 transition-colors">
                  ログアウトする
                </button>
              </form>
            </div>
          </details>
        </div>

        {/* 投稿一覧 */}
        <div className="space-y-6">
          {posts?.map((post: any) => {
            const isMyPost = user.id === post.user_id;
            const myLike = post.likes?.find((like: any) => like.user_id === user.id);
            const isLiked = !!myLike;
            const likeCount = post.likes?.length || 0;

            return (
              <div key={post.id} className={`flex items-end gap-2 ${isMyPost ? "flex-row-reverse" : "flex-row"}`}>
                <div className="flex-shrink-0 mb-1">
                  {post.profiles?.avatar_url ? (
                    <img src={post.profiles.avatar_url} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="avatar" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-white shadow-sm">No</div>
                  )}
                </div>

                <div className={`flex flex-col max-w-[75%] ${isMyPost ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-gray-500 mb-1 px-1 font-medium">{post.profiles?.display_name || "名無しさん"}</span>
                  
                  {/* 吹き出し */}
                  <div className={`p-3 rounded-2xl shadow-sm ${isMyPost ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-black border border-gray-200 rounded-tl-none"}`}>
                    {/* 投稿された画像がある場合に表示 */}
                    {post.image_url && (
                      <div className="mb-2">
                        <img 
                          src={post.image_url} 
                          alt="post image" 
                          className="rounded-lg max-w-full h-auto border border-gray-100"
                        />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{post.content}</p>
                  </div>

                  <div className={`flex items-center gap-3 mt-1.5 px-1 ${isMyPost ? "flex-row-reverse" : "flex-row"}`}>
                    <LikeButton postId={post.id} isLiked={isLiked} likeCount={likeCount} />
                    <span className="text-[10px] text-gray-400 font-light tabular-nums">
                      {new Date(post.created_at).toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMyPost && <DeleteButton postId={post.id} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 下部固定：メッセージ送信フォーム */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-lg z-10">
        <form 
          action={addPost} 
          key={posts?.length}
          className="max-w-2xl mx-auto flex gap-2 items-end"
        >
          {/* 画像選択用の隠しinputとカメラアイコン */}
          <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              className="hidden" 
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </label>

          <textarea 
            name="content" 
            placeholder="メッセージを入力..." 
            className="flex-grow p-3 bg-gray-100 border-none rounded-2xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all max-h-32 min-h-[44px]" 
            rows={1}
            maxLength={200}
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
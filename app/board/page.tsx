import { revalidatePath } from "next/cache";

// 本来はDBから取得しますが、今回は動作確認用に簡易的な配列を用意します
// ※開発サーバーを再起動するとリセットされます
const comments = ["最初の投稿です！"];

export default async function BoardPage() {
  
  // これが Server Action です
  async function addComment(formData: FormData) {
    "use server"; // この関数は必ずサーバーで実行されるという宣言

    const comment = formData.get("comment") as string;
    
    if (comment) {
      comments.push(comment);
      // データの変更後、このページのキャッシュを捨てて最新状態を再描画させる
      revalidatePath("/board");
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2">簡易掲示板</h2>

      {/* フォームの action に関数をそのまま渡せるのが Next.js の凄さです */}
      <form action={addComment} className="flex flex-col gap-3">
        <textarea
          name="comment"
          placeholder="コメントを入力してください..."
          className="border p-2 rounded text-black h-24 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
        >
          投稿する
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-500 uppercase tracking-wider">投稿一覧</h3>
        <ul className="space-y-2">
          {comments.map((c, i) => (
            <li key={i} className="p-3 bg-white border rounded shadow-sm">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
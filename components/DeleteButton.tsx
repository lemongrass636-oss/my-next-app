'use client' // これが重要です！

import { deletePost } from "@/app/board/actions";

export default function DeleteButton({ postId }: { postId: string }) {
  const handleDelete = async (formData: FormData) => {
    // ブラウザの確認ダイアログを表示
    if (!confirm("本当にこの投稿を削除しますか？")) {
      return;
    }
    // 実際の削除処理を実行
    await deletePost(formData);
  };

  return (
    <form action={handleDelete}>
      <input type="hidden" name="postId" value={postId} />
      <button 
        type="submit" 
        className="text-[10px] text-red-300 hover:text-red-500 transition-colors"
      >
        削除
      </button>
    </form>
  );
}
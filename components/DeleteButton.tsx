"use client"; // これが重要です！

import { deletePost } from "@/app/board/actions";

export default function DeleteButton({ postId }: { postId: string }) {
  return (
    <form action={deletePost}>
      <input type="hidden" name="postId" value={postId} />
      <button 
        type="submit" 
        className="text-red-400 hover:text-red-600 text-xs font-bold transition p-1"
        onClick={(e) => {
          // ブラウザの確認ダイアログを表示
          if (!confirm("本当に削除しますか？")) {
            e.preventDefault();
          }
        }}
      >
        [削除]
      </button>
    </form>
  );
}
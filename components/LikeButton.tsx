'use client'

import { useFormStatus } from 'react-dom'
import { toggleLike } from '@/app/board/actions'

export default function LikeButton({ postId, isLiked, likeCount }: { postId: string, isLiked: boolean, likeCount: number }) {
  const { pending } = useFormStatus()

  return (
    <form action={toggleLike} className="flex items-center">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="isLiked" value={String(isLiked)} />
      <button 
        disabled={pending} // 送信中はボタンを無効化
        className={`flex items-center gap-1 transition-all active:scale-150 ${
          pending ? "opacity-50 cursor-not-allowed" : ""
        } ${isLiked ? "text-pink-500" : "text-gray-400 hover:text-pink-400"}`}
      >
        <span className="text-lg">{isLiked ? "❤️" : "♡"}</span>
        {likeCount > 0 && <span className="text-[11px] font-bold">{likeCount}</span>}
      </button>
    </form>
  )
}
'use client'

import { useState, useRef } from 'react'
import SubmitButton from './SubmitButton'
import { addPost } from '@/app/board/actions'

export default function PostForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // 画像が選択された時の処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // ブラウザ内だけで使える一時的なURLを作成
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // キャンセルボタン
  const clearImage = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        await addPost(formData)
        formRef.current?.reset() // フォームを空にする
        setPreviewUrl(null)      // プレビューを消す
      }}
      className="max-w-2xl mx-auto flex flex-col gap-2"
    >
      {/* プレビュー表示エリア */}
      {previewUrl && (
        <div className="relative inline-block ml-12 mb-2">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-500 shadow-md"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-lg"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex gap-2 items-end">
        {/* 画像選択ボタン */}
        <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
          <input 
            type="file" 
            name="image" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageChange}
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
      </div>
    </form>
  )
}
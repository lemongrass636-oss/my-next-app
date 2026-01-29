"use client";

import { useRef } from "react";
import { addPost } from "@/app/board/actions"; // これを追加

export default function PostForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addPost(formData); // サーバーアクションを呼び出し
        formRef.current?.reset(); // 成功したら入力欄を空にする
      }}
      className="flex flex-col gap-3"
    >
      <textarea
        name="content"
        rows={3}
        placeholder="今、何を考えてる？"
        className="w-full p-3 border rounded-md text-black focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 self-end transition"
      >
        投稿する
      </button>
    </form>
  );
}
"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function addPost(formData: FormData) {
  const content = formData.get("content") as string;
  const supabase = createClient();

  // 現在ログインしているユーザーの情報を取得
  const { data: { user } } = await supabase.auth.getUser();

  // ログインしていない場合はエラー（セキュリティ対策）
  if (!user) {
    throw new Error("ログインが必要です");
  }

  // Supabaseの posts テーブルにデータを挿入
  const { error } = await supabase.from("posts").insert({
    content: content,
    user_id: user.id, // 誰が書いたか保存する
  });

  if (error) {
    console.error("投稿エラー:", error.message);
    return;
  }

  // 掲示板ページを更新して、新しい投稿を即座に反映させる
  revalidatePath("/board");
}
"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- 1. 投稿を追加する (PostFormから呼ばれる) ---
export async function addPost(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("認証が必要です");

  const content = formData.get("content") as string;
  if (!content) return;

  const { error } = await supabase
    .from("posts")
    .insert([{ content, user_id: user.id }]);

  if (error) {
    console.error("投稿エラー:", error.message);
    return;
  }

  revalidatePath("/board");
}

// --- 2. プロフィール（ニックネーム）を更新する ---
export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("認証が必要です");

  const nickname = formData.get("nickname") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: nickname })
    .eq("id", user.id);

  if (error) {
    console.error("更新エラー:", error.message);
    return;
  }

  revalidatePath("/board");
}

// --- 3. 投稿を削除する (DeleteButtonから呼ばれる) ---
export async function deletePost(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("ログインが必要です");

  const postId = formData.get("postId") as string;

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    console.error("削除エラー:", error.message);
    return;
  }

  revalidatePath("/board");
}

// --- 4. ログアウト ---
export async function signOut() {
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  // リダイレクト先を /login に変更
  redirect("/login"); 
}
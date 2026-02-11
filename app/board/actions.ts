"use server"; // ← これが必須です！

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 投稿を追加する
export async function addPost(formData: FormData) {
  const supabase = createClient();
  const content = formData.get("content") as string;
  const imageFile = formData.get("image") as File;

  // テキストも画像もない場合は送信しない
  if ((!content || !content.trim()) && (!imageFile || imageFile.size === 0)) {
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  let imageUrl = null;

  // 画像がある場合のアップロード処理
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("post_images")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
    } else {
      const { data } = supabase.storage.from("post_images").getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }
  }

  // データベースへ保存（image_urlを追加）
  const { error } = await supabase.from("posts").insert({
    content,
    user_id: user.id,
    image_url: imageUrl,
  });

  if (error) console.error("Insert error:", error.message);

  revalidatePath("/board");
}

// 投稿を削除する
export async function deletePost(formData: FormData) {
  const supabase = createClient();
  const postId = formData.get("postId") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 1. 削除前に投稿情報を取得して画像URLがあるか確認
  const { data: post } = await supabase
    .from("posts")
    .select("image_url")
    .eq("id", postId)
    .single();

  // 2. 画像があればStorageからも削除
  if (post?.image_url) {
    const fileName = post.image_url.split("/").pop();
    if (fileName) {
      await supabase.storage.from("post_images").remove([fileName]);
    }
  }

  // 3. データベースから投稿を削除
  await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  revalidatePath("/board");
}

// プロフィールを更新する
export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const displayName = formData.get("nickname") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  revalidatePath("/board");
}

// いいねの切り替え
export async function toggleLike(formData: FormData) {
  const supabase = createClient();
  const postId = formData.get("postId") as string;
  const isLiked = formData.get("isLiked") === "true";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (isLiked) {
    await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
  } else {
    await supabase.from("likes").insert({
      post_id: postId,
      user_id: user.id,
    });
  }

  revalidatePath("/board");
}
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client"; // クライアント用のclient
import { useRouter } from "next/navigation";

export default function AvatarUpload({ userId, currentAvatarUrl }: { userId: string, currentAvatarUrl?: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("画像を選択してください");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`; // 重複しないファイル名

      // 1. Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. 画像の公開URLを取得
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // 3. profilesテーブルのavatar_urlを更新
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      alert("プロフィール画像を更新しました！");
      router.refresh(); // 画面を更新して画像を反映
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {currentAvatarUrl ? (
        <img src={currentAvatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-blue-500" />
      ) : (
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
      )}
      
      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700">
        {uploading ? "アップロード中..." : "画像を変更"}
        <input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
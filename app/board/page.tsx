import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase"; // DB窓口をインポート
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BoardPage() {
  // 1. DBから投稿一覧を取得 (降順)
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  // 2. DBへ投稿を保存する Server Action
  async function addComment(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    
    if (content) {
      await supabase.from("posts").insert([{ content }]);
      revalidatePath("/board");
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <Card>
        <CardHeader><CardTitle>DB連動掲示板</CardTitle></CardHeader>
        <CardContent>
          <form action={addComment} className="grid gap-4">
            <textarea name="content" className="border p-3 rounded text-sm" required />
            <Button type="submit">投稿してDBに保存</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-6">
              <p>{post.content}</p>
              <span className="text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
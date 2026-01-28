import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase"; // DB窓口をインポート
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react"; // アイコンを使う場合（lucide-reactはNext.jsに標準で入っています）


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
  async function deletePost(formData: FormData) {
      "use server";
      const id = formData.get("id") as string;
    
      await supabase.from("posts").delete().eq("id", id);
      revalidatePath("/board");
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
        <h3 className="text-xl font-semibold">最新の投稿</h3>
        {posts?.map((post) => (
          <Card key={post.id} className="relative group">
            <CardContent className="pt-6">
              <p>{post.content}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleString()}
                </span>
                
                {/* 削除ボタンのフォーム */}
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
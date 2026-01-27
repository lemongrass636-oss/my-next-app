import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const comments = ["最初の投稿です！"];

export default async function BoardPage() {
  async function addComment(formData: FormData) {
    "use server";
    const comment = formData.get("comment") as string;
    if (comment) {
      comments.push(comment);
      revalidatePath("/board");
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Community Board</h2>
        <p className="text-muted-foreground">みんなの声をシェアしましょう。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新しい投稿</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addComment} className="grid gap-4">
            <textarea
              name="comment"
              placeholder="何を考えていますか？"
              className="min-h-[100px] w-full rounded-md border p-3 text-sm focus-visible:ring-2 focus-visible:ring-ring outline-none"
              required
            />
            <Button type="submit" className="w-full">
              投稿を公開する
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">最新の投稿</h3>
        {comments.map((c, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">{c}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
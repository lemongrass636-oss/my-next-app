type Post = {
  id: number;
  title: string;
  body: string;
};

export default async function PostsPage() {
  // 1. APIからデータを取得 (Server Side Fetching)
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const posts: Post[] = await response.json();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold italic">最新の記事一覧 (API取得)</h2>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id} className="p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition">
            <h3 className="font-bold text-lg text-blue-700 capitalize">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
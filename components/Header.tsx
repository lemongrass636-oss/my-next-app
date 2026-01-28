import Link from "next/link";
// ↓ ここを書き換えます！
import { createClient } from "@/lib/supabase-server"; 
import { logout } from "@/app/login/actions";

export default async function Header() {
  // ↓ lib/supabase-server.ts で作った関数を呼び出します
  const supabase = createClient(); 
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white border-b p-4 text-black">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        {/* 左側：メニュー */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl mr-4">My App</Link>
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <Link href="/about" className="hover:text-blue-500">About</Link>
          <Link href="/posts" className="hover:text-blue-500">Posts</Link>
          <Link href="/board" className="hover:text-blue-500">Board</Link>
        </div>
        
        {/* 右側：ログイン状態 */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden md:block text-xs text-gray-500">
                {user.email}
              </span>
              <form action={logout}>
                <button className="text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 px-3 py-1 rounded transition border">
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <Link 
              href="/login" 
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
            >
              ログイン
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
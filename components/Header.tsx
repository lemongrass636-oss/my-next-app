import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { signOut } from "@/app/board/actions";

export default async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b text-black font-sans">
      <div className="flex gap-6 items-center">
        {/* ロゴ（APP）をクリックした時、ログイン前は常にログイン画面へ、ログイン後はHomeへ行くようにします */}
        <Link href={user ? "/" : "/login"} className="font-extrabold text-xl tracking-tighter">
          APP
        </Link>
        
        {/* --- ログイン時のみ表示するメニュー群 --- */}
        {user && (
          <>
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link href="/posts" className="hover:text-blue-600 transition-colors">Posts</Link>
            <Link href="/board" className="hover:text-blue-600 font-bold text-blue-700">Board</Link>
          </>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline">{user.email}</span>
            <form action={signOut}>
              <button 
                type="submit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition text-black font-medium"
              >
                Logout
              </button>
            </form>
          </div>
        ) : (
          /* ログインしていない時はログインリンクのみ表示 */
          <Link 
            href="/login" 
            className="text-sm bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition font-bold"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
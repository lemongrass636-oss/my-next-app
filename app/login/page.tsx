import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">ログイン / 新規登録</h2>
      <form className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium">メールアドレス</label>
          <input name="email" type="email" required className="w-full border p-2 rounded text-black" />
        </div>
        <div>
          <label className="text-sm font-medium">パスワード</label>
          <input name="password" type="password" required className="w-full border p-2 rounded text-black" />
        </div>
        <div className="flex gap-2">
          <button formAction={login} className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            ログイン
          </button>
          <button formAction={signup} className="flex-1 bg-gray-100 text-black p-2 rounded hover:bg-gray-200 border">
            新規登録
          </button>
        </div>
      </form>
    </div>
  );
}
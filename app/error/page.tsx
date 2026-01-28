// app/error/page.tsx
export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">エラーが発生しました</h2>
      <p className="mt-2 text-gray-600">
        パスワードは6文字以上で入力してください。<br />
        または、すでに登録済みのメールアドレスかもしれません。
      </p>
      <a 
        href="/login" 
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ログイン画面に戻る
      </a>
    </div>
  );
}
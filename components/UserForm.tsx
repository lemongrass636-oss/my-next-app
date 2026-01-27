"use client";

import { useState } from "react";

export default function UserForm() {
  const [name, setName] = useState("");

  return (
    <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">プロフィール設定</h3>
      
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-gray-600">
          あなたのお名前を教えてください：
        </label>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 山田 太郎"
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />

        <div className="mt-4 p-4 bg-white rounded shadow-inner min-h-[60px]">
          {name ? (
            <p className="text-lg text-blue-600 animate-fade-in">
              こんにちは、<span className="font-bold">{name}</span> さん！ようこそ。
            </p>
          ) : (
            <p className="text-gray-400 italic">名前を入力すると挨拶が表示されます...</p>
          )}
        </div>
        
        <button
          onClick={() => {
            alert(`登録しました: ${name}`);
            setName("");
          }}
          disabled={!name}
          className="mt-2 bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          登録（リセット）
        </button>
      </div>
    </div>
  );
}
"use client"; // これが重要！

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white inline-block">
      <p className="text-lg mb-2">現在のカウント: <span className="font-bold">{count}</span></p>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        カウントアップ
      </button>
    </div>
  );
}
"use client";
import React from "react";
import Link from "next/link"; // Quan trọng: Phải có dòng này mới hết đỏ chỗ thẻ <Link>

export default function Farm3D() {
  return (
    <div className="w-full h-screen bg-cyan-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-black text-cyan-900 mb-8">🏝️ ĐẢO MÈO 3D ĐANG XÂY DỰNG</h1>
      
      <Link href="/">
        <button className="bg-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform">
          🚜 Quay lại Nông trại
        </button>
      </Link>

      <div className="mt-10 p-6 bg-white/50 rounded-3xl border-4 border-white">
          <p className="font-bold text-cyan-800">Mèo đang sửa code cho bác Thắng đây meow! 🐾</p>
      </div>
    </div>
  );
}

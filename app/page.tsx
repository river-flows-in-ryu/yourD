"use client";
import Link from "next/link";
import { CookiesProvider } from "react-cookie";

export default function Home() {
  return (
    <CookiesProvider>
      <main className="flex flex-1 f-full flex-col">
        <div className="w-full h-[300px] bg-blue-300"></div>
        <Link href="/goods/1">
          <button className="w-10 h-10">이동하자</button>
        </Link>
      </main>
    </CookiesProvider>
  );
}

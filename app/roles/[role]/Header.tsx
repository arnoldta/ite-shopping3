// app/(roles)/Header.tsx
"use client";

import { signOut } from "next-auth/react";

export default function Header({ email }: { email: string }) {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>Welcome, {email}</div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </header>
  );
}
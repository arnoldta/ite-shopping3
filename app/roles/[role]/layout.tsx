// app/(roles)/[role]/layout.tsx

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Header from "./Header";

export default async function RoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  // 1. Server‐side fetch of session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    // not signed in → login
    return redirect("/");
  }

  const { role } = await params;
  // 2. Normalize both sides and compare
  const routeRole = role.toUpperCase();          // e.g. "picker" → "PICKER"
  const userRole  = session.user.role.toUpperCase();    // from your Prisma enum

  if (routeRole !== userRole) {
    // wrong page for this user → send them to their correct route
    return redirect(`/roles/${session.user.role.toLowerCase()}`);
  }

  // 3. Authorized → render with a header that has Sign Out
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header email={session.user.email!} />
      <main className="p-6 text-black">{children}</main>
    </div>
  );
}
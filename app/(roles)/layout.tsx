// app/(roles)/layout.tsx

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Header from "./Header";

export default async function RolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This runs server-side only
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/");       // not logged in → login page
  }

  // Ensure the URL segment matches the user’s role
  // const segment = (children as any).props?.__nextRouteContext?.pages?.[0] 
  //   ?? ""; // you’d replace this with however you pull the segment
  // if (session.user.role.toLowerCase() !== segment) {
  //   redirect(`/${session.user.role.toLowerCase()}`);
  // }

  return (
    <>
      {/* Render a client‐side header with the signOut button */}
      <Header email={session.user.email} />
      <main>{children}</main>
    </>
  );
}
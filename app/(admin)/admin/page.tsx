import { getServerSession } from "next-auth";

export default async function AdminPage() {
  const session = await getServerSession();
  console.log("Session:", session);
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Signed in as {session.user?.email}</p>
      </div>
    );
  }
}

import Sidebar from "./AdminSidebar/Sidebar";

// Needs to pull metadata from kv store
export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar>{children}</Sidebar>;
}

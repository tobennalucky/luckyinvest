import { Sidebar } from "@/components/dashboard/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-8">{children}</main>
    </div>
  );
}

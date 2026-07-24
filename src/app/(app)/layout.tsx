import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { MobileTopBar } from "@/components/dashboard/MobileTopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col lg:flex-row">
      <MobileTopBar />
      <Sidebar />
      <main className="flex-1 overflow-x-hidden px-4 py-6 pb-24 sm:px-8 lg:pb-6">{children}</main>
      <MobileNav />
    </div>
  );
}

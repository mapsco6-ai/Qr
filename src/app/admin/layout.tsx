"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/items", label: "الأصناف والأسعار" },
  { href: "/admin/reviews", label: "التقييمات" },
  { href: "/admin/complaints", label: "الشكاوى" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <div dir="rtl">{children}</div>;
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div dir="rtl" className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="font-extrabold text-brand-700">لوحة تحكم المنيو</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-stone-500 hover:text-red-600"
          >
            تسجيل الخروج
          </button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                pathname.startsWith(item.href)
                  ? "bg-brand-600 text-white"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="whitespace-nowrap rounded-full bg-stone-100 px-4 py-1.5 text-sm font-semibold text-stone-600"
          >
            عرض المنيو ↗
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}

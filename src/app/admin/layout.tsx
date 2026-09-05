"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import FlameLogo from "@/components/FlameLogo";

const NAV_ITEMS = [
  { href: "/admin/items", label: "الأصناف والأسعار" },
  { href: "/admin/reviews", label: "التقييمات" },
  { href: "/admin/complaints", label: "الشكاوى" },
  { href: "/admin/settings", label: "الإعدادات" },
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
    <div dir="rtl" className="min-h-screen bg-cream-50">
      <header className="bg-charcoal-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <FlameLogo className="h-7 w-7" />
            <h1 className="font-extrabold text-cream-50">لوحة تحكم خان الجمر</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-charcoal-300 hover:text-ember-400"
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
                  ? "bg-ember-600 text-white"
                  : "bg-charcoal-800 text-charcoal-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="whitespace-nowrap rounded-full bg-charcoal-800 px-4 py-1.5 text-sm font-semibold text-charcoal-200"
          >
            عرض المنيو ↗
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}

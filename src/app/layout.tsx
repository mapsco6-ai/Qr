import type { Metadata } from "next";
import { Cairo, Rakkas } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

const rakkas = Rakkas({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-rakkas",
});

export const metadata: Metadata = {
  title: "خان الجمر | سيّد المشويات التركية",
  description: "المنيو الإلكتروني لمطعم خان الجمر - تصفح الأطباق والأسعار وأضف تقييمك",
};

const themeInitScript = `
try {
  if (!location.pathname.startsWith('/admin')) {
    var theme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${rakkas.variable}`}>
      <body className="bg-cream-50 font-sans text-charcoal-800 antialiased dark:bg-charcoal-950 dark:text-cream-50">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
